const fs = require('fs');
const mongoose = require('mongoose');
const Verse = require('../models/Verse');
const Chapter = require('../models/Chapter');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' });

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tadabbur_quran')
  .then(async () => {
    const dataDir = __dirname + '/../../data';
    const files = fs.readdirSync(dataDir).filter((file) => file.startsWith('chapter-') && file.endsWith('.json'));

    const chapterMeta = JSON.parse(fs.readFileSync(`${dataDir}/chapters.json`, 'utf8'));

    for (const meta of chapterMeta) {
      await Chapter.updateOne(
        { id: meta.id },
        {
          id: meta.id,
          name_ar: meta.name_ar,
          name_en: meta.name_simple,
          transliteration: meta.translated_name?.name || meta.name_simple,
          verses_count: meta.verses_count,
          revelation_place: meta.revelation_place,
          pages: meta.pages || '',
          slug: meta.slug || ''
        },
        { upsert: true }
      );
    }

    for (const file of files) {
      const raw = fs.readFileSync(`${dataDir}/${file}`, 'utf8');
      const verses = JSON.parse(raw);

      const mapped = verses.map((verse) => ({
        chapter_id: verse.chapter_id,
        verse_number: verse.verse_number,
        verse_key: verse.verse_key,
        text_uthmani: verse.text_uthmani || '',
        text_imlaei: verse.text_imlaei || '',
        translation: verse.translations?.[0]?.text || '',
        transliteration: verse.transliteration?.[0]?.text || '',
        audio_url: verse.audio?.[0]?.url || '',
        tafsir: {
          source: '',
          title: '',
          url: '',
          summary: ''
        }
      }));

      await Verse.insertMany(mapped, { ordered: false });
      console.log(`Imported ${file}`);
    }

    console.log('All Quran data imported successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import failed:', error.message);
    process.exit(1);
  });
