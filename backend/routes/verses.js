const express = require('express');
const Verse = require('../models/Verse');

const router = express.Router();

router.get('/random', async (req, res) => {
  try {
    const count = await Verse.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const verse = await Verse.findOne().skip(randomIndex);

    if (!verse) {
      return res.status(404).json({ error: 'No verse found' });
    }

    res.json(verse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  const q = req.query.q || '';

  try {
    const results = await Verse.find({
      $or: [
        { text_uthmani: { $regex: q, $options: 'i' } },
        { translation: { $regex: q, $options: 'i' } },
        { text_imlaei: { $regex: q, $options: 'i' } }
      ]
    }).limit(50);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
