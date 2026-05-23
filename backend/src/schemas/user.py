from src.database import Base
from sqlalchemy import Column, Integer, String, Enum as SqlEnum
from sqlalchemy.orm import relationship, mapped_column, Mapped
from enum import Enum


class UserRole(str, Enum):
    """РОЛИ ПОЛЬЗОВАТЕЛЕЙ"""

    ADMIN = "admin"
    ANALYST = "analyst"
    HR = "hr"
    PROJECT_MANAGER = "project_manager"
    TEAM_LEAD = "team_lead"
    WORKER = "worker"


class User(Base):
    """ТАБЛИЦА ПОЛЬЗОВАТЕЛЕЙ"""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    role: Mapped[UserRole] = mapped_column(
        SqlEnum(UserRole, native_enum=False), default=UserRole.WORKER, nullable=False
    )
    # Часовой пояс в формате смещения от UTC в часах
    time_zone: Mapped[int] = mapped_column(Integer, nullable=False)

    #work_times = relationship("WorkTime", back_populates="user")
