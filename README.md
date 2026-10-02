# Tadabbur Quran

A full-stack website for reflecting on the Quran with:
- Quran text search
- chapter and verse browsing
- audio/recitation support hooks
- tafsir source metadata and legal-safe references
- clean Arabic-first UI

Important: This project does not distribute full Shaarawi tafsir text without explicit permission from the rights holder. It instead provides source metadata, summaries, and references where licensing allows. Always verify the rights status before publishing full tafsir content.

## Stack
- Frontend: Next.js
- Backend: Express + MongoDB
- Search: MongoDB text search (MVP)
- Data source: Quran.com API

## Quick start

1. Install dependencies:

```bash
# root
mkdir -p data

# backend
cd backend
npm install

# frontend
cd ../web
npm install
```

2. Start MongoDB (optional via Docker):

```bash
docker-compose up -d mongo
```

3. Copy environment file:

```bash
cp .env.example .env
```

4. Fetch Quran data:

```bash
cd backend
npm run fetch:quran
npm run import:quran
```

5. Run services:

```bash
# backend
cd backend
npm run dev

# frontend
cd web
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:5000

## Project structure

```text
.
├── backend/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── web/
│   ├── app/
│   ├── package.json
│   └── ...
├── data/
├── .env.example
├── docker-compose.yml
├── README.md
└── .gitignore
```

## License note

This project intentionally does not include the full text of Tafsir al-Shaarawi unless a valid licensing arrangement exists. For rights-sensitive material, use source links, content excerpts, or original summaries only.

## Roadmap
- Search by verse text and translation
- Arabic/English translation support
- audio handling for recitations
- tafsir source panel with legal-safe licensing status
- dashboard/teacher mode for advanced study

## Contribution

Pull requests are welcome.
