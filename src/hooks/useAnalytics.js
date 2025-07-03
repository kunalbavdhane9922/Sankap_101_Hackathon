import { useState, useEffect } from 'react';
import API_BASE_URL from "../config";

export default function useAnalytics(accounts = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${API_BASE_URL}/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accounts })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch analytics');
        return res.json();
      })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [JSON.stringify(accounts)]);

  return { data, loading, error };
} 