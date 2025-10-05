from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import List

from ..models import Allocation, Domain, AllocationStatus
from ..schemas import AllocationIn, AllocationOut, DomainOut
from ..auth import require_user
from ..deps import get_db

router = APIRouter()

@router.get("/", response_model=List[DomainOut])
def list_domains(db: Session = Depends(get_db)):
    """获取可用域名列表（无需登录）"""
    domains = db.scalars(select(Domain)).all()
    return domains

@router.post("/allocations", response_model=AllocationOut)
def request_allocation(body: AllocationIn, user=Depends(require_user), db: Session = Depends(get_db)):
    """用户提交域名分发申请"""
    # 验证域名是否存在
    domain = db.get(Domain, body.domain_id)
    if not domain:
        raise HTTPException(404, "Domain not found")
    
    # 检查子域名是否已被占用
    existing = db.scalar(
        select(Allocation).where(
            Allocation.domain_id == body.domain_id,
            Allocation.subdomain == body.subdomain.lower(),
            Allocation.type == body.type,
            Allocation.status != AllocationStatus.disabled
        )
    )
    if existing:
        raise HTTPException(400, "Subdomain already allocated")
    
    alloc = Allocation(
        user_id=user.sub, 
        domain_id=body.domain_id,
        subdomain=body.subdomain.lower(), 
        type=body.type, 
        value=body.value,
        ttl=body.ttl
    )
    db.add(alloc)
    db.commit()
    db.refresh(alloc)
    return alloc

@router.get("/allocations/mine", response_model=List[AllocationOut])
def get_my_allocations(user=Depends(require_user), db: Session = Depends(get_db)):
    """获取当前用户的分发记录"""
    allocations = db.scalars(
        select(Allocation).where(Allocation.user_id == user.sub)
    ).all()
    return allocations
