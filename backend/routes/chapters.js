const express = require('express');
const Chapter = require('../models/Chapter');
const Verse = require('../models/Verse');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const chapters = await Chapter.find().sort({ id: 1 });
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const chapterId = Number(req.params.id);
  try {
    const chapter = await Chapter.findOne({ id: chapterId });
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    const verses = await Verse.find({ chapter_id: chapterId }).sort({ verse_number: 1 });

    res.json({
      chapter,
      verses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
