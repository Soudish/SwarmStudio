from typing import Optional, Dict, Any
from app.models.schemas import AudioOutput, SoundEffect
from app.agents.base import get_crewai_llm

def create_audio_agent(llm=None):
    from crewai import Agent
    return Agent(
        role="Sound Designer & Music Supervisor",
        goal="Develop musical themes, instrumentation, scene-by-scene SFX soundscapes, and voice casting guidelines.",
        backstory="""You are an esteemed acoustic designer and soundtrack supervisor for blockbuster films, 
AAA titles, and top-charting narrative podcasts. You sculpt emotional resonance using dynamic frequency ranges, 
tactile Foley, ambient textures, and leitmotifs.""",
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

def build_audio_prompt(story_summary: str, scenes_summary: str, project_type: str, tone: str) -> str:
    return f"""
Construct the complete acoustic world and soundscape architecture for this {project_type.upper()} project:
Tone: {tone}
Story & World Context:
{story_summary}

Scenes Overview:
{scenes_summary}

Please produce a detailed JSON-compatible response containing:
1. "music_score_direction": Holistic musical philosophy, leitmotifs, dynamic range.
2. "tempo_and_instruments": Primary instruments, synthesizers, orchestral sections, and BPM pacing.
3. "soundtrack_tracks": A list of 4-5 thematic score track concepts with evocative titles.
4. "sound_effects": A list of 5-8 distinct SFX cues, each having:
   - "name": Name of sound effect (e.g. "Hydraulic Valve Depressurization")
   - "scene_ref": Which scene it belongs to
   - "description": Acoustic characteristics, reverberation, layer combination
   - "category": "Ambient", "Foley", "Action", or "Musical Stinger"
5. "voice_casting_notes": Vocal timbre, accents, cadence, and delivery advice for the actors.

Format your response as valid JSON with these keys.
"""
