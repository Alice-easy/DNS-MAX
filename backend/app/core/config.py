from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """应用程序配置"""
    
    # 应用配置
    app_name: str = "DNS Max API"
    debug: bool = False
    
    # 数据库配置
    database_url: str = Field(..., env="DATABASE_URL")
    
    # 安全配置
    secret_key: str = Field(..., env="SECRET_KEY")
    encryption_key: str = Field(..., env="ENCRYPTION_KEY")
    access_token_expire_minutes: int = 30
    algorithm: str = "HS256"
    
    # CORS配置
    allowed_origins: list[str] = ["http://localhost:3000", "https://*.pages.dev"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()