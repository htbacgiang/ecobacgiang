import { useState, useEffect } from 'react';

export const useBestsellers = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders/bestsellers');
        if (!response.ok) {
          throw new Error('Failed to fetch bestsellers');
        }
        const data = await response.json();
        setBestsellers(data);
      } catch (err) {
        console.error('Error fetching bestsellers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  return { bestsellers, loading, error };
};
