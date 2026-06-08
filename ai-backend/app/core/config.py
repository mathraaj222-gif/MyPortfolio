from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    # Field mappings auto-read matching keys from your active .env file
    PORT: int = Field(default=8000)
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    OPENAI_API_KEY: str

    # Direct Pydantic to read an external file configuration
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

# Instantiate a single config instance to use anywhere across the app
settings = Settings()