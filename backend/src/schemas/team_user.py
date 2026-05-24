from src.database import Base
from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import relationship, mapped_column, Mapped
from enum import Enum


class TeamUser(Base):
    """ТАБЛИЦА СООТВЕТСТВИЙ ПОЛЬЗОВАТЕЛЕЙ К КОМАНДАМ"""

    __tablename__ = "teams_users"

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, primary_key=True)
    team_id: Mapped[int] = mapped_column(Integer, ForeignKey("teams.id"), nullable=False, primary_key=True)

    #relationship