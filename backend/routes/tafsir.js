const express = require('express');
const TafsirSource = require('../models/TafsirSource');

const router = express.Router();

router.get('/sources', async (req, res) => {
  try {
    const sources = await TafsirSource.find({ is_active: true }).sort({ createdAt: -1 });
    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  const q = req.query.q || '';

  try {
    const sources = await TafsirSource.find({
      $or: [
        { source_name: { $regex: q, $options: 'i' } },
        { title: { $regex: q, $options: 'i' } },
        { summary: { $regex: q, $options: 'i' } }
      ],
      is_active: true
    }).limit(50);

    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
