import os
import json
import logging
from typing import Optional, Dict, Any
from app.config import settings

logger = logging.getLogger(__name__)

def get_crewai_llm(model_override: Optional[str] = None):
    """
    Returns configured CrewAI LLM instance pointing to Ollama.
    """
    target_model = model_override or settings.ollama_model
    # Clean up model prefix if provided
    if not target_model.startswith("ollama/"):
        crew_model = f"ollama/{target_model}"
    else:
        crew_model = target_model
        
    base_url = settings.ollama_base_url
    
    try:
        from crewai import LLM
        return LLM(
            model=crew_model,
            base_url=base_url,
            temperature=0.7
        )
    except Exception as e:
        logger.warning(f"Could not initialize CrewAI LLM pointing to {base_url}: {e}")
        return None
