
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User


router = APIRouter()

@router.get("/api/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

