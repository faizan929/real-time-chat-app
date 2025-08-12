

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Message, GroupMessage
from database import get_db
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()


class MessageRequest(BaseModel):
    sender_id: int
    recipient_id: int
    content: str
    is_group: bool = False

class GroupMessageRequest(BaseModel):
    sender_id: int
    group_id: int
    content: str
 


@router.post('/send-message')
def send_message(message: MessageRequest, db: Session = Depends(get_db)):
    if message.is_group:
        new_message = GroupMessage(
            sender_id = message.sender_id,
            group_id = message.recipient_id,
            content = message.content,
            timestamp = datetime.now(),

            )

    else:
        new_message = Message (
            sender_id = message.sender_id,
            recipient_id = message.recipient_id,
            content = message.content,
            timestamp = datetime.now(),
            )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return {
        "message" : "Messages sent successfully",
        "message_id" : new_message.id
    }

@router.get('/messages/{user1_id}/{user2_id}')
def get_chat_history(user1_id : int, user2_id : int, db: Session = Depends(get_db)):
    messages = db.query(Message).filter(
        ((Message.sender_id == user1_id) & (Message.recipient_id == user2_id)) |
        ((Message.sender_id == user2_id) & (Message.recipient_id == user1_id))
    ).order_by(Message.timestamp).all()
    return {
        "messages" : messages
    }



@router.get('/group-messages/{group_id}')
def get_group_chat_history(group_id: int, db:Session = Depends(get_db)):
    messages = db.query(GroupMessage).filter(
        GroupMessage.group_id == group_id
    ).order_by(GroupMessage.timestamp).all()

    return {
        "messages": messages
    }

