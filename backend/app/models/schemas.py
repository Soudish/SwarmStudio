from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

ProjectType = Literal["film", "game", "podcast"]
AgentRole = Literal["researcher", "storyteller", "visual_director", "audio_designer", "lead_critic"]
AgentStatus = Literal["idle", "waiting", "running", "completed", "error"]
ProjectStatus = Literal["draft", "generating", "completed", "failed"]

class CreateProjectRequest(BaseModel):
    title: Optional[str] = None
    idea: str
    project_type: ProjectType = "film"
    tone: Optional[str] = "Cinematic and Thought-provoking"
    genre: Optional[str] = "Science Fiction"
    target_audience: Optional[str] = "General Audience & Sci-Fi Fans"
    instructions: Optional[str] = ""
    model_override: Optional[str] = None

class AgentActivity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    agent_name: str
    agent_role: str
    status: AgentStatus
    message: str
    details: Optional[str] = ""
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class Character(BaseModel):
    name: str
    role: str
    archetype: Optional[str] = ""
    personality: str
    appearance: str
    background: str
    motivation: str
    character_arc: Optional[str] = ""

class Scene(BaseModel):
    scene_number: int
    title: str
    location: str
    time: str
    action: str
    dialogue: Optional[str] = ""
    visual_cues: Optional[str] = ""
    audio_cues: Optional[str] = ""

class ImagePrompt(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    prompt: str
    negative_prompt: Optional[str] = "blurry, low quality, distorted, extra limbs, watermark"
    aspect_ratio: str = "16:9"
    style: str = "Cinematic Film Still"

class SoundEffect(BaseModel):
    name: str
    scene_ref: str
    description: str
    category: str = "Ambient"  # Ambient, Foley, UI, Action, Musical Stinger

class ResearchOutput(BaseModel):
    world_building: str
    lore_and_rules: str
    technology_and_science: Optional[str] = ""
    cultural_context: Optional[str] = ""
    characters: List[Character] = []

class StoryOutput(BaseModel):
    logline: str
    synopsis: str
    three_act_structure: str
    full_script_or_treatment: str
    scenes: List[Scene] = []

class VisualOutput(BaseModel):
    art_direction: str
    color_palette: List[str] = []
    lighting_style: str
    cinematography_notes: str
    prompts: List[ImagePrompt] = []

class AudioOutput(BaseModel):
    music_score_direction: str
    tempo_and_instruments: str
    soundtrack_tracks: List[str] = []
    sound_effects: List[SoundEffect] = []
    voice_casting_notes: str

class CriticReview(BaseModel):
    score: int = 88  # 0 to 100
    continuity_status: str = "Consistent"
    strengths: List[str] = []
    inconsistencies: List[str] = []
    suggestions_for_improvement: List[str] = []
    verdict: str = "Approved with commendations"

class ProjectData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    idea: str
    project_type: ProjectType
    tone: str
    genre: str
    target_audience: str
    instructions: Optional[str] = ""
    status: ProjectStatus = "draft"
    progress: int = 0  # 0 to 100
    current_agent: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    
    # Generated outputs
    user_id: Optional[str] = None
    research: Optional[ResearchOutput] = None
    story: Optional[StoryOutput] = None
    visuals: Optional[VisualOutput] = None
    audio: Optional[AudioOutput] = None
    critic: Optional[CriticReview] = None
    
    # Execution activities & logs
    activities: List[AgentActivity] = []

class UpdateProjectRequest(BaseModel):
    title: Optional[str] = None
    research: Optional[Dict[str, Any]] = None
    story: Optional[Dict[str, Any]] = None
    visuals: Optional[Dict[str, Any]] = None
    audio: Optional[Dict[str, Any]] = None
    critic: Optional[Dict[str, Any]] = None

class RegenerateSectionRequest(BaseModel):
    section: Literal["research", "story", "visuals", "audio", "critic"]
    instructions: Optional[str] = ""

class SettingsUpdate(BaseModel):
    ollama_base_url: Optional[str] = None
    ollama_model: Optional[str] = None
    supabase_url: Optional[str] = None
    supabase_key: Optional[str] = None
    demo_fallback_enabled: Optional[bool] = None

class UserRegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class UserLoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    avatar_url: Optional[str] = None
    created_at: str
    project_count: int = 0

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

