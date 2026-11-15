import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional
from ..services.media_service import media_service, IMAGES_DIR
from ..services.music_service import music_service, AUDIO_DIR

router = APIRouter(prefix="/api/media", tags=["media"])

class GenerateImageRequest(BaseModel):
    prompt: str
    width: Optional[int] = 1024
    height: Optional[int] = 576
    seed: Optional[int] = None

class GenerateMusicRequest(BaseModel):
    prompt: str
    genre: Optional[str] = "cinematic"
    duration: Optional[int] = 15
    hf_token: Optional[str] = None

@router.post("/generate-image")
def generate_image_endpoint(req: GenerateImageRequest):
    """
    Generates concept art using free image synthesis with local caching.
    """
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    
    result = media_service.generate_image(
        prompt=req.prompt,
        width=req.width or 1024,
        height=req.height or 576,
        seed=req.seed
    )
    return result

@router.get("/image/{filename}")
def get_image_file(filename: str):
    """
    Serves a cached generated image or procedural artwork.
    """
    clean_name = os.path.basename(filename)
    if not clean_name.endswith((".jpg", ".png", ".svg", ".webp")):
        clean_name += ".jpg"

    file_path = os.path.join(IMAGES_DIR, clean_name)
    if not os.path.exists(file_path):
        base_no_ext = os.path.splitext(clean_name)[0]
        svg_alt = os.path.join(IMAGES_DIR, f"{base_no_ext}.svg")
        if os.path.exists(svg_alt):
            return FileResponse(svg_alt, media_type="image/svg+xml")
        raise HTTPException(status_code=404, detail="Image not found")

    media_type = "image/svg+xml" if clean_name.endswith(".svg") else "image/jpeg"
    return FileResponse(file_path, media_type=media_type)

@router.post("/generate-music")
def generate_music_endpoint(req: GenerateMusicRequest):
    """
    Generates a full audio soundtrack track using Meta MusicGen pipeline.
    """
    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Music prompt cannot be empty")

    result = music_service.generate_music_track(
        prompt=req.prompt,
        duration=req.duration or 15,
        genre=req.genre or "cinematic",
        hf_token=req.hf_token
    )
    return result

@router.get("/audio/{filename}")
def get_audio_file(filename: str):
    """
    Streams a generated .wav or .mp3 audio track.
    """
    clean_name = os.path.basename(filename)
    if not clean_name.endswith((".wav", ".mp3")):
        clean_name += ".wav"

    file_path = os.path.join(AUDIO_DIR, clean_name)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio track not found")

    media_type = "audio/mpeg" if clean_name.endswith(".mp3") else "audio/wav"
    return FileResponse(file_path, media_type=media_type)
