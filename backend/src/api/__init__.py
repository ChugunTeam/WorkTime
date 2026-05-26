from fastapi import APIRouter

from src.api.routers.registration import router as reg_router

main_router = APIRouter()

main_router.include_router(reg_router)
