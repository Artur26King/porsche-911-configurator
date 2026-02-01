import { useState } from 'react';
import { register, verify, setPassword, login } from '../services/api';
import { isValidEmail, isValidNickname } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import AuthPageLayout from './AuthPageLayout';
import './LoginScreen.css';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  
  const [mode, setMode] = useState('register'); // 'register' or 'login'
  const [step, setStep] = useState('register'); // 'register' | 'verify' | 'setPassword'
  
  // Registration: Username and Email
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // Verification: Code
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  
  // Set password: user-chosen 4-digit password
  const [password, setPasswordValue] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Common state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [storedEmail, setStoredEmail] = useState('');

  // Validation functions
  const validateUsername = (value) => {
    if (!value.trim()) {
      setUsernameError('');
      return false;
    }
    if (!isValidNickname(value)) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validateEmail = (value) => {
    if (!value.trim()) {
      setEmailError('');
      return false;
    }
    if (!isValidEmail(value)) {
      setEmailError('Email must contain @');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Handle registration submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    const isUsernameValid = validateUsername(trimmedUsername);
    const isEmailValid = validateEmail(trimmedEmail);

    if (!isUsernameValid || !isEmailValid) {
      return;
    }

    setLoading(true);

    try {
      // POST to /auth/register
      await register(trimmedUsername, trimmedEmail);
      // On success, switch to verification screen
      setStoredEmail(trimmedEmail);
      setStep('verify');
    } catch (registerError) {
      setError(registerError.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle verification submit (code is for email confirmation only; do not log in with code)
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCodeError('');

    const trimmedCode = code.trim();

    if (trimmedCode.length !== 4 || !/^\d{4}$/.test(trimmedCode)) {
      setCodeError('Code must be exactly 4 digits');
      return;
    }

    setLoading(true);

    try {
      const result = await verify(storedEmail, trimmedCode);
      if (result.emailVerified) {
        setStep('setPassword');
      }
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle set password submit (user-chosen permanent password; then log in)
  const handleSetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordError('');

    const trimmedPassword = password.trim();
    if (trimmedPassword.length !== 4 || !/^\d{4}$/.test(trimmedPassword)) {
      setPasswordError('Password must be exactly 4 digits');
      return;
    }

    setLoading(true);

    try {
      await setPassword(storedEmail, trimmedPassword);
      const loginResult = await login(username.trim(), trimmedPassword);
      if (loginResult.user) {
        setAuthUser(loginResult.token ?? null, loginResult.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Failed to set password or log in');
    } finally {
      setLoading(false);
    }
  };

  // Handle code input - only allow numbers
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setCode(value);
    if (value && value.length !== 4) {
      setCodeError('Code must be exactly 4 digits');
    } else {
      setCodeError('');
    }
  };

  // Handle password input - only allow numbers (4-digit)
  const handlePasswordChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setPasswordValue(value);
    if (value && value.length !== 4) {
      setPasswordError('Password must be exactly 4 digits');
    } else {
      setPasswordError('');
    }
  };

  // Show login screen if mode is 'login'
  if (mode === 'login') {
    return <LoginScreen onSwitchToRegister={() => setMode('register')} />;
  }

  // Set password screen (after successful email verification)
  if (step === 'setPassword') {
    return (
      <AuthPageLayout>
        <div className="login-screen">
          <div className="login-card">
          <h1 className="login-title">Create Your Password</h1>
          <p className="login-subtitle">
            Choose a 4-digit password for {storedEmail}. You will use this to log in.
          </p>
          
          <form onSubmit={handleSetPasswordSubmit} className="login-form">
            <div className="form-group">
              <input
                type="password"
                inputMode="numeric"
                placeholder="0000"
                value={password}
                onChange={handlePasswordChange}
                maxLength={4}
                className={`login-input ${passwordError ? 'error' : ''}`}
                autoFocus
                required
              />
              {passwordError && <span className="field-error">{passwordError}</span>}
            </div>

            <button 
              type="submit" 
              disabled={loading || password.length !== 4} 
              className="login-btn"
            >
              {loading ? 'Creating...' : 'Create password & continue'}
            </button>

            <button
              type="button"
              className="login-link"
              onClick={() => {
                setStep('verify');
                setPasswordValue('');
                setPasswordError('');
                setError('');
              }}
            >
              Back
            </button>
          </form>

          {error && <p className="login-error">{error}</p>}
          </div>
        </div>
      </AuthPageLayout>
    );
  }

  // Verification screen
  if (step === 'verify') {
    return (
      <AuthPageLayout>
        <div className="login-screen">
          <div className="login-card">
            <h1 className="login-title">Verify Your Email</h1>
          <p className="login-subtitle">
            Enter the 4-digit code sent to {storedEmail}
          </p>
          
          <form onSubmit={handleVerifySubmit} className="login-form">
            <div className="form-group">
              <input
                type="text"
                inputMode="numeric"
                placeholder="0000"
                value={code}
                onChange={handleCodeChange}
                maxLength={4}
                className={`login-input ${codeError ? 'error' : ''}`}
                autoFocus
                required
              />
              {codeError && <span className="field-error">{codeError}</span>}
            </div>

            <button 
              type="submit" 
              disabled={loading || code.length !== 4} 
              className="login-btn"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            <button
              type="button"
              className="login-link"
              onClick={() => {
                setStep('register');
                setCode('');
                setCodeError('');
                setError('');
              }}
            >
              Back
            </button>
          </form>

          {error && <p className="login-error">{error}</p>}
          </div>
        </div>
      </AuthPageLayout>
    );
  }

  // Registration screen (default)
  return (
    <AuthPageLayout>
      <div className="login-screen">
        <div className="login-card">
          <h1 className="login-title">Create Account</h1>
        <p className="login-subtitle">Enter your username and email</p>
        
        <form onSubmit={handleRegisterSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Username (min 3 characters)"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                validateUsername(e.target.value);
              }}
              className={`login-input ${usernameError ? 'error' : ''}`}
              required
            />
            {usernameError && <span className="field-error">{usernameError}</span>}
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email (must contain @)"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              className={`login-input ${emailError ? 'error' : ''}`}
              required
            />
            {emailError && <span className="field-error">{emailError}</span>}
          </div>

          <button 
            type="submit" 
            disabled={loading || !username.trim() || !email.trim()} 
            className="login-btn"
          >
            {loading ? 'Processing...' : 'Next'}
          </button>
        </form>

        <button
          type="button"
          className="login-link"
          onClick={() => setMode('login')}
        >
          I already have an account
        </button>

        {error && <p className="login-error">{error}</p>}
        </div>
      </div>
    </AuthPageLayout>
  );
}
