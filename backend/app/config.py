import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True, parents=True)

# Ensure local data directory is used for CrewAI and token storage
os.environ["LOCALAPPDATA"] = str(DATA_DIR)
os.environ["APPDATA"] = str(DATA_DIR)
os.environ["CREWAI_DISABLE_TELEMETRY"] = "true"
os.environ["OTEL_SDK_DISABLED"] = "true"

from pydantic import BaseModel

class Settings(BaseModel):
    app_name: str = "SwarmStudio API"
    app_version: str = "1.0.0"
    ollama_base_url: str = os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434")
    ollama_model: str = os.getenv("OLLAMA_MODEL", "llama3.2")
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_key: str = os.getenv("SUPABASE_KEY", "")
    storage_mode: str = os.getenv("STORAGE_MODE", "sqlite")
    demo_fallback_enabled: bool = os.getenv("DEMO_FALLBACK_ENABLED", "true").lower() in ("true", "1", "yes")
    jwt_secret: str = os.getenv("JWT_SECRET", "swarmstudio-creative-swarm-secret-key-2026")
    jwt_algorithm: str = "HS256"
    jwt_expiration_days: int = 30

settings = Settings()
