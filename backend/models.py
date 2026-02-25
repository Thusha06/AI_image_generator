from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base

class ImageHistory(Base):
    __tablename__ = "image_history"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    model_used = Column(String)
    processed_path = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)