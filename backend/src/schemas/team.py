from src.database import Base
from sqlalchemy import Integer, String
from sqlalchemy.orm import relationship, mapped_column, Mapped
from enum import Enum


class Team(Base):
    """ТАБЛИЦА КОМАНД"""

    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    full_name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)

    # relationship
