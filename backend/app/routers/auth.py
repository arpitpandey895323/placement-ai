from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from app.core.security import verify_token
from app.database.connection import get_db
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserLogin, Token
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully!"
    }


@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(user.password, db_user.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        {"sub": db_user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
@router.get("/me")
def get_current_user(token: str = Depends(oauth2_scheme)):

    email = verify_token(token)

    if email is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    return {
        "email": email,
        "message": "Welcome back!"
    }