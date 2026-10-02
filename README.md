# Tadabbur Quran

A full-stack Quran reflection platform built with:
- Next.js frontend
- Express + MongoDB backend
- Quran text import scripts
- legal-safe tafsir source registry

## Important legal note

This project does not include or distribute the full text of Tafsir al-Shaarawi without clear permission from the rights holder. The app is intentionally structured to:
- show Quran verses and translations
- support source links and metadata
- keep rights-sensitive tafsir materials behind a verification workflow

## Project structure

```text
.
├── backend/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── package.json
│   └── server.js
├── web/
│   ├── app/
│   ├── package.json
│   └── next.config.js
├── data/
├── .env.example
├── docker-compose.yml
├── README.md
├── LICENSE
└── .gitignore
```

## Requirements
- Node.js 18+
- MongoDB
- Docker (optional for MongoDB container)

## Setup

### 1) Install dependencies

```bash
cd backend && npm install
cd ../web && npm install
```

### 2) Start MongoDB

Option A: Docker

```bash
docker-compose up -d mongo
```

### 3) Create environment

```bash
cp .env.example .env
```

### 4) Download Quran data

```bash
cd backend
npm run fetch:quran
npm run import:quran
```

### 5) Start services

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

## Features included
- search Quran verses
- browse chapters and verses
- Arabic-first interface
- dynamic chapter list
- tafsir source data model
- clean foundation for premium features

## Recommended next upgrades
- Arabic search indexing with Meilisearch or ElasticSearch
- audio recitation integration
- tafsir sources dashboard
- user accounts and bookmarks
- CMS/admin panel

## Tafsir licensing guidance

If you want to add a tafsir source like Al-Shaarawi, verify licensing before publishing full texts. Safer approaches include:
- official links to source pages
- excerpts with attribution
- original summaries and notes
- permission workflows before upload

## License

This repository is licensed under the MIT License unless otherwise specified. Use caution with copyrighted tafsir content.
