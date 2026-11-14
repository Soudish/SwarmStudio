from fastapi import APIRouter
from app.config import settings
from app.models.schemas import SettingsUpdate
from app.services.ollama_service import ollama_service

router = APIRouter(prefix="/api/settings", tags=["settings"])

@router.get("")
async def get_settings():
    health = await ollama_service.check_health()
    models = await ollama_service.list_models()
    return {
        "ollama_base_url": settings.ollama_base_url,
        "ollama_model": settings.ollama_model,
        "supabase_url": settings.supabase_url,
        "supabase_configured": bool(settings.supabase_url and settings.supabase_key),
        "storage_mode": settings.storage_mode,
        "demo_fallback_enabled": settings.demo_fallback_enabled,
        "ollama_status": health,
        "available_models": models
    }

@router.post("")
async def update_settings(req: SettingsUpdate):
    if req.ollama_base_url is not None:
        settings.ollama_base_url = req.ollama_base_url.rstrip("/")
        ollama_service.base_url = settings.ollama_base_url
    if req.ollama_model is not None:
        settings.ollama_model = req.ollama_model
    if req.supabase_url is not None:
        settings.supabase_url = req.supabase_url
    if req.supabase_key is not None:
        settings.supabase_key = req.supabase_key
    if req.demo_fallback_enabled is not None:
        settings.demo_fallback_enabled = req.demo_fallback_enabled

    return await get_settings()

@router.post("/test-ollama")
async def test_ollama():
    health = await ollama_service.check_health()
    models = await ollama_service.list_models()
    return {
        "status": health,
        "models": models
    }
