<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
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
>>>>>>> 1fedad5b66951a854f7691a1c84e342d791f4339
