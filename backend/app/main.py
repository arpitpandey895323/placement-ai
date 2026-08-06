from fastapi import FastAPI

from app.database.connection import engine
from app.database.base import Base

# Import models
from app.models.user import User

# Import routers
from app.routers.auth import router as auth_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Placement Preparation System")

# Register routers
app.include_router(auth_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to AI Placement Preparation System 🚀"
    }