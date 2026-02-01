import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  // Layout only renders when user is authenticated (handled in App.jsx)
  // But adding safety check anyway
  if (!user) {
    return null;
  }

  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="brand">911</Link>
        <nav className="nav">
          <Link to="/configurator">Configurator</Link>
          <Link to="/profile">Profile</Link>
          <button type="button" className="btn-link" onClick={logout}>Logout</button>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="footer">
        <span>Porsche 911 — Dream & Motivation</span>
      </footer>
    </div>
  );
}
