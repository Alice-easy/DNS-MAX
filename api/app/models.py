import enum, datetime as dt
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Enum, Boolean, Integer, ForeignKey, DateTime, UniqueConstraint, Text

class Base(DeclarativeBase): pass

class Role(str, enum.Enum):
    admin = "admin"
    user = "user"

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(254), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[Role] = mapped_column(Enum(Role), default=Role.user)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    email_verified_at: Mapped[dt.datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, default=dt.datetime.utcnow)

class EmailToken(Base):
    __tablename__ = "email_tokens"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    token: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    expire_at: Mapped[dt.datetime] = mapped_column(DateTime, index=True)

class Domain(Base):
    __tablename__ = "domains"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(253), unique=True, index=True)  # e.g. example.com
    provider: Mapped[str] = mapped_column(String(32), default="DNSPod")
    created_by: Mapped[int | None] = mapped_column(ForeignKey("users.id"))

class AllocationStatus(str, enum.Enum):
    pending = "pending"
    active = "active"
    disabled = "disabled"

class Allocation(Base):
    __tablename__ = "allocations"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    domain_id: Mapped[int] = mapped_column(ForeignKey("domains.id"))
    subdomain: Mapped[str] = mapped_column(String(63))  # e.g. alice
    type: Mapped[str] = mapped_column(String(16), default="A")
    value: Mapped[str] = mapped_column(String(255))     # IP or CNAME target
    ttl: Mapped[int] = mapped_column(Integer, default=600)
    status: Mapped[AllocationStatus] = mapped_column(Enum(AllocationStatus), default=AllocationStatus.pending)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, default=dt.datetime.utcnow)

    __table_args__ = (UniqueConstraint("domain_id","subdomain","type", name="uq_record"),)
