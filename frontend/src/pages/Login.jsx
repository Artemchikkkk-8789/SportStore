import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GOOGLE_LOGIN_URL } from '../services/api.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/profile', { replace: true });
    } catch (err) {
      setError(err.message || 'Не вдалося увійти');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">Вхід</p>
        <h1>Повертаємось до тренувань</h1>
        <label>
          Логін
          <input
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            required
          />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button full" disabled={loading} type="submit">
          {loading ? 'Вхід...' : 'Увійти'}
        </button>
        <a className="ghost-button full" href={GOOGLE_LOGIN_URL}>
          Увійти через Google
        </a>
        <p>
          Немає акаунта? <Link to="/register">Зареєструватися</Link>
        </p>
      </form>
    </section>
  );
}
