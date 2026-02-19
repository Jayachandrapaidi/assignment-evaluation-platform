from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.engine import Engine
import sqlite3

# ==========================
# Database URL
# ==========================
DATABASE_URL = "sqlite:///./assignment.db"

# ==========================
# Engine Configuration
# ==========================
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # Required for SQLite
    echo=False,  # Set True if you want SQL logs
    future=True
)

# ==========================
# Enable Foreign Key Support in SQLite
# ==========================
@event.listens_for(Engine, "connect")
def enable_sqlite_foreign_keys(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, sqlite3.Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON;")
        cursor.close()

# ==========================
# Session Configuration
# ==========================
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ==========================
# Base Model
# ==========================
Base = declarative_base()


# ==========================
# Dependency (IMPORTANT for FastAPI)
# ==========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
