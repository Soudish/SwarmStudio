from typing import Optional, Dict, Any
from app.models.schemas import VisualOutput, ImagePrompt
from app.agents.base import get_crewai_llm

def create_visual_agent(llm=None):
    from crewai import Agent
    return Agent(
        role="Visual Art Director & Concept Artist",
        goal="Establish art direction, color theory, cinematography style, and generate production-ready image generation prompts for key scenes.",
        backstory="""You are an industry-leading visual director and cinematographer. 
You translate literary scenes into striking photographic compositions, choosing precise aspect ratios, lenses, 
lighting ratios, chromatic color palettes, and generative AI prompt syntax.""",
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

def build_visual_prompt(story_summary: str, scenes_summary: str, project_type: str, tone: str) -> str:
    return f"""
Design the complete visual universe and prompt catalog for this {project_type.upper()} project:
Tone: {tone}
Story & World Context:
{story_summary}

Scenes Overview:
{scenes_summary}

Please produce a detailed JSON-compatible response containing:
1. "art_direction": Grand aesthetic vision, photographic medium/rendering style, influences and references.
2. "color_palette": List of 5 hex color codes with evocative names (e.g., ["#0F172A - Deep Abyss", "#8B5CF6 - Neon Violet", ...]).
3. "lighting_style": Lighting setup (e.g. Chiaroscuro, volumetric bioluminescence, harsh rim lighting).
4. "cinematography_notes": Lens choices, camera motion, framing guidelines.
5. "prompts": A list of 4-6 highly detailed text-to-image prompts corresponding to key scenes, each having:
   - "title": Scene / visual beat title
   - "prompt": Ultra-detailed prompt in Midjourney v6/Flux style specifying subject, attire, lighting, lens (e.g. 35mm anamorphic), color grading, 8k resolution, octane render
   - "negative_prompt": Quality exclusions
   - "aspect_ratio": "16:9" or "21:9" or "4:3"
   - "style": e.g., "Cinematic 35mm Film Still" or "Unreal Engine 5 Concept Art"

Format your response as valid JSON with these keys.
"""
