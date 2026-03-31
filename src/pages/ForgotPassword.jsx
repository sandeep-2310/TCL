import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import './Login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err) {
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many requests. Please wait a moment and try again.');
          break;
        default:
          setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      {/* Top Banner */}
      <div className="auth-banner">
        <div className="cross-bg">†</div>
        <div className="auth-logo">🕊️</div>
        <h1>Password<br/>Recovery</h1>
        <p className="auth-tagline">"Ask and it will be given to you." — Matthew 7:7</p>
      </div>

      <div className="auth-card">
        <Link to="/login" className="back-link" id="forgot-back-btn">
          <ArrowLeft size={18} /> Back to Sign In
        </Link>

        {success ? (
          /* ── Success State ── */
          <div className="reset-success">
            <div className="success-icon-wrap">
              <CheckCircle size={56} />
            </div>
            <h2>Email Sent!</h2>
            <p>
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the link to reset your password.
            </p>
            <p className="reset-hint">Didn't receive it? Check your spam folder.</p>
            <Link to="/login" className="btn-primary auth-submit-btn" style={{ marginTop: '25px', textDecoration: 'none' }}>
              Return to Sign In
            </Link>
          </div>
        ) : (
          /* ── Form State ── */
          <>
            <h2>Forgot Password?</h2>
            <p className="auth-subtitle">
              Enter the email address linked to your account and we'll send you a reset link.
            </p>

            {error && (
              <div className="auth-error">
                <span>⚠️ {error}</span>
              </div>
            )}

            <form onSubmit={handleReset} className="auth-form">
              <div className="input-group">
                <div className="input-icon"><Mail size={18} /></div>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <button
                type="submit"
                className="btn-primary auth-submit-btn"
                disabled={loading}
                id="forgot-submit-btn"
              >
                {loading ? 'Sending Reset Link...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">Create Account</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
