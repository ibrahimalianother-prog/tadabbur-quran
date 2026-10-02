const mongoose = require('mongoose');

const verseSchema = new mongoose.Schema({
  chapter_id: { type: Number, required: true },
  verse_number: { type: Number, required: true },
  verse_key: { type: String, required: true },
  text_uthmani: { type: String, default: '' },
  text_imlaei: { type: String, default: '' },
  translation: { type: String, default: '' },
  transliteration: { type: String, default: '' },
  audio_url: { type: String, default: '' },
  tafsir: {
    source: { type: String, default: '' },
    title: { type: String, default: '' },
    url: { type: String, default: '' },
    summary: { type: String, default: '' }
  }
}, { timestamps: true });

verseSchema.index({ chapter_id: 1, verse_number: 1 }, { unique: true });
verseSchema.index({ text_uthmani: 'text', translation: 'text' });

module.exports = mongoose.model('Verse', verseSchema);
