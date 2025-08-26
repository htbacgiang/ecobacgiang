export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        throw new Error('Failed to process data');
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ detail: 'Internal Server Error', error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const response = await fetch('http://localhost:8000/api/results', {  // Đổi thành /api/results
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ detail: 'Internal Server Error', error: error.message });
    }
  } else {
    res.status(405).json({ detail: 'Method Not Allowed' });
  }
}