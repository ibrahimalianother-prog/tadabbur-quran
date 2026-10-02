'use client';

import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

export default function HomePage() {
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChapters() {
      try {
        const res = await fetch(`${API_URL}/chapters`);
        const data = await res.json();
        setChapters(data);
        if (data.length) setSelectedChapter(data[0].id);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      }
    }

    fetchChapters();
  }, []);

  useEffect(() => {
    async function fetchChapterVerses() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/chapters/${selectedChapter}`);
        const data = await res.json();
        setVerses(data.verses || []);
      } catch (error) {
        console.error('Failed to fetch chapter verses:', error);
      } finally {
        setLoading(false);
      }
    }

    if (selectedChapter) fetchChapterVerses();
  }, [selectedChapter]);

  useEffect(() => {
    if (!query.trim()) return;

    async function searchVerses() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/verses/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setVerses(data);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(searchVerses, 400);
    return () => clearTimeout(timeout);
  }, [query]);

  const selectedChapterMeta = chapters.find((c) => c.id === selectedChapter) || null;

  return (
    <main className="container">
      <header className="hero">
        <p className="eyebrow">تدبر القرآن الكريم</p>
        <h1>التدبُّر، الفهم، والاستماع</h1>
        <p className="subtitle">
          مشروع كامل للبحث في الآيات، قراءة السور، والعودة إلى مصادر التفسير بشكل مسؤول ومؤسسي.
        </p>
      </header>

      <section className="search-box">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن آية أو كلمة..."
        />
      </section>

      <section className="chapters-strip">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            className={selectedChapter === chapter.id ? 'chapter-chip active' : 'chapter-chip'}
            onClick={() => {
              setQuery('');
              setSelectedChapter(chapter.id);
            }}
          >
            {chapter.name_ar || chapter.name_en}
          </button>
        ))}
      </section>

      {selectedChapterMeta && (
        <section className="chapter-summary">
          <h2>{selectedChapterMeta.name_ar || selectedChapterMeta.name_en}</h2>
          <p>
            {selectedChapterMeta.verses_count} آية • {selectedChapterMeta.revelation_place || 'مكة/مدينة'}
          </p>
        </section>
      )}

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
              {verse.tafsir?.source && (
                <div className="tafsir-box">
                  <strong>مصدر التفسير:</strong> {verse.tafsir.source}
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </main>
  );
}
