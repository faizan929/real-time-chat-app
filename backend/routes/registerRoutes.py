
from fastapi import FastAPI, Depends, HTTPException
# orm : object relation model
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from models import User
from database import Base, engine, SessionLocal
from pydantic import BaseModel, EmailStr


app = FastAPI()


Base.metadata.create_all(bind = engine)

pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class RegisterRequest(BaseModel):
    name : str
    email: EmailStr
    password: str
     

# pehla route  .post

@app.post('/register')
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
    return {"message :" "user registered successfully "} 
