from typing import Optional, Dict, Any
from app.models.schemas import CriticReview
from app.agents.base import get_crewai_llm

def create_critic_agent(llm=None):
    from crewai import Agent
    return Agent(
        role="Lead Editorial & Narrative Critic",
        goal="Audit storylines, character motivations, visual direction, and audio design for continuity, emotional resonance, and dramatic punch.",
        backstory="""You are a veteran script doctor, studio creative executive, and narrative critic. 
You spot narrative dissonance, logical inconsistencies, and tonal drift instantly, while celebrating standout moments 
and providing concrete, actionable revision directives.""",
        verbose=True,
        allow_delegation=False,
        llm=llm
    )

def build_critic_prompt(project_title: str, idea: str, research_data: str, story_data: str, visual_data: str, audio_data: str) -> str:
    return f"""
Perform an intensive editorial quality and continuity audit of this creative production:
Project Title: {project_title}
Core Premise: {idea}

RESEARCH & CHARACTERS:
{research_data}

STORY & SCENES:
{story_data}

VISUAL DIRECTION:
{visual_data}

AUDIO & SOUND DESIGN:
{audio_data}

Please produce a detailed JSON-compatible response containing:
1. "score": An integer creative quality score between 75 and 98 based on coherence and depth.
2. "continuity_status": Continuity assessment, e.g. "Highly Consistent - Minor Timeline Adjustment Noted".
3. "strengths": A list of 3-5 specific creative triumphs in the project.
4. "inconsistencies": A list of 2-4 subtle inconsistencies, logical gaps, or areas needing alignment across departments.
5. "suggestions_for_improvement": A list of 3-5 high-impact, actionable revisions for the creator.
6. "verdict": Final verdict summary and endorsement.

Format your response as valid JSON with these keys.
"""
