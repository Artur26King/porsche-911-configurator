/**
 * Auth page layout: Full-screen background image; title/subtitle and form centered on top; mobile-first.
 */
import './LoginScreen.css';

export default function AuthPageLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-page-overlay" aria-hidden="true" />
      <div className="auth-page-main">
        <h1 className="auth-page-title">
          <span className="auth-page-title-word">Porsche</span>
          <span className="auth-page-title-nums"> 911</span>
        </h1>
        <p className="auth-page-subtitle">
          This site is not about the car… this site is about the dream
        </p>
        <div className="auth-page-form-wrap">
          {children}
        </div>
      </div>
    </div>
  );
}
