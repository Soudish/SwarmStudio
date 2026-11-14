export type ProjectType = 'film' | 'game' | 'podcast';
export type ProjectStatus = 'draft' | 'generating' | 'completed' | 'failed';
export type AgentStatus = 'idle' | 'waiting' | 'running' | 'completed' | 'error';

export interface Character {
  name: string;
  role: string;
  archetype?: string;
  personality: string;
  appearance: string;
  background: string;
  motivation: string;
  character_arc?: string;
}

export interface Scene {
  scene_number: number;
  title: string;
  location: string;
  time: string;
  action: string;
  dialogue?: string;
  visual_cues?: string;
  audio_cues?: string;
}

export interface ImagePrompt {
  id: string;
  title: string;
  prompt: string;
  negative_prompt?: string;
  aspect_ratio: string;
  style: string;
}

export interface SoundEffect {
  name: string;
  scene_ref: string;
  description: string;
  category: string;
}

export interface ResearchOutput {
  world_building: string;
  lore_and_rules: string;
  technology_and_science?: string;
  cultural_context?: string;
  characters: Character[];
}

export interface StoryOutput {
  logline: string;
  synopsis: string;
  three_act_structure: string;
  full_script_or_treatment: string;
  scenes: Scene[];
}

export interface VisualOutput {
  art_direction: string;
  color_palette: string[];
  lighting_style: string;
  cinematography_notes: string;
  prompts: ImagePrompt[];
}

export interface AudioOutput {
  music_score_direction: string;
  tempo_and_instruments: string;
  soundtrack_tracks: string[];
  sound_effects: SoundEffect[];
  voice_casting_notes: string;
}

export interface CriticReview {
  score: number;
  continuity_status: string;
  strengths: string[];
  inconsistencies: string[];
  suggestions_for_improvement: string[];
  verdict: string;
}

export interface AgentActivity {
  id: string;
  agent_name: string;
  agent_role: string;
  status: AgentStatus;
  message: string;
  details?: string;
  timestamp: string;
}

export interface ProjectData {
  id: string;
  title: string;
  idea: string;
  project_type: ProjectType;
  tone: string;
  genre: string;
  target_audience: string;
  instructions?: string;
  status: ProjectStatus;
  progress: number;
  current_agent?: string;
  created_at: string;
  updated_at: string;
  research?: ResearchOutput;
  story?: StoryOutput;
  visuals?: VisualOutput;
  audio?: AudioOutput;
  critic?: CriticReview;
  activities: AgentActivity[];
}

export interface CreateProjectPayload {
  title?: string;
  idea: string;
  project_type: ProjectType;
  tone?: string;
  genre?: string;
  target_audience?: string;
  instructions?: string;
  model_override?: string;
}

export interface SettingsData {
  ollama_base_url: string;
  ollama_model: string;
  supabase_url: string;
  supabase_configured: boolean;
  storage_mode: string;
  demo_fallback_enabled: boolean;
  ollama_status: {
    online: boolean;
    version?: string;
    base_url: string;
    error?: string;
  };
  available_models: string[];
}
