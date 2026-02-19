from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import assignments, submissions

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Intelligent Assignment Evaluation API",
    description="API for managing assignments, submissions, and AI evaluation.",
    version="1.0.0"
)

# ==========================
# CORS Configuration
# ==========================
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================
# Root Endpoint
# ==========================
@app.get("/")
def root():
    return {"message": "API is running 🚀"}

# ==========================
# Include Routers (with prefix)
# ==========================
app.include_router(
    assignments.router,
    prefix="/api/v1",
    tags=["Assignments"]
)

app.include_router(
    submissions.router,
    prefix="/api/v1",
    tags=["Submissions"]
)
