from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import List

from ..models import Allocation, Domain, AllocationStatus
from ..schemas import AllocationIn, AllocationOut
from ..auth import require_user
from ..deps import get_db
from ..config import get_settings

router = APIRouter()
settings = get_settings()

def _get_root_domain_id(db: Session) -> int:
    """获取根域名ID，如果不存在则创建"""
    domain = db.scalar(select(Domain).where(Domain.name == settings.DNS_ROOT_DOMAIN))
    if not domain:
        domain = Domain(name=settings.DNS_ROOT_DOMAIN, provider="DNSPod")
        db.add(domain)
        db.commit()
        db.refresh(domain)
    return domain.id

@router.post("/", response_model=AllocationOut)
def request_allocation(body: AllocationIn, user=Depends(require_user), db: Session = Depends(get_db)):
    """用户提交域名分发申请"""
    # 检查子域名是否已被占用
    existing = db.scalar(
        select(Allocation).where(
            Allocation.domain_id == _get_root_domain_id(db),
            Allocation.subdomain == body.subdomain.lower(),
            Allocation.type == body.type,
            Allocation.status != AllocationStatus.disabled
        )
    )
    if existing:
        raise HTTPException(400, "Subdomain already allocated")
    
    alloc = Allocation(
        user_id=user.sub, 
        domain_id=_get_root_domain_id(db),
        subdomain=body.subdomain.lower(), 
        type=body.type, 
        value=body.value,
        ttl=body.ttl
    )
    db.add(alloc)
    db.commit()
    db.refresh(alloc)
    return alloc

@router.get("/mine", response_model=List[AllocationOut])
def get_my_allocations(user=Depends(require_user), db: Session = Depends(get_db)):
    """获取当前用户的分发记录"""
    allocations = db.scalars(
        select(Allocation).where(Allocation.user_id == user.sub)
    ).all()
    return allocations
