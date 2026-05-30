import { useCallback, useEffect, useState } from 'react';

export function useAsyncData(loader, dependencies = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const result = await loader();
      setData(result || []);
    } catch (err) {
      setError(err.message || 'Не вдалося завантажити дані');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
