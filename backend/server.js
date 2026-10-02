const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const versesRoutes = require('./routes/verses');
const chaptersRoutes = require('./routes/chapters');
const tafsirRoutes = require('./routes/tafsir');

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Tadabbur Quran API is running' });
});

app.use('/api/verses', versesRoutes);
app.use('/api/chapters', chaptersRoutes);
app.use('/api/tafsir', tafsirRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tadabbur_quran', {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  });
