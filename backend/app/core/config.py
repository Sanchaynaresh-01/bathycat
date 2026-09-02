from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Bathycat Configurable Boat API"
    API_V1_STR: str = "/api/v1"
    
    POSTGRES_USER: str = "user"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "bathycat_db"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"

    DATABASE_URL: Optional[str] = None

    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.DATABASE_URL:
            # SQLAlchemy 1.4+ requires postgresql:// instead of postgres://
            if self.DATABASE_URL.startswith("postgres://"):
                return self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
            return self.DATABASE_URL
        return "sqlite:///./bathycat.db"

    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_FOR_JWT_HERE"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    # Email Settings
    SMTP_TLS: bool = True
    SMTP_PORT: int = 587
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[str] = "noreply@bathycat.com"
    EMAILS_FROM_NAME: Optional[str] = "Bathycat Configuration System"

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
