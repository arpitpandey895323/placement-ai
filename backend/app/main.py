from fastapi import FastAPI

from app.database.connection import engine
from app.database.base import Base

# Import models
from app.models.user import User

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Placement Preparation System")

@app.get("/")
def home():
    return {"message": "Welcome to AI Placement Preparation System 🚀"}