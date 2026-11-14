from typing import Optional, Dict, Any
from app.models.schemas import StoryOutput, Scene
from app.agents.base import get_crewai_llm

def create_story_agent(llm=None):
    from crewai import Agent
    return Agent(
        role="Lead Screenwriter & Narrative Architect",
        goal="Transform premises and world-building research into compelling storylines, dramatic three-act structures, scripts, and scene breakdowns.",
        backstory="""You are an acclaimed creative writer and script doctor with credits across award-winning films, 
cinematic video games, and serialized audio dramas. You craft visceral narrative arcs, authentic character dialogue, 
and emotionally charged beats.""",
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

def build_story_prompt(idea: str, project_type: str, tone: str, genre: str, research_summary: str, instructions: str) -> str:
    return f"""
Craft a complete narrative treatment and script breakdown based on the world research:
Project Type: {project_type.upper()}
Genre: {genre}
Tone: {tone}
Core Premise: {idea}
Research & Characters Context:
{research_summary}

Instructions: {instructions or 'Focus on emotional depth, narrative pacing, and clear stakes.'}

Please produce a detailed JSON-compatible response containing:
1. "logline": A punchy 1-2 sentence hook summarizing protagonist, conflict, and stakes.
2. "synopsis": A comprehensive narrative summary (Act I, II, III).
3. "three_act_structure": Clear breakdown of Setup, Inciting Incident, Midpoint, Climax, and Resolution.
4. "full_script_or_treatment": Screenplay excerpt / script treatment showcasing key dialogues and scene directions.
5. "scenes": A list of 4-6 key chronological scenes, each having:
   - "scene_number": Integer
   - "title": Scene title (e.g. "INT. DERELICT OBSERVATORY - NIGHT")
   - "location": Environment/setting
   - "time": Time of day / atmospheric lighting
   - "action": Narrative action and physical beats
   - "dialogue": Spoken lines or voiceover narration
   - "visual_cues": Specific visual focal points for the camera
   - "audio_cues": Sound effects and musical transitions

Format your response as valid JSON with these keys.
"""
