import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(form);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Не вдалося зареєструватися');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">Реєстрація</p>
        <h1>Створіть профіль SportStore</h1>
        <label>
          Логін
          <input
            value={form.username}
            minLength="3"
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            required
          />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={form.password}
            minLength="6"
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button full" disabled={loading} type="submit">
          {loading ? 'Створення...' : 'Зареєструватися'}
        </button>
        <p>
          Вже маєте акаунт? <Link to="/login">Увійти</Link>
        </p>
      </form>
    </section>
  );
}
