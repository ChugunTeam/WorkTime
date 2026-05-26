from fastapi import APIRouter

from src.templates import *
from src.service.registration import *

router = APIRouter(tags=["Регистрация/Авторизация"])

@router.post("/registration")
async def registration(user:RegistrationRequest) -> LoginResponse:
    return await registration_user(user)