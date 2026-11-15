import os
import hashlib
import urllib.parse
from typing import Optional

IMAGES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "images")
os.makedirs(IMAGES_DIR, exist_ok=True)

class MediaService:
    @staticmethod
    def clean_image_prompt(prompt: str) -> str:
        """
        Cleans and formats visual prompts for maximum AI image generation quality.
        """
        cleaned = prompt.replace("SCENE", "").replace("Midjourney", "").replace("Flux", "")
        for ratio in ["--ar 16:9", "--ar 9:16", "--ar 1:1", "--v 6", "--v 5"]:
            cleaned = cleaned.replace(ratio, "")
        
        cleaned = " ".join(cleaned.split()).strip()
        if not cleaned:
            cleaned = "cinematic atmospheric concept art, volumetric lighting, photorealistic 8k"
        else:
            cleaned = f"{cleaned}, cinematic composition, 8k resolution, photorealistic, dramatic atmosphere, masterpiece concept art"
        return cleaned

    @staticmethod
    def get_pollinations_url(prompt: str, width: int = 1024, height: int = 576, seed: Optional[int] = None) -> str:
        cleaned = MediaService.clean_image_prompt(prompt)
        encoded_prompt = urllib.parse.quote(cleaned)
        seed_val = seed if seed else (abs(hash(prompt)) % 100000)
        return (
            f"https://image.pollinations.ai/prompt/{encoded_prompt}"
            f"?width={width}&height={height}&nologo=true&seed={seed_val}&model=flux"
        )

    @staticmethod
    def generate_image(prompt: str, width: int = 1024, height: int = 576, seed: Optional[int] = None) -> dict:
        """
        Returns a direct high-resolution AI concept art URL that renders in the user's browser,
        along with cache identifiers.
        """
        cache_key = hashlib.md5(f"{prompt}_{width}_{height}_{seed or 42}".encode("utf-8")).hexdigest()
        direct_url = MediaService.get_pollinations_url(prompt, width, height, seed)

        return {
            "image_id": cache_key,
            "url": direct_url,
            "cached": False,
            "provider": "pollinations_flux"
        }

media_service = MediaService()
