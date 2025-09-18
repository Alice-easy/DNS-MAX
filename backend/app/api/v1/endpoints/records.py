from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_session
from app.crud.dns import record_crud, domain_crud
from app.schemas.dns import DNSRecordCreate, DNSRecordUpdate, DNSRecordResponse
from app.schemas import BaseResponse
from app.api.v1.endpoints.auth import get_current_user
from app.models import User

router = APIRouter()


@router.get("/domains/{domain_id}/records", response_model=List[DNSRecordResponse])
async def list_domain_records(
    domain_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_async_session)]
):
    """获取域名的所有DNS记录"""
    # 验证域名是否属于当前用户
    domain = await domain_crud.get_by_id(db, domain_id, current_user.id)
    if not domain:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Domain not found"
        )
    
    records = await record_crud.get_by_domain(db, domain_id, current_user.id)
    return records


@router.post("/domains/{domain_id}/records", response_model=DNSRecordResponse)
async def create_dns_record(
    domain_id: int,
    record_data: DNSRecordCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_async_session)]
):
    """创建DNS记录"""
    # 验证记录类型
    valid_types = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "PTR", "SRV"]
    if record_data.record_type.upper() not in valid_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid record type. Must be one of: {', '.join(valid_types)}"
        )
    
    record = await record_crud.create(db, record_data, domain_id, current_user.id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Domain not found"
        )
    
    return record


@router.get("/records/{record_id}", response_model=DNSRecordResponse)
async def get_dns_record(
    record_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_async_session)]
):
    """获取指定DNS记录"""
    record = await record_crud.get_by_id(db, record_id, current_user.id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DNS record not found"
        )
    return record


@router.put("/records/{record_id}", response_model=DNSRecordResponse)
async def update_dns_record(
    record_id: int,
    record_data: DNSRecordUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_async_session)]
):
    """更新DNS记录"""
    # 如果更新记录类型，验证其有效性
    if record_data.record_type:
        valid_types = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "PTR", "SRV"]
        if record_data.record_type.upper() not in valid_types:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid record type. Must be one of: {', '.join(valid_types)}"
            )
    
    record = await record_crud.update(db, record_id, record_data, current_user.id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DNS record not found"
        )
    
    return record


@router.delete("/records/{record_id}", response_model=BaseResponse)
async def delete_dns_record(
    record_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_async_session)]
):
    """删除DNS记录"""
    success = await record_crud.delete(db, record_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DNS record not found"
        )
    
    return BaseResponse(message="DNS record deleted successfully")