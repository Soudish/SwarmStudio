import urllib.request
import json
import time
from typing import Dict, Any, List
from app.config import settings

class OllamaService:
    def __init__(self, base_url: str = None):
        self.base_url = (base_url or settings.ollama_base_url).rstrip("/")
        self._cached_health: Dict[str, Any] = {}
        self._last_health_check: float = 0.0

    async def check_health(self, force: bool = False) -> Dict[str, Any]:
        """Check if local Ollama daemon is active and responding (cached for 15s)."""
        now = time.time()
        if not force and (now - self._last_health_check < 15.0) and self._cached_health:
            return self._cached_health

        self._last_health_check = now
        try:
            req = urllib.request.Request(f"{self.base_url}/api/version")
            with urllib.request.urlopen(req, timeout=0.3) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode())
                    self._cached_health = {
                        "online": True,
                        "version": data.get("version", "unknown"),
                        "base_url": self.base_url,
                        "error": None
                    }
                    return self._cached_health
        except Exception as e:
            pass

        self._cached_health = {
            "online": False,
            "version": None,
            "base_url": self.base_url,
            "error": f"Ollama daemon unreachable at {self.base_url}"
        }
        return self._cached_health

    async def list_models(self) -> List[str]:
        """List local models available in Ollama."""
        try:
            req = urllib.request.Request(f"{self.base_url}/api/tags")
            with urllib.request.urlopen(req, timeout=0.4) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode())
                    models = [m.get("name") for m in data.get("models", []) if m.get("name")]
                    return models
        except Exception:
            pass
        return []

    async def generate(self, prompt: str, system: str = "", model: str = None) -> str:
        """Call Ollama /api/generate directly with graceful error handling."""
        target_model = model or settings.ollama_model
        payload = json.dumps({
            "model": target_model,
            "prompt": prompt,
            "system": system,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "top_p": 0.9
            }
        }).encode("utf-8")

        try:
            req = urllib.request.Request(
                f"{self.base_url}/api/generate",
                data=payload,
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=60.0) as response:
                if response.status == 200:
                    data = json.loads(response.read().decode())
                    return data.get("response", "")
                else:
                    raise RuntimeError(f"Ollama returned HTTP {response.status}")
        except Exception as e:
            raise RuntimeError(f"Failed to communicate with Ollama ({target_model}): {str(e)}")

ollama_service = OllamaService()
