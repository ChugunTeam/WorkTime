from src.database import Base
from sqlalchemy import Integer, String, ForeignKey, DateTime, func, Enum as SqlEnum
from sqlalchemy.orm import relationship, mapped_column, Mapped
from datetime import datetime
from enum import Enum


class EventType(str, Enum):
    """ТАБЛИЦА ПЛАНОВЫХ ЧАСОВ"""

    MEETING = "meeting"
    WORK = "work"
    OTHER = "other"


class WorkingHoursPlan(Base):
    """ТАБЛИЦА КОМАНД"""

    __tablename__ = "working_hours_plans"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    time_start: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    time_end: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    last_update: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=func.now(), onupdate=func.now()
    )
    role: Mapped[EventType] = mapped_column(
        SqlEnum(EventType, native_enum=False), default=EventType.WORK, nullable=False
    )
    user: Mapped["User"] = relationship(
        "User", 
        back_populates="plans"
    )
