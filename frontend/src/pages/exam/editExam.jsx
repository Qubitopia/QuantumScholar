import { useEffect, useState } from 'react';
import { getCookie } from '../../common/cookie.js';
import { useQuery } from '../../common/appUtils.js';

export default function EditExam() {
  const query = useQuery();
  const id = query.get('test_id');
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const token = getCookie('qs-token');
        // Adjust endpoint to your backend shape
        // const res = await apiGet(`/api/test/${id}`, { token });
        setExam(res?.data?.test || null);
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load exam');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div>
      <h1>Edit Exam</h1>
      <p>Editing exam with ID: {id}</p>

      {loading && <div>Loading…</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && !exam && <div>Not found</div>}

      {!loading && !error && exam && (
        <pre>{JSON.stringify(exam, null, 2)}</pre>
      )}
    </div>
  );
}
