from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    PORT: int = Field(default=8000)
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    OPENAI_API_KEY: Optional[str] = Field(default=None)
    GROQ_API_KEY: Optional[str] = Field(default=None)
    GROQ_MODEL: str = Field(default="openai/gpt-oss-120b")
    TYPESAFE_API_KEY: Optional[str] = Field(default=None)
    CHROMA_PERSIST_DIRECTORY: str = Field(default="./data/chroma_db")
    ALLOWED_ORIGINS: str = Field(default="http://localhost:3000,http://localhost:3001,http://localhost:5173")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()