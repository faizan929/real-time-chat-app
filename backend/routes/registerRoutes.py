
from fastapi import APIRouter, Depends, HTTPException
# orm : object relation model
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import User
from database import Base, engine, SessionLocal
from pydantic import BaseModel, EmailStr
from database import get_db


router = APIRouter()  # app= FastAPI ==>> app.get, app.post


Base.metadata.create_all(bind = engine)

pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")




class RegisterRequest(BaseModel):

    name : str
    email: EmailStr
    password: str
     
class LoginRequest(BaseModel):
    email: EmailStr
    password: str



@router.post('/register')
def register_user(user:RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code = 400, detail = "User already registered")
    hashed_password = pwd_context.hash(user.password)
    new_user = User(
        name = user.name,
        email = user.email,
        hashed_password = hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "message" : "user registered successfully ",
        "user_id" : new_user.id,
        "email" : new_user.email
            } 

@router.post('/login')
def login_user(user:LoginRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if not existing_user:
        raise HTTPException(status_code = 400, detail = "user not found")

    if not pwd_context.verify(user.password, existing_user.hashed_password):
        raise HTTPException(status_code = 400, detail = "wrong password")


    print("debuggin existing user", existing_user.name) 

    return {
        "message" : "Login Successful",
        "user_id" : existing_user.id,
        "name" : existing_user.name,
        "email": existing_user.email,
    }