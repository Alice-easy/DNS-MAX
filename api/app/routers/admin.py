from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import List, Optional

from ..models import User, Allocation, AllocationStatus, Role
from ..schemas import UserOut, AllocationOut
from ..auth import require_admin
from ..deps import get_db
from ..config import get_config_value, set_config_value
from .. import dnspod

router = APIRouter()

@router.get("/users", response_model=List[UserOut])
def get_users(admin=Depends(require_admin), db: Session = Depends(get_db)):
    """获取所有用户列表"""
    users = db.scalars(select(User)).all()
    return users

@router.patch("/users/{user_id}")
def update_user(user_id: int, role: Optional[str] = None, is_active: Optional[bool] = None, 
                admin=Depends(require_admin), db: Session = Depends(get_db)):
    """更新用户权限"""
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    
    if role and role in ["admin", "user"]:
        user.role = Role(role)
    if is_active is not None:
        user.is_active = is_active
    
    db.commit()
    return {"ok": True}

@router.get("/allocations", response_model=List[AllocationOut])
def get_allocations(status: Optional[str] = None, admin=Depends(require_admin), db: Session = Depends(get_db)):
    """获取分发申请列表"""
    query = select(Allocation)
    if status:
        query = query.where(Allocation.status == AllocationStatus(status))
    
    allocations = db.scalars(query).all()
    return allocations

@router.post("/allocations/{alloc_id}/approve")
def approve_allocation(alloc_id: int, admin=Depends(require_admin), db: Session = Depends(get_db)):
    """审批通过分发申请"""
    from ..models import Domain
    
    alloc = db.get(Allocation, alloc_id)
    if not alloc or alloc.status != AllocationStatus.pending:
        raise HTTPException(400, "Invalid allocation")
    
    # 获取域名
    domain = db.get(Domain, alloc.domain_id)
    if not domain:
        raise HTTPException(404, "Domain not found")
    
    try:
        resp = dnspod.create_record(db, domain.name, alloc.subdomain, alloc.type, alloc.value, alloc.ttl)
        # 记录返回的 RecordId 以便后续删除/禁用
        # alloc.provider_record_id = resp.RecordId
        alloc.status = AllocationStatus.active
        db.commit()
        return {"ok": True}
    except Exception as e:
        raise HTTPException(500, f"DNS record creation failed: {str(e)}")

@router.post("/allocations/{alloc_id}/disable")
def disable_allocation(alloc_id: int, admin=Depends(require_admin), db: Session = Depends(get_db)):
    """禁用分发记录"""
    alloc = db.get(Allocation, alloc_id)
    if not alloc:
        raise HTTPException(404, "Allocation not found")
    
    alloc.status = AllocationStatus.disabled
    db.commit()
    return {"ok": True}

@router.get("/config")
def get_system_config(admin=Depends(require_admin), db: Session = Depends(get_db)):
    """获取系统配置"""
    config_keys = [
        "MAIL_PROVIDER",
        "RESEND_API_KEY",
        "EMAIL_FROM",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASS",
        "DNSPOD_SECRET_ID",
        "DNSPOD_SECRET_KEY",
        "DNS_DEFAULT_TTL",
    ]
    
    config = {}
    for key in config_keys:
        value = get_config_value(db, key, "")
        # 敏感信息脱敏
        if key in ["RESEND_API_KEY", "SMTP_PASS", "DNSPOD_SECRET_KEY"] and value:
            config[key] = "***已配置***"
        else:
            config[key] = value
    
    return config

@router.patch("/config")
def update_system_config(payload: dict, admin=Depends(require_admin), db: Session = Depends(get_db)):
    """更新系统配置"""
    allowed_keys = [
        "MAIL_PROVIDER",
        "RESEND_API_KEY",
        "EMAIL_FROM",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASS",
        "DNSPOD_SECRET_ID",
        "DNSPOD_SECRET_KEY",
        "DNS_DEFAULT_TTL",
    ]
    
    for key, value in payload.items():
        if key not in allowed_keys:
            continue
        # 如果是敏感字段且值为占位符，则跳过更新
        if key in ["RESEND_API_KEY", "SMTP_PASS", "DNSPOD_SECRET_KEY"] and value == "***已配置***":
            continue
        set_config_value(db, key, value)
    
    return {"ok": True}

@router.get("/domains")
def get_domains(admin=Depends(require_admin), db: Session = Depends(get_db)):
    """获取数据库中的域名列表"""
    from ..models import Domain
    domains = db.scalars(select(Domain)).all()
    return [{"id": d.id, "name": d.name, "provider": d.provider} for d in domains]

@router.post("/domains/sync")
def sync_domains(admin=Depends(require_admin), db: Session = Depends(get_db)):
    """同步 DNSPod 托管的域名到数据库"""
    from ..models import Domain
    
    try:
        dnspod_domains = dnspod.list_domains(db)
        
        synced_count = 0
        for d in dnspod_domains:
            # 检查域名是否已存在
            existing = db.scalar(select(Domain).where(Domain.name == d["name"]))
            if not existing:
                domain = Domain(name=d["name"], provider="DNSPod")
                db.add(domain)
                synced_count += 1
        
        db.commit()
        
        return {
            "ok": True,
            "total": len(dnspod_domains),
            "synced": synced_count,
            "domains": [d["name"] for d in dnspod_domains]
        }
    except Exception as e:
        raise HTTPException(500, f"Failed to sync domains: {str(e)}")
