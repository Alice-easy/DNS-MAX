import datetime as dt
import secrets
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from ..models import User, EmailToken, Role
from ..schemas import RegisterIn, LoginIn, UserOut, TokenPair
from ..auth import pwd_hasher, create_tokens, verify_token
from ..deps import get_db
from ..emailer import send_verification
from ..config import get_settings

router = APIRouter()
settings = get_settings()

@router.post("/register", response_model=UserOut)
async def register(payload: RegisterIn, db: Session = Depends(get_db), bg: BackgroundTasks = None):
    # 事务内确保首个用户角色升级不发生竞态
    with db.begin():
        exists = db.scalar(select(func.count(User.id)))
        role = Role.admin if exists == 0 else Role.user

        hashed = pwd_hasher.hash(payload.password)  # argon2 or bcrypt
        user = User(email=payload.email.lower(), password_hash=hashed, role=role)
        db.add(user)
        db.flush()  # get user.id

        token = secrets.token_urlsafe(48)
        db.add(EmailToken(user_id=user.id,
                          token=token,
                          expire_at=dt.datetime.utcnow() + dt.timedelta(hours=24)))
    # 发邮件（后台异步）
    verify_url = f"{settings.PUBLIC_WEB_URL}/verify?token={token}"
    if bg:
        bg.add_task(send_verification, to=user.email, verify_url=verify_url)
    return user

@router.get("/verify")
def verify_email(token: str, db: Session = Depends(get_db)):
    rec = db.scalar(select(EmailToken).where(EmailToken.token==token, EmailToken.expire_at>dt.datetime.utcnow()))
    if not rec:
        raise HTTPException(400, "Token invalid or expired")
    user = db.get(User, rec.user_id)
    user.email_verified_at = dt.datetime.utcnow()
    db.delete(rec)
    db.commit()
    return {"ok": True}

@router.post("/login", response_model=TokenPair)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email==payload.email.lower()))
    if not user or not pwd_hasher.verify(user.password_hash, payload.password):
        raise HTTPException(401, "Invalid credentials")
    if not user.email_verified_at:
        raise HTTPException(403, "Email not verified")
    access, refresh = create_tokens(user)   # jose + HS256，带 role / sub
    return {"access_token": access, "refresh_token": refresh}

@router.post("/refresh", response_model=TokenPair)
def refresh_token(payload: dict, db: Session = Depends(get_db)):
    refresh_token = payload.get("refresh_token")
    if not refresh_token:
        raise HTTPException(400, "Refresh token required")
    
    token_data = verify_token(refresh_token, settings.JWT_REFRESH_SECRET)
    user = db.get(User, token_data.sub)
    if not user:
        raise HTTPException(401, "User not found")
    
    access, refresh = create_tokens(user)
    return {"access_token": access, "refresh_token": refresh}
