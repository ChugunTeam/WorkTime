from src.database import Base
from sqlalchemy import Integer, String, ForeignKey, DateTime, func, Enum as SqlEnum
from sqlalchemy.orm import relationship, mapped_column, Mapped
from datetime import datetime
from src.schemas.working_hours_plans import EventType


class WorkingHoursFact(Base):
    """ТАБЛИЦА КОМАНД"""

    __tablename__ = "working_hours_facts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    time_start: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    time_end: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    description: Mapped[str] = mapped_column(String(1000), nullable=True)
    role: Mapped[EventType] = mapped_column(
        SqlEnum(EventType, native_enum=False), default=EventType.WORK, nullable=False
    )

    #working_hours_plans = relationship("User", back_populates = )
