import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import { apiGet, apiPost, apiPut } from '../common/api.js';
import { setCookie } from '../common/cookie.js';
import {useQuery} from '../common/appUtils.js';

const NewAuth = () => {
  const query = useQuery();
  const token = query.get('token') || '';
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!token) {
      setStatus('error');
      setMessage('Missing token in the link.');
      return;
    }
    if (!name.trim()) {
      setStatus('error');
      setMessage('Please enter your full name.');
      return;
    }

    setStatus('submitting');
    setMessage('');
    try {
      // Step 1: Verify token first to ensure backend accepts it and to obtain a canonical token
      const ver = await apiPost('/auth/verify', { token });
      if (ver?.status !== 200) throw new Error('Verification failed');
      const tokToUse = ver?.data?.token || ver?.data?.qs_token || token;
      if (tokToUse) setCookie('qs-token', tokToUse, { days: 7, path: '/' });

      // Step 2: Update profile with name using Authorization header (now validated)
      const upd = await apiPut('/api/profile', { Name: name.trim() }, { token: tokToUse });
      if (upd?.status !== 200) throw new Error('Could not update profile');

      // Step 3: Fetch profile and persist user snapshot
      let user = null;
      try {
        const prof = await apiGet('/api/profile', { token: tokToUse });
        user = prof?.data?.user ?? prof?.data ?? null;
      } catch (e) {
        user = null;
        console.error('Could not fetch profile after update:', e);
      }

      if (user && typeof user === 'object') {
        try {
          setCookie('qs-user', JSON.stringify(user), { days: 7, path: '/' });
          localStorage.setItem('qs-user', JSON.stringify(user));
        } catch (e) {
          console.error('Could not persist user snapshot:', e);
        }
      }

      setStatus('success');
      setMessage('All set! Redirecting…');
      setTimeout(() => navigate('/settings', { replace: true }), 1000);
    } catch (err) {
      setStatus('error');
      setMessage(err?.response?.data?.message || err?.message || 'Could not complete sign-in.');
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar />
      <main className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="surface shadow-soft rounded-4 p-4 p-md-5" style={{ maxWidth: 520, width: '100%' }}>
          <h1 className="h3 fw-bold mb-3">Complete sign-in</h1>
          <p className="text-secondary" style={{ color: 'var(--muted)' }}>
            Enter your full name to finish setting up your account.
          </p>
          {!token && (
            <div className="alert alert-danger" role="alert">
              Missing token. Please use the link from your email again.
            </div>
          )}
          <form onSubmit={submit} className="mt-3">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full name</label>
              <input id="name" type="text" className="form-control" value={name}
                     onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
            </div>
            <div className="d-flex gap-3 align-items-center">
              <button type="submit" className="btn btn-primary" disabled={status === 'submitting' || !token}>
                {status === 'submitting' ? 'Saving…' : 'Continue'}
              </button>
              {status === 'success' && <span className="text-success">{message}</span>}
              {status === 'error' && <span className="text-danger">{message}</span>}
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NewAuth;