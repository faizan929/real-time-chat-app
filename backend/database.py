

from  sqlalchemy import ceate_engine
from sqlalchemy.ext.declarative import declarative_base


DATABASE_URL = "postgresql://postgres:faizan@122@localhost/whatsapp_clone"

engine = create_engine(DATABASE_URL) 
SessionLocal = sessionmaker(autocommit = False, autoFlush = False, bind = engine)
Base = declarative_base()