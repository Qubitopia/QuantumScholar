import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import { apiPost } from '../common/api.js';
import { setCookie } from '../common/cookie.js';
import {useQuery} from '../common/appUtils.js';

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
        if (res.status == 200) {
          setStatus('success');
          setMessage('Verification successful. Redirecting…');
          setCookie('qs-token', res.data.token, {maxAge: 7,secure:false}); // Save token for 7 days
          setCookie('qs-user', JSON.stringify(res.data.user), {maxAge: 7}); // Save user data
          localStorage.setItem('qs-user', JSON.stringify(res.data.user)); // Also save in localStorage
        } else {
          throw new Error('Verification failed');
        }
        setStatus('success');
        setMessage('Verification successful. Redirecting…');
        setTimeout(() => navigate('/settings'), 2200);
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
