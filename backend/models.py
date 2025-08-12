
from sqlalchemy import Column, Integer, String, DateTime, func, ForeignKey, Table
from database import Base
from datetime import datetime
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key = True, index = True)
    email = Column(String, unique = True, index = True, nullable = False )
    name = Column(String, nullable = False)
    created_at = Column(DateTime(timezone = True), server_default = func.now())
    hashed_password = Column(String, nullable = False)
    groups = relationship("Group", secondary = "group_members", back_populates = "members")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key = True, index = True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"))
    content = Column(String)
    timestamp = Column(DateTime, default = datetime.now)


    sender = relationship("User", foreign_keys = [sender_id])
    recipient = relationship("User", foreign_keys = [recipient_id])

class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key = True, index = True)
    name = Column(String, unique = True, index = True, nullable = False)

    members = relationship("User", secondary = "group_members", back_populates = "groups")

group_members = Table (
    "group_members",
    Base.metadata, 
    Column("group_id", Integer, ForeignKey("groups.id")),
    Column("user_id", Integer, ForeignKey("users.id")),
)

class GroupMessage(Base):
    __tablename__ = "group_messages"
    id = Column(Integer, primary_key = True, index = True)
    sender_id = Column(Integer, ForeignKey("users.id") )
    group_id = Column(Integer, ForeignKey("groups.id") )
    content = Column(String)
    timestamp = Column(DateTime, default = datetime.now)


    sender = relationship("User", foreign_keys =[sender_id])
    group = relationship("Group", foreign_keys=[group_id])
