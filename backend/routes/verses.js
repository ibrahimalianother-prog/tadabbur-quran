const express = require('express');
const Verse = require('../models/Verse');

const router = express.Router();

router.get('/chapters', async (req, res) => {
  try {
    const chapters = await Verse.distinct('chapter_id');
    res.json({ chapters: chapters.sort((a, b) => a - b) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/chapter/:chapterId', async (req, res) => {
  try {
    const chapterId = Number(req.params.chapterId);
    const verses = await Verse.find({ chapter_id: chapterId }).sort({ verse_number: 1 });
    res.json(verses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  const q = req.query.q || '';

  if (!q.trim()) {
    return res.json([]);
  }

  try {
    const verses = await Verse.find({
      $or: [
        { text_uthmani: { $regex: q, $options: 'i' } },
        { translation: { $regex: q, $options: 'i' } },
        { text_imlaei: { $regex: q, $options: 'i' } }
      ]
    }).limit(50);

    res.json(verses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const verse = await Verse.findById(req.params.id);
    if (!verse) {
      return res.status(404).json({ error: 'Verse not found' });
    }
    res.json(verse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
