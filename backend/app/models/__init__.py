from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.session import Base


class User(Base):
    """用户表"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, nullable=False, default=False)  # 管理员标识
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # 关系
    dns_providers = relationship("DNSProvider", back_populates="user", cascade="all, delete-orphan")
    domains = relationship("Domain", back_populates="user", cascade="all, delete-orphan")


class DNSProvider(Base):
    """DNS服务商凭证表"""
    __tablename__ = "dns_providers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider_name = Column(String(50), nullable=False)  # aliyun, cloudflare, tencent
    encrypted_credentials = Column(Text, nullable=False)  # AES加密的凭证JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # 唯一约束：每个用户对每个服务商只能有一套凭证
    __table_args__ = (UniqueConstraint("user_id", "provider_name", name="unique_user_provider"),)
    
    # 关系
    user = relationship("User", back_populates="dns_providers")
    domains = relationship("Domain", back_populates="provider", cascade="all, delete-orphan")


class Domain(Base):
    """域名表"""
    __tablename__ = "domains"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    provider_id = Column(Integer, ForeignKey("dns_providers.id", ondelete="CASCADE"), nullable=False)
    domain_name = Column(String(255), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # 唯一约束：每个用户的域名唯一
    __table_args__ = (UniqueConstraint("user_id", "domain_name", name="unique_user_domain"),)
    
    # 关系
    user = relationship("User", back_populates="domains")
    provider = relationship("DNSProvider", back_populates="domains")
    dns_records = relationship("DNSRecord", back_populates="domain", cascade="all, delete-orphan")


class DNSRecord(Base):
    """DNS记录表"""
    __tablename__ = "dns_records"
    
    id = Column(Integer, primary_key=True, index=True)
    domain_id = Column(Integer, ForeignKey("domains.id", ondelete="CASCADE"), nullable=False)
    record_id_on_provider = Column(String(100))  # 在DNS服务商处的记录ID
    subdomain = Column(String(255), nullable=False, default="@")  # 主机记录
    record_type = Column(String(10), nullable=False)  # A, AAAA, CNAME, MX, TXT等
    record_value = Column(String(1024), nullable=False)  # 记录值
    ttl = Column(Integer, nullable=False, default=600)  # 生存时间
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # 关系
    domain = relationship("Domain", back_populates="dns_records")