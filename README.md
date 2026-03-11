# Scrutiny CBT

JAMB CBT exam practice platform for Nigerian students.

## Features
- Mock CBT exams
- Weak topic diagnostics
- Readiness score analytics
- Offline exam capability
- Campus leaderboard
- Shareable result cards

## Stack
- **Backend:** FastAPI + Gunicorn + PostgreSQL
- **Frontend:** React + Vite
- **Infrastructure:** Ubuntu VPS + Nginx + systemd

## Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env.production
# Fill in .env.production with real values
uvicorn app.main:app --reload
```

## Health Check
```
GET /health → {"status": "ok", "service": "scrutiny-cbt-api"}
```

## Project Structure
```
scrutiny-cbt/
├── backend/
│   ├── app/
│   │   └── main.py
│   ├── requirements.txt
│   ├── Procfile
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md
```
