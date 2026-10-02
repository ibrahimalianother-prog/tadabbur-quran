'use client';

import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function HomePage() {
  const [query, setQuery] = useState('الرحمن');
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVerses() {
      try {
        const res = await fetch(`${API_URL}/verses/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setVerses(data);
      } catch (error) {
        console.error('Failed to fetch verses:', error);
      } finally {
        setLoading(false);
      }
    }

    loadVerses();
  }, [query]);

  return (
    <main className="container">
      <header className="hero">
        <p className="eyebrow">تدبر القرآن الكريم</p>
        <h1>تدبُّرٌ، وفهمٌ، واستماعٌ</h1>
        <p className="subtitle">
          ابحث في آيات القرآن، اقرأ النص العربي، وراجع مصادر التفسير بطريقة قانونية ومسؤولة.
        </p>
      </header>

      <section className="search-box">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن آية أو كلمة..."
        />
      </section>

      <section className="results">
        {loading ? (
          <p>جاري التحميل...</p>
        ) : verses.length === 0 ? (
          <p>لا توجد نتائج لهذا البحث.</p>
        ) : (
          verses.map((verse) => (
            <article key={verse._id} className="verse-card">
              <div className="verse-meta">
                <span>{verse.chapter_id}:{verse.verse_number}</span>
              </div>
              <div className="arabic">{verse.text_uthmani || verse.text_imlaei}</div>
              <div className="translation">{verse.translation || 'لا توجد ترجمة'}</div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
