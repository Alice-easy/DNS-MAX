from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from typing import List, Optional

from ..models import User, Allocation, AllocationStatus, Role
from ..schemas import UserOut, AllocationOut
from ..auth import require_admin
from ..deps import get_db
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
    alloc = db.get(Allocation, alloc_id)
    if not alloc or alloc.status != AllocationStatus.pending:
        raise HTTPException(400, "Invalid allocation")
    
    try:
        resp = dnspod.create_record(alloc.subdomain, alloc.type, alloc.value, alloc.ttl)
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
