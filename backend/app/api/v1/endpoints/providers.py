from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_async_session
from app.crud.dns import provider_crud
from app.schemas.dns import ProviderCreate, ProviderResponse
from app.schemas import BaseResponse
from app.api.v1.endpoints.auth import get_current_user
from app.models import User

router = APIRouter()


@router.get("/", response_model=List[ProviderResponse])
async def list_providers(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_async_session)]
):
    """获取用户的所有DNS服务商"""
    providers = await provider_crud.get_by_user(db, current_user.id)
    return providers


@router.post("/", response_model=ProviderResponse)
async def create_provider(
    provider_data: ProviderCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_async_session)]
):
    """添加DNS服务商凭证"""
    # 验证服务商名称
    valid_providers = ["aliyun", "cloudflare", "tencent"]
    if provider_data.provider_name not in valid_providers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid provider name. Must be one of: {', '.join(valid_providers)}"
        )
    
    try:
        provider = await provider_crud.create(db, provider_data, current_user.id)
        return provider
    except Exception as e:
        if "unique_user_provider" in str(e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Provider credentials already exist for this user"
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create provider"
        )


@router.delete("/{provider_id}", response_model=BaseResponse)
async def delete_provider(
    provider_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_async_session)]
):
    """删除DNS服务商凭证"""
    success = await provider_crud.delete(db, provider_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Provider not found"
        )
    
    return BaseResponse(message="Provider deleted successfully")