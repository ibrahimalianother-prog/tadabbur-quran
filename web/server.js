const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.get('/api/quran/search', async (req, res) => {
  const q = req.query.q || 'الرحمن';

  try {
    const result = await axios.get('https://api.quran.com/api/v4/search', {
      params: {
        q,
        language: 'ar',
        page_size: 10
      }
    });

    res.json(result.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Tadabbur Quran frontend placeholder');
});

app.listen(PORT, () => {
  console.log(`Frontend placeholder running on http://localhost:${PORT}`);
});
