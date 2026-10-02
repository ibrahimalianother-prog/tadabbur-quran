const mongoose = require('mongoose');

const tafsirSourceSchema = new mongoose.Schema({
  source_name: String,
  title: String,
  url: String,
  summary: String,
  license_status: {
    type: String,
    default: 'requires_verification'
  },
  tags: [String],
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('TafsirSource', tafsirSourceSchema);
