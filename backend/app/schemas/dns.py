from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


# DNS服务商相关Schema
class ProviderBase(BaseModel):
    provider_name: str = Field(..., description="DNS服务商名称：aliyun, cloudflare, tencent")


class ProviderCreate(ProviderBase):
    credentials: Dict[str, Any] = Field(..., description="服务商API凭证")


class ProviderResponse(ProviderBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


# 域名相关Schema
class DomainBase(BaseModel):
    domain_name: str = Field(..., description="域名，如 example.com")


class DomainCreate(DomainBase):
    provider_id: int = Field(..., description="DNS服务商ID")


class DomainResponse(DomainBase):
    id: int
    user_id: int
    provider_id: int
    provider: ProviderResponse
    created_at: datetime
    
    class Config:
        from_attributes = True


# DNS记录相关Schema
class DNSRecordBase(BaseModel):
    subdomain: str = Field(default="@", description="主机记录，如 www, @")
    record_type: str = Field(..., description="记录类型：A, AAAA, CNAME, MX, TXT等")
    record_value: str = Field(..., description="记录值")
    ttl: int = Field(default=600, description="生存时间（秒）")


class DNSRecordCreate(DNSRecordBase):
    pass


class DNSRecordUpdate(BaseModel):
    subdomain: Optional[str] = None
    record_type: Optional[str] = None
    record_value: Optional[str] = None
    ttl: Optional[int] = None


class DNSRecordResponse(DNSRecordBase):
    id: int
    domain_id: int
    record_id_on_provider: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True