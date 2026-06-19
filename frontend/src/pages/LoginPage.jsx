import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from '../lib/authApi';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = location.state?.from?.pathname || '/editor';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginUser({ email, password });
      window.localStorage.setItem('token', result.token);
      onLogin(result.user);
      navigate(redirectTo, { replace: true });
    } catch (loginError) {
      setError(loginError.message || 'Login fehlgeschlagen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <p className="library-eyebrow">Login</p>
        <h2>Trainer-Tool öffnen</h2>

        <label className="login-label" htmlFor="login-email">
          E-Mail
        </label>
        <input
          id="login-email"
          className="login-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label className="login-label" htmlFor="login-password">
          Passwort
        </label>
        <input
          id="login-password"
          className="login-input"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <div className="library-state library-state-error">{error}</div>}

        <button className="library-search-button login-submit" type="submit" disabled={loading}>
          {loading ? 'Login läuft...' : 'Einloggen'}
        </button>
      </form>
    </section>
  );
}
