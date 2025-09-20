from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field
import os


class Settings(BaseSettings):
    """应用程序配置"""
    
    # 应用配置
    app_name: str = "DNS Max API"
    debug: bool = False
    
    # 数据库配置
    database_url: str = Field(..., env="DATABASE_URL")
    use_local_db: bool = Field(default=False, env="USE_LOCAL_DB")
    
    # 安全配置
    secret_key: str = Field(..., env="SECRET_KEY")
    encryption_key: str = Field(..., env="ENCRYPTION_KEY")
    access_token_expire_minutes: int = 30
    algorithm: str = "HS256"
    
    # Redis配置
    redis_url: str = Field(default="redis://localhost:6379/0", env="REDIS_URL")
    
    # CORS配置
    allowed_origins: list[str] = ["http://localhost:3000", "https://*.pages.dev"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # 自动检测数据库连接配置
        self._auto_detect_database()
    
    def _auto_detect_database(self):
        """自动检测数据库连接配置"""
        if not hasattr(self, '_db_detected'):
            self._db_detected = True
            
            # 如果DATABASE_URL包含localhost，自动设置为本地模式
            if 'localhost' in self.database_url or '127.0.0.1' in self.database_url:
                self.use_local_db = True
            
            # 如果明确设置了USE_LOCAL_DB，使用该设置
            use_local_env = os.getenv('USE_LOCAL_DB', '').lower()
            if use_local_env in ('true', '1', 'yes'):
                self.use_local_db = True
            elif use_local_env in ('false', '0', 'no'):
                self.use_local_db = False
    
    @property
    def is_local_database(self) -> bool:
        """是否使用本地数据库"""
        return self.use_local_db
    
    @property
    def database_info(self) -> dict:
        """获取数据库连接信息"""
        return {
            'url': self.database_url,
            'is_local': self.is_local_database,
            'type': 'Local PostgreSQL' if self.is_local_database else 'Docker PostgreSQL'
        }


settings = Settings()