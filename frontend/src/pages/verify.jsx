import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import { apiPost } from '../common/api.js';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Verify = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = query.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Missing token.');
      return;
    }

    (async () => {
      try {
        setStatus('verifying');
        const res = await apiPost('/auth/verify', { token });
        // If API sets cookies/session, we are logged in now.
        setStatus('success');
        setMessage('Verification successful. Redirecting…');
        setTimeout(() => navigate('/classroom'), 1200);
      } catch (err) {
        setStatus('error');
        setMessage(err?.response?.data?.message || 'Verification failed.');
      }
    })();
  }, [navigate, query]);

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar />
      <main className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="surface shadow-soft rounded-4 p-4 p-md-5 text-center" style={{ maxWidth: 520, width: '100%' }}>
          <h1 className="h4 fw-bold mb-3">Verifying magic link…</h1>
          {status === 'verifying' && <p style={{ color: 'var(--muted)' }}>Please wait.</p>}
          {status === 'success' && <p className="text-success">{message}</p>}
          {status === 'error' && <p className="text-danger">{message}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Verify;
