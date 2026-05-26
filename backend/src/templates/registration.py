from pydantic import BaseModel, EmailStr
from typing import Annotated
from pydantic import Field

class RegistrationRequest(BaseModel):
    fio: str = Field(..., min_length=2, max_length=100, description="ФИО пользователя")
    email: EmailStr = Field(..., description="Электронная почта пользователя")
    password: str = Field(..., min_length=8, max_length=128, description="Пароль пользователя")

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="Электронная почта пользователя")
    password: str = Field(..., min_length=8, max_length=128, description="Пароль пользователя")

class LoginResponse(BaseModel):
    token: str
    type: str