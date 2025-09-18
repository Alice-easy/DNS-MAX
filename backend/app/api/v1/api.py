from fastapi import APIRouter
from app.api.v1.endpoints import auth, providers, domains, records

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(providers.router, prefix="/providers", tags=["providers"])
api_router.include_router(domains.router, prefix="/domains", tags=["domains"])
api_router.include_router(records.router, prefix="/dns-records", tags=["records"])