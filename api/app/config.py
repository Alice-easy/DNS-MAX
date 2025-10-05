import os
from functools import lru_cache
from typing import Optional

class Settings:
    # Database
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "domainapp")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "domainapp") 
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "password")
    DATABASE_URL: str = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@db:5432/{POSTGRES_DB}"
    
    # JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "change_me_super_long")
    JWT_REFRESH_SECRET: str = os.getenv("JWT_REFRESH_SECRET", "change_me_even_longer")
    ACCESS_TOKEN_TTL_MIN: int = int(os.getenv("ACCESS_TOKEN_TTL_MIN", "30"))
    REFRESH_TOKEN_TTL_DAYS: int = int(os.getenv("REFRESH_TOKEN_TTL_DAYS", "14"))
    
    # Public URLs
    PUBLIC_WEB_URL: str = os.getenv("PUBLIC_WEB_URL", "https://yourdomain.com")
    PUBLIC_API_URL: str = os.getenv("PUBLIC_API_URL", "https://api.yourdomain.com")
    
    # CORS/Cookies
    COOKIE_DOMAIN: str = os.getenv("COOKIE_DOMAIN", ".yourdomain.com")
    COOKIE_SECURE: bool = os.getenv("COOKIE_SECURE", "false").lower() == "true"

@lru_cache()
def get_settings():
    return Settings()

def get_config_value(db, key: str, default: str = "") -> str:
    """从数据库获取配置，如果不存在则返回环境变量或默认值"""
    from .models import SystemConfig
    from sqlalchemy import select
    
    # 首先尝试从数据库读取
    config = db.scalar(select(SystemConfig).where(SystemConfig.key == key))
    if config and config.value:
        return config.value
    
    # 回退到环境变量
    return os.getenv(key, default)

def set_config_value(db, key: str, value: Optional[str]):
    """设置系统配置到数据库"""
    from .models import SystemConfig
    from sqlalchemy import select
    
    config = db.scalar(select(SystemConfig).where(SystemConfig.key == key))
    if config:
        config.value = value
    else:
        config = SystemConfig(key=key, value=value)
        db.add(config)
    db.commit()
