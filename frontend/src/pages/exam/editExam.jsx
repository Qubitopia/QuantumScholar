import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPut } from '../../common/api.js';
import { getCookie } from '../../common/cookie.js';
import { useQuery } from '../../common/appUtils.js';

// --- Helpers ---
const safeParseJSON = (strOrObj, fallback = null) => {
  if (!strOrObj) return fallback;
  if (typeof strOrObj === 'object') return strOrObj;
  try { return JSON.parse(strOrObj); } catch { return fallback; }
};

const defaultOptions = () => ['Option 1', 'Option 2'];

// Normalize questions from various shapes into our internal model
function normalizeLoadedQuestions(raw, totalQ, openEnded) {
  const out = [];
  const isKeyed = raw && typeof raw === 'object' && !Array.isArray(raw);
  const fromKeyed = () => {
    const keys = Object.keys(raw).filter((k) => /^q\d+$/i.test(k)).sort((a, b) => Number(a.replace(/\D/g, '')) - Number(b.replace(/\D/g, '')));
    const len = keys.length;
    const textStartKeyed = Math.max(0, len - (openEnded || 0));
    const arr = keys.map((k, i) => {
      const q = raw[k] || {};
      const t = String(q.type || q.Type || '').toLowerCase();
      const type = t === 'text' ? 'text' : t === 'msq' ? 'msq' : t === 'mcq' ? 'mcq' : (i >= textStartKeyed ? 'text' : 'mcq');
      const text = q.Question ?? q.question ?? '';
      const marks = Number(q.marks ?? q.Marks ?? 1) || 1;
      const options = Array.isArray(q.options) ? q.options.map(String) : (type === 'text' ? [] : defaultOptions());
      return { id: i + 1, text: String(text || ''), type, options, marks };
    });
    return arr;
  };
  const fromArray = () => {
    // Support {questions: [...]}
    const qs = Array.isArray(raw?.questions) ? raw.questions : Array.isArray(raw) ? raw : [];
    // provisional; final type/options decided below using last-N rule
    return qs.map((txt, i) => ({ id: i + 1, text: String(txt || ''), type: 'mcq', options: defaultOptions(), marks: 1 }));
  };
  const arr = isKeyed ? fromKeyed() : fromArray();
  // Ensure length to totalQ if provided
  const target = totalQ && totalQ > 0 ? totalQ : arr.length;
  const textStart = Math.max(0, target - (openEnded || 0));
  for (let i = 0; i < target; i++) {
    const existing = arr[i];
    if (existing) {
      out.push({
        id: i + 1,
        text: String(existing.text || ''),
        type: i >= textStart ? 'text' : (existing.type === 'msq' ? 'msq' : existing.type === 'mcq' ? 'mcq' : 'mcq'),
        options: (i >= textStart) ? [] : (Array.isArray(existing.options) && existing.options.length ? existing.options.map(String) : defaultOptions()),
        marks: Number(existing.marks || 1) || 1,
      });
    } else {
      out.push({ id: i + 1, text: '', type: i >= textStart ? 'text' : 'mcq', options: i >= textStart ? [] : defaultOptions(), marks: 1 });
    }
  }
  return out;
}

function normalizeLoadedAnswers(raw, questions) {
  // raw may be keyed {q1:{option:1|[1,2]}}, or {answers:["text or option text"]}
  const isKeyed = raw && typeof raw === 'object' && !Array.isArray(raw) && !Array.isArray(raw.answers);
  if (isKeyed) {
    const out = [];
    for (let i = 0; i < questions.length; i++) {
      const key = `q${i + 1}`;
      const q = questions[i];
      const a = raw[key] ?? {};
      if (q.type === 'text') out.push(String(a.answer ?? a.text ?? ''));
      else if (q.type === 'mcq') {
        const idx = Number(a.option);
        out.push(Number.isInteger(idx) ? idx : -1);
      } else {
        const arr = Array.isArray(a.option) ? a.option : [];
        out.push(arr.filter((n) => Number.isInteger(n)));
      }
    }
    return out;
  }
  // array form: answers as strings; for text, keep string; for objective, match option text(s)
  const arr = Array.isArray(raw?.answers) ? raw.answers : Array.isArray(raw) ? raw : [];
  return questions.map((q, i) => {
    const v = arr[i];
    if (q.type === 'text') return String(v || '');
    if (typeof v !== 'string') return q.type === 'mcq' ? -1 : [];
    const parts = v.split(',').map((s) => s.trim()).filter(Boolean);
    if (q.type === 'mcq') {
      const idx = q.options.findIndex((o) => o === v || o === parts[0]);
      return idx >= 0 ? idx : -1;
    }
    // msq
    const indices = parts.map((p) => q.options.findIndex((o) => o === p)).filter((i2) => i2 >= 0);
    return indices;
  });
}

function buildKeyedQuestionsJson(questions) {
  const obj = {};
  questions.forEach((q, i) => {
    obj[`q${i + 1}`] = {
      type: q.type.toUpperCase(),
      Question: q.text,
      marks: q.marks,
      ...(q.type !== 'text' ? { options: q.options } : {}),
    };
  });
  return obj;
}

function buildKeyedAnswersJson(questions, answers) {
  const obj = {};
  questions.forEach((q, i) => {
    if (q.type === 'text') obj[`q${i + 1}`] = {};
    else if (q.type === 'mcq') obj[`q${i + 1}`] = { option: Number.isInteger(answers[i]) ? answers[i] : -1 };
    else obj[`q${i + 1}`] = { option: Array.isArray(answers[i]) ? answers[i] : [] };
  });
  return obj;
}

export default function EditExam() {
  const navigate = useNavigate();
  const query = useQuery();
  const id = query.get('test_id');
  const token = getCookie('qs-token');

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [qJson, setQJson] = useState('');
  const [aJson, setAJson] = useState('');
  const [jsonError, setJsonError] = useState('');

  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const dragGhostRef = useRef(null);

  const openEndedCount = useMemo(() => Number(exam?.number_of_open_ended_questions || 0) || 0, [exam]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        if (!id) throw new Error('Missing test_id');
        const res = await apiGet(`/api/test/${id}`, { token });
        const data = res?.data || res || {};
        if (cancelled) return;
        setExam(data);
        const totalQ = Number(data?.number_of_questions || 0) || 0;
        const openEnded = Number(data?.number_of_open_ended_questions || 0) || 0;
        const rawQ = safeParseJSON(data?.questions_json, data?.questions_json) || safeParseJSON(data?.questions, data?.Questions) || {};
        const rawA = safeParseJSON(data?.answer_json, data?.answer_json) || safeParseJSON(data?.answers, data?.Answers) || {};
        const qs = normalizeLoadedQuestions(rawQ, totalQ, openEnded);
        const ans = normalizeLoadedAnswers(rawA, qs);
        // Enforce open-ended positions (last N positions)
        const textPositions = qs.map((q, i) => (q.type === 'text' ? i : -1)).filter((i) => i >= 0);
        const textStart = Math.max(0, (totalQ || qs.length) - openEnded);
        const ok = textPositions.length === openEnded && textPositions.every((pos) => pos >= textStart);
        if (!ok) {
          const texts = qs.filter((q) => q.type === 'text').slice(0, openEnded);
          const nonTexts = qs.filter((q) => q.type !== 'text');
          const nonLen = Math.max(0, (totalQ || qs.length) - texts.length);
          const firstPart = nonTexts.slice(0, nonLen);
          const fixed = [...firstPart, ...texts].slice(0, totalQ || qs.length);
          const newAns = fixed.map((q) => (q.type === 'text' ? '' : q.type === 'mcq' ? -1 : []));
          setQuestions(fixed);
          setAnswers(newAns);
          setActiveIdx(0);
        } else {
          setQuestions(qs);
          setAnswers(ans);
          setActiveIdx(0);
        }
      } catch (e) {
        if (!cancelled) setError(e?.response?.data?.message || e.message || 'Failed to load exam');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id, token]);

  useEffect(() => {
    try {
      const qObj = { questions_json: buildKeyedQuestionsJson(questions) };
      const aObj = { answer_json: buildKeyedAnswersJson(questions, answers) };
      setQJson(JSON.stringify(qObj, null, 2));
      setAJson(JSON.stringify(aObj, null, 2));
    } catch {
      // ignore
    }
  }, [questions, answers]);

  const updateQuestion = (idx, patch) => {
    setQuestions((prev) => {
      const next = prev.slice();
      const cur = { ...next[idx] };
      // Enforce type constraints for open-ended region and toggle MCQ/MSQ
      if (typeof patch.type !== 'undefined') {
        const textStart = Math.max(0, questions.length - openEndedCount);
        if (idx >= textStart) patch.type = 'text';
        if (patch.type === 'text') {
          cur.options = [];
        } else {
          if (!Array.isArray(cur.options) || cur.options.length === 0) cur.options = defaultOptions();
        }
        // Reset answers on type change
        setAnswers((prevA) => {
          const a = prevA.slice();
          a[idx] = patch.type === 'text' ? '' : patch.type === 'mcq' ? -1 : [];
          return a;
        });
  // Apply the new type (will be overridden to 'text' below if in last-N)
  cur.type = patch.type;
      }
      if (typeof patch.text !== 'undefined') cur.text = patch.text;
      if (typeof patch.marks !== 'undefined') cur.marks = Number(patch.marks) || 1;
      if (typeof patch.options !== 'undefined') cur.options = patch.options;
  if (idx >= Math.max(0, questions.length - openEndedCount)) cur.type = 'text';
      next[idx] = cur;
      return next;
    });
  };

  const addOption = (idx) => {
    setQuestions((prev) => {
      const next = prev.slice();
      const q = { ...next[idx] };
      const opts = Array.isArray(q.options) ? q.options.slice() : [];
      opts.push(`Option ${opts.length + 1}`);
      q.options = opts;
      next[idx] = q;
      return next;
    });
  };

  const removeOption = (idx, optIdx) => {
    setQuestions((prev) => {
      const next = prev.slice();
      const q = { ...next[idx] };
      const opts = Array.isArray(q.options) ? q.options.slice() : [];
      if (optIdx >= 0 && optIdx < opts.length) opts.splice(optIdx, 1);
      q.options = opts;
      next[idx] = q;
      return next;
    });
    setAnswers((prev) => {
      const next = prev.slice();
      const a = next[idx];
      const q = questions[idx];
      if (q?.type === 'mcq') {
        if (a === optIdx) next[idx] = -1; // cleared selection
        else if (typeof a === 'number' && a > optIdx) next[idx] = a - 1; // reindex
      } else if (q?.type === 'msq') {
        const arr = Array.isArray(a) ? a.slice() : [];
        const mapped = arr.filter((x) => x !== optIdx).map((x) => (x > optIdx ? x - 1 : x));
        next[idx] = mapped;
      }
      return next;
    });
  };

  const moveQuestion = (from, to) => {
    if (to < 0 || to >= questions.length || from === to) return;
    const fromIsText = questions[from]?.type === 'text';
    const textStart = Math.max(0, questions.length - openEndedCount);
    const toInTextRegion = to >= textStart;
    if (fromIsText && !toInTextRegion) {
      setError(openEndedCount > 0 ? `Open-ended questions must stay in the last ${openEndedCount} positions.` : 'Cannot move open-ended out of region.');
      return;
    }
    if (!fromIsText && toInTextRegion) {
      setError(openEndedCount > 0 ? `Only open-ended can be placed in the last ${openEndedCount} positions.` : 'Cannot place non-open-ended in open-ended region.');
      return;
    }
    setQuestions((prev) => {
      const arr = prev.slice();
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return arr;
    });
    setAnswers((prev) => {
      const arr = prev.slice();
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return arr;
    });
    setActiveIdx(to);
  };

  const applyJson = () => {
    setJsonError('');
    try {
      const qObj = safeParseJSON(qJson, {});
      const aObj = safeParseJSON(aJson, {});
      const keyedQ = qObj?.questions_json ?? qObj?.Questions ?? qObj?.questions ?? qObj;
      const keyedA = aObj?.answer_json ?? aObj?.Answers ?? aObj?.answers ?? aObj;
      const normalizedQs = normalizeLoadedQuestions(keyedQ, questions.length || exam?.number_of_questions || 0, openEndedCount);
  const total = normalizedQs.length;
  const textPositions = normalizedQs.map((q, i) => (q.type === 'text' ? i : -1)).filter((i) => i >= 0);
  const textStart = Math.max(0, total - openEndedCount);
  const ok = textPositions.length === openEndedCount && textPositions.every((pos) => pos >= textStart);
  if (!ok) throw new Error(`Open-ended questions must stay in the last ${openEndedCount} positions (positions ${textStart + 1}–${total}).`);
      const normalizedAns = normalizeLoadedAnswers(keyedA, normalizedQs);
      setQuestions(normalizedQs);
      setAnswers(normalizedAns);
      setActiveIdx(0);
    } catch (err) {
      setJsonError(err?.message || 'Invalid JSON');
    }
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const qTexts = questions.map((q) => String(q.text || '').trim());
      const ansStrings = answers.map((a, idx) => {
        const q = questions[idx];
        if (q.type === 'text') return String(a || '');
        if (q.type === 'mcq') {
          const i = typeof a === 'number' ? a : -1;
          return i >= 0 ? String(q.options?.[i] || '') : '';
        }
        const arr = Array.isArray(a) ? a : [];
        const texts = arr.map((i) => q.options?.[i]).filter(Boolean);
        return texts.join(', ');
      });
      // Save keyed JSON to persist options/types, and include arrays for compatibility
      const keyedQ = buildKeyedQuestionsJson(questions);
      const keyedA = buildKeyedAnswersJson(questions, answers);
      const qOut = { ...keyedQ, questions: qTexts };
      const aOut = { ...keyedA, answers: ansStrings };
      const payload = {
        test_id: Number(id),
        questions_json: JSON.stringify(qOut),
        answer_json: JSON.stringify(aOut),
      };
      await apiPut('/api/test/update-que-ans', payload, { token });
      navigate('/exam/manageExam');
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const activeQ = questions[activeIdx];

  return (
    <div className="container py-3">
      <h1 className="h5 mb-2">Edit Exam</h1>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      {loading ? (
        <div className="text-muted">Loading…</div>
      ) : (
        <>
          <div className="row mt-2">
            <div className="col-md-3">
              <div className="surface rounded-3 p-2" style={{ border: '1px solid var(--border)' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div className="fw-semibold">Questions</div>
                  <small style={{ color: 'var(--muted)' }}>{questions.length}</small>
                </div>
                <div className="list-group">
                  {questions.map((item, idx) => {
                    const isActive = idx === activeIdx;
                    const isOver = idx === dragOverIdx && dragIdx !== null && dragIdx !== idx;
                    return (
                      <button
                        key={idx}
                        className={`list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
                        onClick={() => setActiveIdx(idx)}
                        onDragOver={(e) => { e.preventDefault(); if (dragOverIdx !== idx) setDragOverIdx(idx); }}
                        onDragLeave={() => setDragOverIdx((prev) => (prev === idx ? null : prev))}
                        onDrop={(e) => { e.preventDefault(); const from = dragIdx; const to = idx; if (typeof from === 'number' && from !== to) moveQuestion(from, to); setDragIdx(null); setDragOverIdx(null); }}
                        style={{ cursor: 'pointer', background: isOver ? 'color-mix(in srgb, var(--bg-elev) 80%, #0d6efd 20%)' : undefined, transition: 'background 120ms ease' }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <span
                            title="Drag to reorder"
                            aria-label="Drag to reorder"
                            role="button"
                            draggable
                            onDragStart={(e) => {
                              setDragIdx(idx);
                              e.stopPropagation();
                              e.dataTransfer.effectAllowed = 'move';
                              try { e.dataTransfer.setData('text/plain', String(idx)); } catch { /* ignore */ }
                              try {
                                const btn = e.currentTarget.closest('button');
                                if (btn && typeof e.dataTransfer.setDragImage === 'function') {
                                  const clone = btn.cloneNode(true);
                                  clone.style.width = `${btn.offsetWidth}px`;
                                  clone.style.boxSizing = 'border-box';
                                  clone.style.position = 'absolute';
                                  clone.style.top = '-10000px';
                                  clone.style.left = '-10000px';
                                  clone.style.pointerEvents = 'none';
                                  clone.style.opacity = '0.85';
                                  document.body.appendChild(clone);
                                  dragGhostRef.current = clone;
                                  e.dataTransfer.setDragImage(clone, 12, 12);
                                }
                              } catch { /* ignore */ }
                            }}
                            onDragEnd={(e) => {
                              e.stopPropagation();
                              setDragIdx(null);
                              setDragOverIdx(null);
                              if (dragGhostRef.current) { try { document.body.removeChild(dragGhostRef.current); } catch { /* ignore */ } dragGhostRef.current = null; }
                            }}
                            style={{ cursor: 'grab', userSelect: 'none', color: 'var(--muted)' }}
                          >
                            ⠿
                          </span>
                          <span>Q{idx + 1} • {item.type.toUpperCase()}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="d-flex gap-2 mt-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => moveQuestion(activeIdx, activeIdx - 1)} disabled={activeIdx <= 0}>Up</button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => moveQuestion(activeIdx, activeIdx + 1)} disabled={activeIdx >= questions.length - 1}>Down</button>
                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div className="surface rounded-3 p-3" style={{ border: '1px solid var(--border)' }}>
                {activeQ ? (
                  <div>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Question text</label>
                        <textarea className="form-control" rows={3} value={activeQ.text} onChange={(e) => updateQuestion(activeIdx, { text: e.target.value })} />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Type</label>
                        {activeIdx >= Math.max(0, questions.length - openEndedCount) ? (
                          <div>
                            <div className="form-control" style={{ background: 'var(--bg-elev)', color: 'var(--muted)' }}>
                              Text (fixed)
                            </div>
                            <small className="text-muted">Last {openEndedCount} positions are Text</small>
                          </div>
                        ) : (
                          <>
                            <select
                              className="form-select"
                              value={activeQ.type === 'text' ? 'mcq' : activeQ.type}
                              onChange={(e) => updateQuestion(activeIdx, { type: e.target.value })}
                            >
                              <option value="mcq">MCQ</option>
                              <option value="msq">MSQ</option>
                            </select>
                            <small className="text-muted">Objective can be MCQ/MSQ</small>
                          </>
                        )}
                      </div>
                      <div className="col-md-3">
                        <label className="form-label">Marks</label>
                        <input type="number" min={0} className="form-control" value={activeQ.marks ?? 1} onChange={(e) => updateQuestion(activeIdx, { marks: Number(e.target.value) })} />
                      </div>
                    </div>

                    {activeQ.type !== 'text' && (
                      <div className="mt-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <label className="form-label m-0">Options</label>
                          <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => addOption(activeIdx)}>Add option</button>
                        </div>
                        {(activeQ.options || []).map((opt, oi) => (
                          <div key={oi} className="d-flex align-items-center gap-2 mt-2">
                            <input className="form-control" value={opt} onChange={(e) => {
                              const val = e.target.value;
                              setQuestions((prev) => { const copy = prev.slice(); const opts = (copy[activeIdx].options || []).slice(); opts[oi] = val; copy[activeIdx] = { ...copy[activeIdx], options: opts }; return copy; });
                            }} />
                            <button className="btn btn-outline-danger" type="button" onClick={() => removeOption(activeIdx, oi)}>Remove</button>
                            {activeQ.type === 'mcq' ? (
                              <div className="form-check ms-2">
                                <input className="form-check-input" type="radio" name={`mcq-${activeIdx}`} checked={answers[activeIdx] === oi} onChange={() => setAnswers((prev) => { const copy = prev.slice(); copy[activeIdx] = oi; return copy; })} />
                              </div>
                            ) : (
                              <div className="form-check ms-2">
                                <input className="form-check-input" type="checkbox" checked={Array.isArray(answers[activeIdx]) && answers[activeIdx].includes(oi)} onChange={(e) => {
                                  const checked = e.target.checked;
                                  setAnswers((prev) => { const copy = prev.slice(); const arr = Array.isArray(copy[activeIdx]) ? copy[activeIdx].slice() : []; if (checked) { if (!arr.includes(oi)) arr.push(oi); } else { const pos = arr.indexOf(oi); if (pos >= 0) arr.splice(pos, 1); } copy[activeIdx] = arr; return copy; });
                                }} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {activeQ.type === 'text' && (
                      <div className="mt-3">
                        <label className="form-label">Reference answer (optional)</label>
                        <textarea className="form-control" rows={3} value={typeof answers[activeIdx] === 'string' ? answers[activeIdx] : ''} onChange={(e) => setAnswers((prev) => { const copy = prev.slice(); copy[activeIdx] = e.target.value; return copy; })} />
                      </div>
                    )}

                    <div className="d-flex gap-2 mt-4">
                      <button className="btn btn-success" type="button" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save to server'}</button>
                      <button className="btn btn-outline-secondary" type="button" onClick={() => navigate('/exam/manageExam')} disabled={saving}>Reset</button>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted">Select a question to edit</div>
                )}
              </div>
            </div>
          </div>

          <div className="surface rounded-3 p-3 mt-3" style={{ border: '1px solid var(--border)' }}>
            <h2 className="h6 mb-3">Advanced JSON (optional)</h2>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">questions_json</label>
                <textarea className="form-control" rows={14} value={qJson} onChange={(e) => setQJson(e.target.value)} />
                <small className="text-muted">Use keys q1, q2, … with fields: type (MCQ/MSQ/Text), Question, marks, options (for MCQ/MSQ).</small>
              </div>
              <div className="col-md-6">
                <label className="form-label">answer_json</label>
                <textarea className="form-control" rows={14} value={aJson} onChange={(e) => setAJson(e.target.value)} />
                <small className="text-muted">For MCQ: {'{ option: number }'} • For MSQ: {'{ option: [numbers] }'} • For Text: {}.</small>
              </div>
            </div>
            {jsonError && <div className="alert alert-warning mt-2 py-2">{jsonError}</div>}
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-primary" type="button" onClick={applyJson} disabled={saving}>Apply JSON</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

