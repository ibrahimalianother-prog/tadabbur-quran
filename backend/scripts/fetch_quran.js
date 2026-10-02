const fs = require('fs');
const axios = require('axios');

const OUT_DIR = __dirname + '/../../data';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function fetchChapters() {
  const res = await axios.get('https://api.quran.com/api/v4/chapters?language=ar');
  return res.data.chapters || [];
}

async function fetchVersesByChapter(chapterId) {
  let page = 1;
  let allVerses = [];
  const perPage = 50;

  while (true) {
    const res = await axios.get(`https://api.quran.com/api/v4/verses/by_chapter/${chapterId}`, {
      params: {
        language: 'ar',
        text_type: 'uthmani',
        page,
        per_page: perPage
      }
    });

    const verses = res.data.verses || [];
    allVerses = allVerses.concat(verses);

    if (verses.length < perPage) {
      break;
    }

    page += 1;
  }

  return allVerses;
}

(async () => {
  try {
    const chapters = await fetchChapters();
    fs.writeFileSync(`${OUT_DIR}/chapters.json`, JSON.stringify(chapters, null, 2), 'utf8');

    for (const chapter of chapters) {
      console.log(`Downloading chapter ${chapter.id}: ${chapter.name_simple}`);
      const verses = await fetchVersesByChapter(chapter.id);
      fs.writeFileSync(
        `${OUT_DIR}/chapter-${String(chapter.id).padStart(3, '0')}.json`,
        JSON.stringify(verses, null, 2),
        'utf8'
      );
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    console.log('Quran data downloaded successfully');
  } catch (error) {
    console.error('Failed to fetch Quran data:', error.response?.data || error.message);
  }
})();
