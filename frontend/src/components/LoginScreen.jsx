import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { isValidPIN } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import AuthPageLayout from './AuthPageLayout';
import './LoginScreen.css';

export default function LoginScreen({ onSwitchToRegister }) {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [code, setCode] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle login submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUsernameError('');
    setCodeError('');

    const trimmedUsername = usernameOrEmail.trim();
    const trimmedCode = code.trim();

    if (!trimmedUsername) {
      setUsernameError('Username or email is required');
      return;
    }

    if (!isValidPIN(trimmedCode)) {
      setCodeError('Password must be exactly 4 digits');
      return;
    }

    setLoading(true);

    try {
      // POST to /auth/login
      const loginResult = await login(trimmedUsername, trimmedCode);
      if (loginResult.user) {
        setAuthUser(loginResult.token ?? null, loginResult.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle code input - only allow numbers
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setCode(value);
    if (value && !isValidPIN(value)) {
      setCodeError('Password must be exactly 4 digits');
    } else {
      setCodeError('');
    }
  };

  return (
    <AuthPageLayout>
      <div className="login-screen">
        <div className="login-card">
          <h1 className="login-title">Login</h1>
          <p className="login-subtitle">Enter your username/email and password</p>
          
          <form onSubmit={handleLoginSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Username or Email"
              value={usernameOrEmail}
              onChange={(e) => {
                setUsernameOrEmail(e.target.value);
                setUsernameError('');
              }}
              className={`login-input ${usernameError ? 'error' : ''}`}
              required
            />
            {usernameError && <span className="field-error">{usernameError}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              inputMode="numeric"
              placeholder="Password (4 digits)"
              value={code}
              onChange={handleCodeChange}
              maxLength={4}
              className={`login-input ${codeError ? 'error' : ''}`}
              required
            />
            {codeError && <span className="field-error">{codeError}</span>}
          </div>

          <button 
            type="submit" 
            disabled={loading || !usernameOrEmail.trim() || code.length !== 4} 
            className="login-btn"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {onSwitchToRegister && (
          <button
            type="button"
            className="login-link"
            onClick={onSwitchToRegister}
          >
            Create account instead
          </button>
        )}

        {error && <p className="login-error">{error}</p>}
        </div>
      </div>
    </AuthPageLayout>
  );
}
