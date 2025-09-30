from sqlalchemy.orm import Session
from .db import SessionLocal

def get_db():
    """数据库依赖注入"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
