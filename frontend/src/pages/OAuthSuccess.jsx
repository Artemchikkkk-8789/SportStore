import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import StateBlock from '../components/StateBlock.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthToken } = useAuth();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) return;

    setAuthToken(token);
    navigate('/profile', { replace: true });
  }, [navigate, setAuthToken, token]);

  if (!token) {
    return (
      <StateBlock
        title="Google-вхід не завершено"
        text="Backend не повернув JWT токен. Спробуйте увійти ще раз."
        action={
          <Link className="primary-button" to="/login">
            До входу
          </Link>
        }
      />
    );
  }

  return <StateBlock title="Завершуємо вхід через Google..." />;
}
