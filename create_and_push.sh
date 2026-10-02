#!/usr/bin/env bash
set -euo pipefail

# create_and_push.sh
# سكربت يحضّر ملفات النشر ويدفعها إلى المستودع الخاص بك
# تعديل متغير GITHUB_REPO إذا أردت مستودعًا مختلفًا (owner/repo)

GITHUB_REPO="${GITHUB_REPO:-ibrahimalianother-prog/tadabbur-quran}"
REPO_NAME="$(basename "$GITHUB_REPO")"
CLONE_DIR="${REPO_NAME}"

echo "Repository: $GITHUB_REPO"
echo "Clone directory: $CLONE_DIR"

# أدوات مطلوبة: git (مطلوب)، gh (اختياري لكن يُنصح)
if ! command -v git >/dev/null 2>&1; then
  echo "خطأ: git غير مثبت أو غير متاح في PATH."
  exit 1
fi

if command -v gh >/dev/null 2>&1; then
  GH_AVAILABLE=1
  echo "gh CLI موجود، سيتم استعماله إن أمكن."
else
  GH_AVAILABLE=0
  echo "gh CLI غير موجود (اختياري). سيتم الاعتماد على git فقط."
fi

# استنساخ أو تحديث
if [ -d "$CLONE_DIR/.git" ]; then
  echo "المجلد موجود، سأحدّثه (git pull)..."
  git -C "$CLONE_DIR" checkout main || git -C "$CLONE_DIR" checkout -b main
  git -C "$CLONE_DIR" pull origin main || true
else
  echo "استنساخ المستودع من GitHub..."
  git clone "https://github.com/${GITHUB_REPO}.git" "$CLONE_DIR"
fi

cd "$CLONE_DIR"

# تأكد أن الفرع main موجود
if ! git rev-parse --verify main >/dev/null 2>&1; then
  git checkout -b main
else
  git checkout main
fi

echo "كتابة/تحديث ملفات النشر..."

# 1) web/next.config.js
mkdir -p web
cat > web/next.config.js <<'EOF'
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = 'tadabbur-quran';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
};

module.exports = nextConfig;
EOF

# 2) web/app/page.js (واجهة ثابتة مع fallbacks)
mkdir -p web/app
cat > web/app/page.js <<'EOF'
'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const fallbackVerses = [
  {
    _id: 'sample-1',
    chapter_id: 1,
    verse_number: 1,
    text_uthmani: 'بِسْمِ ٱللّٰهِ ٱلرَّحْمٰنِ ٱلرَّحِيمِ',
    translation: 'باسم الله الرحمن الرحيم',
  },
  {
    _id: 'sample-2',
    chapter_id: 1,
    verse_number: 2,
    text_uthmani: 'ٱلْحَمْدُ لِلّٰهِ رَبِّ ٱلْعٰلَمِينَ',
    translation: 'الحمد لله رب العالمين',
  },
  {
    _id: 'sample-3',
    chapter_id: 55,
    verse_number: 1,
    text_uthmani: 'ٱلرَّحْمٰنُ',
    translation: 'الرحمن',
  },
  {
    _id: 'sample-4',
    chapter_id: 55,
    verse_number: 2,
    text_uthmani: 'عَلَّمَ ٱلْقُرْءَانَ',
    translation: 'علّم القرآن',
  },
];

const fallbackChapters = [
  { id: 1, name_ar: 'الفاتحة', verses_count: 7, revelation_place: 'مكة' },
  { id: 55, name_ar: 'الرحمن', verses_count: 78, revelation_place: 'مكة' },
  { id: 36, name_ar: 'يس', verses_count: 83, revelation_place: 'مكة' },
];

export default function HomePage() {
  const [chapters, setChapters] = useState(fallbackChapters);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [verses, setVerses] = useState(fallbackVerses);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!API_URL) {
      setVerses(fallbackVerses);
      setChapters(fallbackChapters);
      return;
    }

    async function fetchChapters() {
      try {
        const res = await fetch(`${API_URL}/chapters`);
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          setChapters(data);
          setSelectedChapter(data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
      }
    }

    fetchChapters();
  }, []);

  useEffect(() => {
    if (!API_URL) {
      setVerses(fallbackVerses);
      return;
    }

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
  }, [selectedChapter, API_URL]);

  useEffect(() => {
    if (!query.trim() || !API_URL) {
      if (!API_URL) setVerses(fallbackVerses);
      return;
    }

    async function searchVerses() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/verses/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setVerses(Array.isArray(data) ? data : fallbackVerses);
      } catch (error) {
        console.error('Search failed:', error);
        setVerses(fallbackVerses);
      } finally {
        setLoading(false);
      }
    }

    const timeout = setTimeout(searchVerses, 400);
    return () => clearTimeout(timeout);
  }, [query, API_URL]);

  const selectedChapterMeta = chapters.find((c) => c.id === selectedChapter) || null;

  return (
    <main className="container">
      <header className="hero">
        <p className="eyebrow">تدبر القرآن الكريم</p>
        <h1>التدبُّر، الفهم، والاستماع</h1>
        <p className="subtitle">
          موقع عربي متكامل لتدبر القرآن، البحث في الآيات، واستعراض مصادر التفسير بشكل مسؤول ومؤسسي.
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
EOF

# 3) GitHub Actions workflow for Pages
mkdir -p .github/workflows
cat > .github/workflows/deploy-pages.yml <<'EOF'
name: Deploy static site to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: web/package-lock.json

      - name: Install dependencies
        working-directory: web
        run: npm install

      - name: Build static site
        working-directory: web
        env:
          NODE_ENV: production
          NEXT_PUBLIC_API_URL: https://your-render-url.onrender.com/api
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: web/out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
EOF

# 4) backend/Dockerfile
mkdir -p backend
cat > backend/Dockerfile <<'EOF'
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

ENV PORT=5000
EXPOSE 5000

CMD ["npm", "start"]
EOF

# 5) render.yaml
cat > render.yaml <<'EOF'
services:
  - type: web
    name: tadabbur-quran-api
    env: node
    plan: free
    buildCommand: cd backend && npm install --omit=dev
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGO_URI
        sync: false
EOF

# 6) README (update/overwrite)
cat > README.md <<'EOF'
# Tadabbur Quran

A full-stack Quran reflection platform built with:
- Next.js frontend
- Express + MongoDB backend
- Quran text import scripts
- realistic legal-safe tafsir source metadata

## Important legal note

This project does not include or distribute the full text of Tafsir al-Shaarawi without explicit permission from the rights holder. The app is intentionally designed to provide:
- Quran verses and translations
- source links and metadata
- legally cautious tafsir workflows
- original summaries or excerpts with attribution where permitted

## Stack
- Frontend: Next.js static export for GitHub Pages
- Backend: Express API for MongoDB-backed content
- Data source: Quran.com API for verse ingestion
- Deployment: GitHub Pages + Render or Railway

## Repository layout

```text
.
├── backend/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── web/
│   ├── app/
│   ├── package.json
│   └── next.config.js
├── .github/workflows/
│   └── deploy-pages.yml
├── data/
├── docker-compose.yml
├── render.yaml
├── README.md
├── LICENSE
├── .env.example
└── .gitignore
```

## Local development

### 1) Install dependencies

```bash
cd backend && npm install
cd ../web && npm install
```

### 2) Start MongoDB

```bash
docker-compose up -d mongo
```

### 3) Create env file

```bash
cp .env.example .env
```

### 4) Import Quran data

```bash
cd backend
npm run fetch:quran
npm run import:quran
```

### 5) Run services

```bash
# backend
cd backend
npm run dev

# frontend
cd web
npm run dev
```

Open:
- Frontend: http://localhost:3000
- API: http://localhost:5000/api/health

## GitHub Pages deployment

1. Push this repo to GitHub
2. Go to repository Settings → Pages
3. Choose Source: GitHub Actions
4. The workflow in `.github/workflows/deploy-pages.yml` will build the static frontend

The site becomes available at:
https://<your-username>.github.io/tadabbur-quran/

## Full backend deployment

For the API, use Render or Railway with the included `render.yaml` and `backend/Dockerfile`.

### Render example

1. Create a Render web service from this repository
2. Choose Docker or use the provided `render.yaml`
3. Set `MONGO_URI` as an environment variable
4. Deploy

### Required backend env vars

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/tadabbur_quran
QURAN_SOURCE_API=https://api.quran.com/api/v4
```

## Tafsir policy

To add a source like Al-Shaarawi, never upload the full copyrighted text without permission. Safer ways include:
- official links and metadata
- summaries and highlights
- excerpts with clear attribution
- explicit licensing checks before publishing full texts

## License

This project is released under MIT unless otherwise specified, but you must still respect the rights of translators and tafsir authors when republishing their content.
EOF

# Git operations: add, commit, push
git add -A
if git diff --cached --quiet; then
  echo "لا توجد تغييرات جديدة للالتزام (commit)."
else
  git commit -m "Add GitHub Pages workflow, Next.js export config, Dockerfile and deploy config"
  echo "دفع التغييرات إلى origin/main..."
  git push origin main
fi

echo
echo "تم الانتهاء من تحضير الملفات ودفعها (إن أمكن)."
echo

# نصائح بعد التشغيل
echo "الخطوات التالية (بقية العمل عليك نقرة واحدة في واجهة GitHub):"
echo "1) افتح: https://github.com/${GITHUB_REPO}/settings/pages"
echo "2) ضمن Source اختر: GitHub Actions ثم اضغط Save"
echo "3) اذهب إلى Actions لرؤية سير عمل البناء. بعد اكتمال العمل، سيظهر رابط الموقع:"
echo "   https://${GITHUB_REPO%%/*}.github.io/${REPO_NAME}/"
if [ "$GH_AVAILABLE" -eq 1 ]; then
  echo "ملاحظة: يمكنك تسجيل الدخول عبر 'gh auth login' لو لم تكن مسجلاً، وgh سيبسط المهام الإضافية."
fi

echo
echo "إن واجهت أي خطأ أثناء تشغيل السكربت (خاصة أثناء git push أو الاستنساخ)، انسخ رسالة الخطأ هنا وسأساعدك فورًا."
