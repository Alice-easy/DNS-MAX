import logging
import os
import secrets
from datetime import datetime, timedelta
from typing import Optional

import jwt
from fastapi import HTTPException, Security, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
# from passlib.hash import argon2
from sqlalchemy.orm import Session

from .models import User
from .schemas import TokenData
from .config import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)

# 密码哈希
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# Bearer token scheme
bearer_scheme = HTTPBearer(auto_error=False)

class PasswordHasher:
    def hash(self, password: str) -> str:
        return pwd_context.hash(password)
    
    def verify(self, hashed: str, plain: str) -> bool:
        return pwd_context.verify(plain, hashed)

pwd_hasher = PasswordHasher()

def create_tokens(user: User) -> tuple[str, str]:
    """创建访问令牌和刷新令牌"""
    now = datetime.utcnow()
    
    access_payload = {
        "sub": user.id,
        "role": user.role.value,
        "exp": now + timedelta(minutes=settings.ACCESS_TOKEN_TTL_MIN),
        "iat": now,
        "type": "access"
    }
    
    refresh_payload = {
        "sub": user.id,
        "role": user.role.value,
        "exp": now + timedelta(days=settings.REFRESH_TOKEN_TTL_DAYS),
        "iat": now,
        "type": "refresh"
    }
    
    access_token = jwt.encode(access_payload, settings.JWT_SECRET, algorithm="HS256")
    refresh_token = jwt.encode(refresh_payload, settings.JWT_REFRESH_SECRET, algorithm="HS256")
    
    return access_token, refresh_token

def verify_token(token: str, secret: str) -> TokenData:
    """验证JWT令牌"""
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        return TokenData(
            sub=payload["sub"],
            role=payload["role"],
            exp=payload["exp"]
        )
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_user(
    request: Request,
    creds: Optional[HTTPAuthorizationCredentials] = Security(bearer_scheme),
) -> TokenData:
    """要求用户认证"""
    token: Optional[str] = None
    token_source = None

    if creds and creds.scheme and creds.credentials:
        token = creds.credentials
        token_source = "authorization"
    else:
        cookie_token = request.cookies.get("access_token")
        if cookie_token:
            token = cookie_token
            token_source = "cookie"

    if not token:
        logger.info(
            "Authentication failed: no bearer token or access_token cookie. Cookies available: %s",
            list(request.cookies.keys()),
        )
        raise HTTPException(status_code=401, detail="Not authenticated")

    logger.info(
        "Authenticating via %s token: %.8s… (cookies=%s)",
        token_source,
        token,
        list(request.cookies.keys()),
    )

    try:
        return verify_token(token, settings.JWT_SECRET)
    except HTTPException as exc:
        logger.warning("Token verification failed via %s: %s", token_source, exc.detail)
        raise

def require_admin(user: TokenData = Security(require_user)) -> TokenData:
    """要求管理员权限"""
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user

def generate_verification_token() -> str:
    """生成邮箱验证令牌"""
    return secrets.token_urlsafe(48)
