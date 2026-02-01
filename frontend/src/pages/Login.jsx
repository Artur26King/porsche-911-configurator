import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, verify } from '../services/api';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login: setUser } = useAuth();
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(nickname.trim(), email.trim());
      if (res.token && res.user) {
        setUser(res.token, res.user);
        navigate('/profile');
        return;
      }
      setStep('code');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await verify(email.trim(), code.trim());
      setUser(res.token, res.user);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'code') {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Check your email</h1>
          <p className="auth-hint">We sent a 4-digit code to {email}</p>
          <form onSubmit={handleVerify} className="auth-form">
            <input
              type="text"
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={4}
              className="auth-input"
              autoFocus
            />
            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? 'Verifying…' : 'Verify'}
            </button>
            <button
              type="button"
              className="auth-link"
              onClick={() => setStep('form')}
            >
              Back
            </button>
          </form>
          {error && <p className="auth-error">{error}</p>}
        </div>
        <Link to="/register" className="auth-swap">Create account</Link>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Login</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="auth-input"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Sending…' : 'Continue'}
          </button>
        </form>
        {error && <p className="auth-error">{error}</p>}
      </div>
      <Link to="/register" className="auth-swap">Create account</Link>
    </div>
  );
}
