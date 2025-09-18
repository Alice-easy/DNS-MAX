from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_session
from app.crud.dns import domain_crud, provider_crud
from app.schemas.dns import DomainCreate, DomainResponse
from app.schemas import BaseResponse
from app.api.v1.endpoints.auth import get_current_user
from app.models import User

router = APIRouter()


@router.get("/", response_model=List[DomainResponse])
async def list_domains(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_async_session)]
):
    """获取用户的所有域名"""
    domains = await domain_crud.get_by_user(db, current_user.id)
    return domains


@router.post("/", response_model=DomainResponse)
async def create_domain(
    domain_data: DomainCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_async_session)]
):
    """添加域名"""
    # 验证DNS服务商是否属于当前用户
    provider = await provider_crud.get_by_id(db, domain_data.provider_id, current_user.id)
    if not provider:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="DNS provider not found"
        )
    
    try:
        domain = await domain_crud.create(db, domain_data, current_user.id)
        return domain
    except Exception as e:
        if "unique_user_domain" in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Domain already exists for this user"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create domain"
        )


@router.get("/{domain_id}", response_model=DomainResponse)
async def get_domain(
    domain_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_async_session)]
):
    """获取指定域名信息"""
    domain = await domain_crud.get_by_id(db, domain_id, current_user.id)
    if not domain:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Domain not found"
        )
    return domain


@router.delete("/{domain_id}", response_model=BaseResponse)
async def delete_domain(
    domain_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_async_session)]
):
    """删除域名"""
    success = await domain_crud.delete(db, domain_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Domain not found"
        )
    
    return BaseResponse(message="Domain deleted successfully")