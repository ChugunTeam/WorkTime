from src.database import Base
from sqlalchemy import Integer, String
from sqlalchemy.orm import relationship, mapped_column, Mapped
from enum import Enum
from typing import List


class Team(Base):
    """ТАБЛИЦА КОМАНД"""

    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)

    users: Mapped[List["User"]] = relationship(
        "User", 
        secondary="teams_users", 
        back_populates="teams"
    )
    
