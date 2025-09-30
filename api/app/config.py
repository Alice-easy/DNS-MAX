import os
from functools import lru_cache

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
    
    # Mail
    MAIL_PROVIDER: str = os.getenv("MAIL_PROVIDER", "SMTP")
    RESEND_API_KEY: str = os.getenv("RESEND_API_KEY", "")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "DomainApp <no-reply@yourdomain.com>")
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.sendgrid.net")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASS: str = os.getenv("SMTP_PASS", "")
    
    # DNSPod
    DNSPOD_SECRET_ID: str = os.getenv("DNSPOD_SECRET_ID", "")
    DNSPOD_SECRET_KEY: str = os.getenv("DNSPOD_SECRET_KEY", "")
    DNS_ROOT_DOMAIN: str = os.getenv("DNS_ROOT_DOMAIN", "example.com")
    DNS_DEFAULT_TTL: int = int(os.getenv("DNS_DEFAULT_TTL", "600"))
    
    # CORS/Cookies
    COOKIE_DOMAIN: str = os.getenv("COOKIE_DOMAIN", ".yourdomain.com")

@lru_cache()
def get_settings():
    return Settings()
