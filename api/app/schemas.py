from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from .models import Role, AllocationStatus

# Token schemas
class TokenData(BaseModel):
    sub: int
    role: str
    exp: int

class TokenPair(BaseModel):
    access_token: str
    refresh_token: str

# User schemas
class UserBase(BaseModel):
    email: EmailStr

class RegisterIn(UserBase):
    password: str = Field(min_length=8)

class LoginIn(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    role: Role
    is_active: bool
    email_verified_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Domain schemas
class DomainBase(BaseModel):
    name: str = Field(pattern=r'^[a-zA-Z0-9][a-zA-Z0-9\-\.]*[a-zA-Z0-9]$')

class DomainCreate(DomainBase):
    provider: str = "DNSPod"

class DomainOut(DomainBase):
    id: int
    provider: str
    created_by: Optional[int] = None

    class Config:
        from_attributes = True

# Allocation schemas
class AllocationBase(BaseModel):
    subdomain: str = Field(pattern=r'^[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9]$', min_length=1, max_length=63)
    type: str = Field(default="A")
    value: str = Field(min_length=1, max_length=255)
    ttl: int = Field(default=600, ge=60, le=86400)

class AllocationIn(AllocationBase):
    domain_id: int = Field(description="Domain ID to allocate subdomain under")

class AllocationOut(AllocationBase):
    id: int
    user_id: int
    domain_id: int
    status: AllocationStatus
    created_at: datetime

    class Config:
        from_attributes = True

# Health check
class HealthCheck(BaseModel):
    status: str = "ok"
