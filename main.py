from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Scrutiny CBT API",
    description="JAMB CBT exam practice platform for Nigerian students",
    version="1.0.0"
)

# CORS — update origins when frontend domain is confirmed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Health Check ---
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "scrutiny-cbt-api"}


# --- Root ---
@app.get("/")
def root():
    return {"message": "Scrutiny CBT API is running"}


# --- Placeholder: Auth routes (to be implemented) ---
# POST /auth/register
# POST /auth/login
# POST /auth/refresh


# --- Placeholder: Exam routes (to be implemented) ---
# GET  /exams/
# GET  /exams/{exam_id}
# POST /exams/{exam_id}/submit


# --- Placeholder: Question routes (to be implemented) ---
# GET  /questions/
# GET  /questions/{subject}
