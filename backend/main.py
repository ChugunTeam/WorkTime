import asyncio
import uvicorn
from fastapi import FastAPI
from sqlalchemy.exc import OperationalError, SQLAlchemyError

# Импортируем конфигурацию
from src.core.config import config
from src.api import main_router

app = FastAPI()
app.include_router(main_router)

async def main():
    # Запуск Uvicorn сервера
    uvicorn.run(
        "main:app",
        host=config.backend_host,
        port=int(config.backend_port),
        reload=True
    )

if __name__ == "__main__":
    asyncio.run(main())