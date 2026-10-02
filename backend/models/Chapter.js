const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name_ar: String,
  name_en: String,
  transliteration: String,
  verses_count: Number,
  revelation_place: String,
  pages: String,
  slug: String
}, { timestamps: true });

module.exports = mongoose.model('Chapter', chapterSchema);
