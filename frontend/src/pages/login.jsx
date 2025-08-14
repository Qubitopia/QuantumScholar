import React, { useState } from 'react';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import { apiPost } from '../common/api.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      setStatus('sending');
      setMessage('');
      await apiPost('/auth/login', { email });
      setStatus('sent');
      setMessage('Magic link sent. Please check your email.');
    } catch (err) {
      setStatus('error');
      setMessage(err?.response?.data?.message || 'Failed to send magic link');
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <Navbar />
      <main className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="surface shadow-soft rounded-4 p-4 p-md-5" style={{ maxWidth: 520, width: '100%' }}>
          <h1 className="h3 fw-bold mb-3">Log in</h1>
          <p className="text-secondary" style={{ color: 'var(--muted)' }}>
            Enter your email to receive a magic link for secure sign-in.
          </p>
          <form onSubmit={submit} className="mt-3">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="d-flex gap-3 align-items-center">
              <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send Magic Link'}
              </button>
              {status === 'sent' && <span className="text-success">{message}</span>}
              {status === 'error' && <span className="text-danger">{message}</span>}
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
