
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Group
from pydantic import BaseModel
from typing import List, Optional


router = APIRouter()

@router.get("/api/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.get('/api/groups')
def get_groups(db: Session = Depends(get_db)):
    groups = db.query(Group).all()
    result = []
    for mem in groups: 
        result.append({
            "id": mem.id,
            "name": mem.name,
            "members": [{"id": user.id, "name": user.name} for user in mem.members]
        })

    return result


class GroupCreate(BaseModel):
    name: str
    member_ids: Optional[List[int]] = []


@router.post('/api/groups')
def create_group(group: GroupCreate, db: Session = Depends(get_db)):
    existing = db.query(Group).filter(Group.name == group.name).first()
    if existing:
        raise HTTPException(status_code = 400, detail = "Group name already exists")
    
    new_group = Group(name = group.name)
    db.add(new_group)
    db.commit()
    db.refresh(new_group)
    return {
        "id": new_group.id,
        "name": new_group.name,
        "members" :[{"id" : user.id, "name": user.name } for user in new_group.members ]
        }

