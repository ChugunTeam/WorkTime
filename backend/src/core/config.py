import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    def __init__(self):
        self.frontend_host = os.getenv('FRONTEND_HOST', '127.0.0.1')
        self.frontend_port = os.getenv('FRONTEND_PORT', '3000')
        self.backend_host = os.getenv('BACKEND_HOST', '127.0.0.1')
        self.backend_port = os.getenv('BACKEND_PORT', '8000')
        self.db_host = os.getenv('DB_HOST', '127.0.0.1')
        self.db_port = os.getenv('DB_PORT', '5432')
        self.db_user = os.getenv('DB_USER', 'postgres')
        self.db_password = os.getenv('DB_PASSWORD', 'postgres')

# Create a global config instance
config = Config()