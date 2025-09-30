from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..models import User
from ..schemas import UserOut
from ..auth import require_user
from ..deps import get_db

router = APIRouter()

@router.get("/me", response_model=UserOut)
def get_current_user(user_token = Depends(require_user), db: Session = Depends(get_db)):
    """获取当前用户信息"""
    user = db.get(User, user_token.sub)
    if not user:
        raise HTTPException(404, "User not found")
    return user
