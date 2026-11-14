from typing import Optional, Dict, Any
from app.models.schemas import ResearchOutput, Character
from app.agents.base import get_crewai_llm

def create_research_agent(llm=None):
    from crewai import Agent
    return Agent(
        role="Senior World-Building & Character Researcher",
        goal="Develop rich world lore, cultural and technological rules, and multi-dimensional character dossiers tailored to the creative project.",
        backstory="""You are a world-renowned creative researcher and narrative architect. 
You specialize in grounding high-concept ideas into rich, authentic worlds with deep historical lore, 
technological/magical boundaries, and deeply psychological character profiles.""",
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

def build_research_prompt(idea: str, project_type: str, tone: str, genre: str, audience: str, instructions: str) -> str:
    return f"""
Analyze the following creative premise and generate comprehensive world-building lore and character dossiers:
Project Type: {project_type.upper()}
Genre: {genre}
Tone: {tone}
Target Audience: {audience}
Core Premise: {idea}
Additional Instructions: {instructions or 'None'}

Please produce a detailed JSON-compatible response containing:
1. "world_building": Rich description of the setting, atmosphere, and societal backdrop (at least 2 substantial paragraphs).
2. "lore_and_rules": The unwritten laws, factions, or governing physics/lore of this universe.
3. "technology_and_science": Technological or fantastical systems that govern this reality.
4. "cultural_context": Social norms, conflicts, and prevailing philosophy.
5. "characters": A list of 3-4 key characters, each having:
   - "name": Full character name
   - "role": e.g., Protagonist, Antagonist, Mentor, Companion
   - "archetype": e.g., The Reluctant Explorer, The Disillusioned Machine, The Rebel Idealist
   - "personality": Key psychological traits
   - "appearance": Distinct visual features and attire
   - "background": History and origins
   - "motivation": Driving inner desire and what is at stake
   - "character_arc": Trajectory of transformation

Format your response as valid JSON with these keys.
"""
