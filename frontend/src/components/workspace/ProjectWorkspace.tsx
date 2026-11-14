import React, { useState } from 'react';
import {
  Film,
  Gamepad2,
  Mic,
  Brain,
  Feather,
  Palette,
  Headphones,
  CheckCircle2,
  Download,
  RefreshCw,
  Copy,
  Check,
  Edit3,
  Save,
  Clock,
  Sparkles,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Activity,
  Sliders,
  FileText
} from 'lucide-react';
import { ProjectData } from '../../types';
import { api } from '../../services/api';

interface ProjectWorkspaceProps {
  project: ProjectData;
  onUpdateProject: (updated: ProjectData) => void;
  onSelectTab: (tab: string) => void;
  onRefreshProject: () => void;
}

export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  project,
  onUpdateProject,
  onSelectTab,
  onRefreshProject,
}) => {
  const [activeDepartment, setActiveDepartment] = useState<
    'overview' | 'research' | 'story' | 'visuals' | 'audio' | 'critic'
  >('overview');

  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project.title);

  // Regeneration modal state
  const [isRegeneratingModalOpen, setIsRegeneratingModalOpen] = useState(false);
  const [regenSection, setRegenSection] = useState<'research' | 'story' | 'visuals' | 'audio' | 'critic'>('story');
  const [regenInstructions, setRegenInstructions] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Inline scene editing
  const [editingSceneIdx, setEditingSceneIdx] = useState<number | null>(null);
  const [editedAction, setEditedAction] = useState('');
  const [editedDialogue, setEditedDialogue] = useState('');

  const handleCopy = (text: string, id: string, type: 'prompt' | 'color' = 'prompt') => {
    navigator.clipboard.writeText(text);
    if (type === 'prompt') {
      setCopiedPromptId(id);
      setTimeout(() => setCopiedPromptId(null), 2000);
    } else {
      setCopiedColor(id);
      setTimeout(() => setCopiedColor(null), 2000);
    }
  };

  const handleSaveTitle = async () => {
    if (!titleInput.trim()) return;
    try {
      const updated = await api.updateProject(project.id, { title: titleInput.trim() });
      onUpdateProject(updated);
      setIsEditingTitle(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerRegeneration = async () => {
    try {
      setIsRegenerating(true);
      await api.regenerateSection(project.id, regenSection, regenInstructions);
      setIsRegeneratingModalOpen(false);
      setRegenInstructions('');
      onRefreshProject();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSaveSceneEdit = async (sceneIdx: number) => {
    if (!project.story) return;
    const updatedScenes = [...project.story.scenes];
    updatedScenes[sceneIdx] = {
      ...updatedScenes[sceneIdx],
      action: editedAction,
      dialogue: editedDialogue
    };
    try {
      const updated = await api.updateProject(project.id, {
        story: {
          ...project.story,
          scenes: updatedScenes
        }
      });
      onUpdateProject(updated);
      setEditingSceneIdx(null);
    } catch (e) {
      console.error(e);
    }
  };

  const TypeIcon = project.project_type === 'film' ? Film : project.project_type === 'game' ? Gamepad2 : Mic;

  return (
    <div className="space-y-6 pb-20">
      {/* Top Project Header Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0F1626] border border-purple-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <TypeIcon className="w-3.5 h-3.5" />
                {project.project_type.toUpperCase()}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                {project.genre}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                Tone: {project.tone}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  project.status === 'completed'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : project.status === 'generating'
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {project.status === 'completed' ? '✓ Ready & Approved' : `Swarm Active (${project.progress}%)`}
              </span>
            </div>

            {/* Editable Title */}
            <div className="flex items-center gap-3">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-purple-500 text-white font-bold text-2xl focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {project.title}
                  </h1>
                  <button
                    onClick={() => {
                      setTitleInput(project.title);
                      setIsEditingTitle(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Title"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl line-clamp-2">
              <span className="font-semibold text-slate-300">Prompt:</span> {project.idea}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Live Activity */}
            <button
              onClick={() => onSelectTab('activity')}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all"
            >
              <Activity className="w-4 h-4 text-purple-400" />
              <span>Live Activity</span>
            </button>

            {/* Human in the loop revision */}
            <button
              onClick={() => setIsRegeneratingModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/40 transition-all"
            >
              <RefreshCw className="w-4 h-4 text-purple-400" />
              <span>Regenerate Section</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/30 transition-all">
                <Download className="w-4 h-4" />
                <span>Export Project</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1 hidden group-hover:block z-50">
                <a
                  href={api.getExportUrl(project.id, 'markdown')}
                  download
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>Download Markdown (.md)</span>
                </a>
                <a
                  href={api.getExportUrl(project.id, 'pdf')}
                  download
                  className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>Download Clean PDF</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar if generating */}
        {project.status === 'generating' && (
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Current Agent: <strong className="text-purple-300">{project.current_agent || 'Crew Orchestrator'}</strong></span>
              </span>
              <span>{project.progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-500 transition-all duration-500 rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Department Tabs Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-b border-slate-800">
        {[
          { id: 'overview', label: 'Concept & Overview', icon: Sparkles },
          { id: 'research', label: 'World Lore & Characters', icon: Brain },
          { id: 'story', label: 'Screenplay & Scenes', icon: Feather },
          { id: 'visuals', label: 'Visual Art Direction', icon: Palette },
          { id: 'audio', label: 'Audio & Sound Atmosphere', icon: Headphones },
          { id: 'critic', label: 'Critic Audit & Review', icon: CheckCircle2 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveDepartment(id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeDepartment === id
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* DEPARTMENT CONTENT PANELS */}

      {/* 1. OVERVIEW & LOGLINE */}
      {activeDepartment === 'overview' && (
        <div className="space-y-6">
          {project.story ? (
            <>
              {/* Logline Hero Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#131B2E] to-[#0F1626] border border-purple-500/30 shadow-lg">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Official Project Logline
                </div>
                <blockquote className="text-lg md:text-xl font-medium text-white italic leading-relaxed">
                  "{project.story.logline}"
                </blockquote>
              </div>

              {/* Synopsis & 3-Act Structure */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-3">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Feather className="w-4 h-4 text-purple-400" />
                    Narrative Synopsis
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {project.story.synopsis}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-3">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    Three-Act Structure
                  </h3>
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed font-mono whitespace-pre-line bg-slate-950/60 p-4 rounded-xl border border-slate-900">
                    {project.story.three_act_structure}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">Story overview is generating...</div>
          )}
        </div>
      )}

      {/* 2. RESEARCH & CHARACTERS */}
      {activeDepartment === 'research' && (
        <div className="space-y-6">
          {project.research ? (
            <>
              {/* World Building & Lore Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-2.5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Brain className="w-4 h-4 text-blue-400" />
                    World Setting & Environment
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.research.world_building}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-2.5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Governing Laws & Lore
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.research.lore_and_rules}
                  </p>
                </div>
              </div>

              {/* Characters Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Dramatis Personae & Characters</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                    {project.research.characters.length} Roles
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {project.research.characters.map((char, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[#0F1626] border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                            {char.role}
                          </span>
                          {char.archetype && (
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                              {char.archetype}
                            </span>
                          )}
                        </div>

                        <h4 className="text-lg font-bold text-white">{char.name}</h4>

                        <div className="mt-3 space-y-2 text-xs text-slate-300">
                          <div>
                            <span className="text-slate-500 font-semibold">Appearance:</span> {char.appearance}
                          </div>
                          <div>
                            <span className="text-slate-500 font-semibold">Personality:</span> {char.personality}
                          </div>
                          <div>
                            <span className="text-slate-500 font-semibold">Background:</span> {char.background}
                          </div>
                          <div>
                            <span className="text-slate-500 font-semibold">Core Desire:</span> {char.motivation}
                          </div>
                          {char.character_arc && (
                            <div className="pt-2 border-t border-slate-800 text-[11px] text-purple-300">
                              <span className="text-slate-500 font-semibold">Arc:</span> {char.character_arc}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">World-building research is generating...</div>
          )}
        </div>
      )}

      {/* 3. SCREENPLAY & SCENE BREAKDOWN */}
      {activeDepartment === 'story' && (
        <div className="space-y-6">
          {project.story ? (
            <>
              {/* Screenplay Excerpt Treatment */}
              <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    Screenplay Treatment & Dialogue Excerpt
                  </h3>
                  <button
                    onClick={() => handleCopy(project.story!.full_script_or_treatment, 'screenplay')}
                    className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300"
                  >
                    {copiedPromptId === 'screenplay' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPromptId === 'screenplay' ? 'Copied' : 'Copy Excerpt'}</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap border border-slate-900 max-h-64 overflow-y-auto">
                  {project.story.full_script_or_treatment}
                </div>
              </div>

              {/* Scene Breakdown Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Chronological Scene Breakdown ({project.story.scenes.length} Scenes)
                  </h3>
                  <span className="text-xs text-slate-500">Click edit to revise any scene</span>
                </div>

                <div className="space-y-4">
                  {project.story.scenes.map((scene, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 hover:border-purple-500/30 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center font-bold text-sm">
                            {scene.scene_number}
                          </span>
                          <div>
                            <h4 className="font-bold text-white text-base">{scene.title}</h4>
                            <p className="text-xs text-slate-400">
                              {scene.location} &bull; <span className="text-purple-300">{scene.time}</span>
                            </p>
                          </div>
                        </div>

                        {editingSceneIdx === idx ? (
                          <button
                            onClick={() => handleSaveSceneEdit(idx)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Scene</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingSceneIdx(idx);
                              setEditedAction(scene.action);
                              setEditedDialogue(scene.dialogue || '');
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            title="Edit Scene"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {editingSceneIdx === idx ? (
                        <div className="space-y-3 pt-2">
                          <div>
                            <label className="text-xs font-semibold text-slate-400 block mb-1">Dramatic Action</label>
                            <textarea
                              rows={3}
                              value={editedAction}
                              onChange={(e) => setEditedAction(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-purple-500 text-white text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-400 block mb-1">Key Dialogue</label>
                            <textarea
                              rows={2}
                              value={editedDialogue}
                              onChange={(e) => setEditedDialogue(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-purple-500 text-white text-xs font-mono"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {scene.action}
                          </p>

                          {scene.dialogue && (
                            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-900 font-mono text-xs text-purple-200">
                              <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Dialogue Beat</span>
                              {scene.dialogue}
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
                            {scene.visual_cues && (
                              <div>
                                <span className="font-semibold text-slate-500">Visual Cue:</span> {scene.visual_cues}
                              </div>
                            )}
                            {scene.audio_cues && (
                              <div>
                                <span className="font-semibold text-slate-500">Audio Cue:</span> {scene.audio_cues}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">Screenplay is generating...</div>
          )}
        </div>
      )}

      {/* 4. VISUAL ART DIRECTION */}
      {activeDepartment === 'visuals' && (
        <div className="space-y-6">
          {project.visuals ? (
            <>
              {/* Art Direction Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-2 md:col-span-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-400" />
                    Art Direction & Visual Philosophy
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.visuals.art_direction}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white">Production Palette</h3>
                  <div className="space-y-2">
                    {project.visuals.color_palette.map((c, i) => {
                      const hexMatch = c.match(/#[0-9a-fA-F]{6}/);
                      const hex = hexMatch ? hexMatch[0] : '#7E22CE';
                      return (
                        <div
                          key={i}
                          onClick={() => handleCopy(hex, hex, 'color')}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                              style={{ backgroundColor: hex }}
                            />
                            <span className="text-xs font-medium text-slate-300">{c}</span>
                          </div>
                          <span className="text-[10px] text-purple-400">
                            {copiedColor === hex ? 'Copied' : 'Copy'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Lighting & Cinematography */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#0F1626] border border-slate-800">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Lighting Style
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200">{project.visuals.lighting_style}</p>
                </div>
                <div className="p-5 rounded-2xl bg-[#0F1626] border border-slate-800">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Cinematography & Framing
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200">{project.visuals.cinematography_notes}</p>
                </div>
              </div>

              {/* Generative AI Image Prompts */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center justify-between">
                  <span>Production AI Image Prompts (Midjourney / Flux format)</span>
                  <span className="text-xs text-purple-400">{project.visuals.prompts.length} Prompts</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {project.visuals.prompts.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 rounded-2xl bg-[#0F1626] border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-white text-sm">{p.title}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {p.aspect_ratio} &bull; {p.style}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-900 font-mono text-xs text-slate-300 leading-relaxed my-3">
                          {p.prompt}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                        <span className="text-slate-500 text-[11px]">Ready for image synthesis</span>
                        <button
                          onClick={() => handleCopy(p.prompt, p.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-all font-semibold"
                        >
                          {copiedPromptId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedPromptId === p.id ? 'Copied Prompt' : 'Copy Prompt'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">Visual direction is generating...</div>
          )}
        </div>
      )}

      {/* 5. AUDIO & SOUND ATMOSPHERE */}
      {activeDepartment === 'audio' && (
        <div className="space-y-6">
          {project.audio ? (
            <>
              {/* Music Score Direction */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-emerald-400" />
                    Soundtrack Direction & Philosophy
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.audio.music_score_direction}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-teal-400" />
                    Tempo & Instrumentation
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.audio.tempo_and_instruments}
                  </p>
                </div>
              </div>

              {/* Soundtrack Tracks & Voice Casting */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white">Thematic Soundtrack Tracks</h3>
                  <div className="space-y-2">
                    {project.audio.soundtrack_tracks.map((t, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-900 text-xs text-slate-300 border border-slate-800">
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-2">
                  <h3 className="text-sm font-bold text-white">Voice Casting & Delivery Direction</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {project.audio.voice_casting_notes}
                  </p>
                </div>
              </div>

              {/* Sound Effects Catalog */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Sound Effects (SFX) & Foley Cues ({project.audio.sound_effects.length})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.audio.sound_effects.map((sfx, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#0F1626] border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{sfx.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-purple-300">
                          {sfx.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-semibold block">{sfx.scene_ref}</span>
                      <p className="text-xs text-slate-400 leading-relaxed">{sfx.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">Audio design is generating...</div>
          )}
        </div>
      )}

      {/* 6. CRITIC AUDIT & QUALITY REVIEW */}
      {activeDepartment === 'critic' && (
        <div className="space-y-6">
          {project.critic ? (
            <>
              {/* Score & Verdict Banner */}
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#131B2E] via-[#0F1626] to-[#0A0E1A] border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Critic Continuity Audit
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-white">
                    {project.critic.verdict}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Continuity Status: <strong className="text-purple-300">{project.critic.continuity_status}</strong>
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-purple-600/10 border border-purple-500/30 text-center min-w-[140px]">
                  <span className="text-4xl font-black bg-gradient-to-r from-purple-400 to-fuchsia-300 bg-clip-text text-transparent">
                    {project.critic.score}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold mt-1">
                    Quality Index / 100
                  </span>
                </div>
              </div>

              {/* Strengths & Inconsistencies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Standout Creative Strengths
                  </h4>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                    {project.critic.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Inconsistencies */}
                <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-3">
                  <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Flagged Continuity Nuances
                  </h4>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                    {project.critic.inconsistencies.map((inc, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold mt-0.5">&bull;</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="p-6 rounded-2xl bg-[#0F1626] border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Actionable Editorial Revisions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {project.critic.suggestions_for_improvement.map((sug, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="font-bold text-purple-400 block mb-1">Recommendation #{idx + 1}</span>
                      {sug}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">Critic audit is generating...</div>
          )}
        </div>
      )}

      {/* HUMAN IN THE LOOP: REGENERATE SECTION MODAL */}
      {isRegeneratingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0F1626] border border-purple-500/30 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-purple-400" />
                Regenerate Department Section
              </h3>
              <button
                onClick={() => setIsRegeneratingModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Target Department
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { key: 'story', label: 'Screenplay & Scenes' },
                  { key: 'research', label: 'World Lore & Chars' },
                  { key: 'visuals', label: 'Visual Art Direction' },
                  { key: 'audio', label: 'Audio & Music' },
                  { key: 'critic', label: 'Critic Quality Audit' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRegenSection(key as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      regenSection === key
                        ? 'bg-purple-600/20 border-purple-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Creative Revision Directives (Feedback)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. 'Make the ending more bittersweet', 'Emphasize neon noir visuals', 'Add a haunting violin motif'..."
                value={regenInstructions}
                onChange={(e) => setRegenInstructions(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsRegeneratingModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTriggerRegeneration}
                disabled={isRegenerating}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all"
              >
                {isRegenerating ? 'Deploying Agent...' : 'Submit & Regenerate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
