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
  Activity,
  Sliders,
  FileText,
  Loader2,
  FileDown
} from 'lucide-react';
import { ProjectData } from '../../types';
import { api } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import { ConceptArtGallery } from './ConceptArtGallery';
import { StudioAudioPlayer } from './StudioAudioPlayer';
import { ExportModal } from './ExportModal';
import { printProjectDossier } from '../../services/clientExport';

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
  const { isDark } = useTheme();
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

  // Export states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isQuickExportingPdf, setIsQuickExportingPdf] = useState(false);

  const handleQuickDownloadPdf = async () => {
    setIsQuickExportingPdf(true);
    try {
      const safeTitle = (project.title || 'project').replace(/[^a-zA-Z0-9_-]/g, '_');
      await api.exportProject(project.id, 'pdf', `${safeTitle}_dossier.pdf`);
    } catch (err) {
      console.warn('API PDF export failed, using instant browser print engine:', err);
      printProjectDossier(project);
    } finally {
      setIsQuickExportingPdf(false);
    }
  };

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

  const cardBg = isDark ? 'bg-[#0F1626]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-800' : 'border-slate-200 shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-slate-700';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const quoteBg = isDark ? 'bg-slate-950 font-mono text-slate-300 border-slate-900' : 'bg-slate-50 font-mono text-slate-800 border-slate-200';

  return (
    <div className="space-y-6 pb-20">
      {/* Top Project Header Card */}
      <div className={`p-6 md:p-8 rounded-3xl border shadow-xl relative ${cardBg} ${isDark ? 'border-purple-500/20' : 'border-purple-200 shadow-purple-100/50'}`}>
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-purple-600/5' : 'bg-purple-200/20'}`} />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-purple-100 text-purple-700 border border-purple-200'}`}>
                <TypeIcon className="w-3.5 h-3.5" />
                {project.project_type.toUpperCase()}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                {project.genre}
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                Tone: {project.tone}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  project.status === 'completed'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : project.status === 'generating'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                    : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
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
                    className={`px-3 py-1.5 rounded-lg border font-bold text-2xl focus:outline-none ${isDark ? 'bg-slate-900 border-purple-500 text-white' : 'bg-white border-purple-500 text-slate-900'}`}
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
                  <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${textPrimary}`}>
                    {project.title}
                  </h1>
                  <button
                    onClick={() => {
                      setTitleInput(project.title);
                      setIsEditingTitle(true);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                    title="Edit Title"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <p className={`text-xs sm:text-sm mt-2 max-w-2xl line-clamp-2 ${textMuted}`}>
              <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Prompt:</span> {project.idea}
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Live Activity */}
            <button
              onClick={() => onSelectTab('activity')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isDark ? 'text-slate-300 bg-slate-900 hover:bg-slate-800 border-slate-700/80' : 'text-slate-700 bg-slate-50 hover:bg-slate-100 border-slate-300'
              }`}
            >
              <Activity className="w-4 h-4 text-purple-500" />
              <span>Live Activity</span>
            </button>

            {/* Human in the loop revision */}
            <button
              onClick={() => setIsRegeneratingModalOpen(true)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isDark ? 'text-purple-300 bg-purple-500/15 hover:bg-purple-500/25 border-purple-500/40' : 'text-purple-700 bg-purple-100 hover:bg-purple-200 border-purple-300'
              }`}
            >
              <RefreshCw className="w-4 h-4 text-purple-500" />
              <span>Regenerate Section</span>
            </button>

            {/* Export Toolbar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/30 transition-all active:scale-95"
                title="Open Export Package Modal"
              >
                <Download className="w-4 h-4" />
                <span>Export Project</span>
              </button>

              <button
                onClick={handleQuickDownloadPdf}
                disabled={isQuickExportingPdf}
                title="Instant 1-Click PDF Download"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                  isDark
                    ? 'border-purple-500/30 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20'
                    : 'border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100'
                }`}
              >
                {isQuickExportingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                ) : (
                  <FileDown className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">Quick PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar if generating */}
        {project.status === 'generating' && (
          <div className={`mt-6 pt-4 border-t ${isDark ? 'border-slate-800/80' : 'border-slate-200'}`}>
            <div className={`flex items-center justify-between text-xs mb-2 ${textMuted}`}>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Current Agent: <strong className="text-purple-400">{project.current_agent || 'Crew Orchestrator'}</strong></span>
              </span>
              <span>{project.progress}%</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-900' : 'bg-slate-200'}`}>
              <div
                className="h-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-500 transition-all duration-500 rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Department Tabs Bar */}
      <div className={`flex items-center space-x-2 overflow-x-auto pb-1 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
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
                ? isDark
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'bg-purple-100 text-purple-700 border border-purple-300 font-bold shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
              <div className={`p-6 rounded-2xl border shadow-lg ${
                isDark ? 'bg-gradient-to-br from-[#131B2E] to-[#0F1626] border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-white border-purple-200'
              }`}>
                <div className="text-xs font-bold uppercase tracking-wider text-purple-500 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Official Project Logline
                </div>
                <blockquote className={`text-lg md:text-xl font-medium italic leading-relaxed ${textPrimary}`}>
                  "{project.story.logline}"
                </blockquote>
              </div>

              {/* Synopsis & 3-Act Structure */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border space-y-3 ${cardBg} ${cardBorder}`}>
                  <h3 className={`font-bold text-base flex items-center gap-2 ${textPrimary}`}>
                    <Feather className="w-4 h-4 text-purple-500" />
                    Narrative Synopsis
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line ${textSecondary}`}>
                    {project.story.synopsis}
                  </p>
                </div>

                <div className={`p-6 rounded-2xl border space-y-3 ${cardBg} ${cardBorder}`}>
                  <h3 className={`font-bold text-base flex items-center gap-2 ${textPrimary}`}>
                    <Clock className="w-4 h-4 text-indigo-500" />
                    Three-Act Structure
                  </h3>
                  <div className={`text-xs sm:text-sm leading-relaxed whitespace-pre-line p-4 rounded-xl border ${quoteBg}`}>
                    {project.story.three_act_structure}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className={`p-12 text-center ${textMuted}`}>Story overview is generating...</div>
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
                <div className={`p-6 rounded-2xl border space-y-2.5 ${cardBg} ${cardBorder}`}>
                  <h3 className={`text-sm font-bold flex items-center gap-2 ${textPrimary}`}>
                    <Brain className="w-4 h-4 text-blue-500" />
                    World Setting & Environment
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${textSecondary}`}>
                    {project.research.world_building}
                  </p>
                </div>

                <div className={`p-6 rounded-2xl border space-y-2.5 ${cardBg} ${cardBorder}`}>
                  <h3 className={`text-sm font-bold flex items-center gap-2 ${textPrimary}`}>
                    <Sliders className="w-4 h-4 text-cyan-500" />
                    Governing Laws & Lore
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${textSecondary}`}>
                    {project.research.lore_and_rules}
                  </p>
                </div>
              </div>

              {/* Characters Section */}
              <div className="space-y-4">
                <h3 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${textPrimary}`}>
                  <span>Dramatis Personae & Characters</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                    {project.research.characters.length} Roles
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {project.research.characters.map((char, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${cardBg} ${cardBorder}`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-purple-500">
                            {char.role}
                          </span>
                          {char.archetype && (
                            <span className={`text-[11px] px-2 py-0.5 rounded-md ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                              {char.archetype}
                            </span>
                          )}
                        </div>

                        <h4 className={`text-lg font-bold ${textPrimary}`}>{char.name}</h4>

                        <div className={`mt-3 space-y-2 text-xs ${textSecondary}`}>
                          <div>
                            <span className={`${textMuted} font-semibold`}>Appearance:</span> {char.appearance}
                          </div>
                          <div>
                            <span className={`${textMuted} font-semibold`}>Personality:</span> {char.personality}
                          </div>
                          <div>
                            <span className={`${textMuted} font-semibold`}>Background:</span> {char.background}
                          </div>
                          <div>
                            <span className={`${textMuted} font-semibold`}>Core Desire:</span> {char.motivation}
                          </div>
                          {char.character_arc && (
                            <div className={`pt-2 border-t text-[11px] text-purple-500 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                              <span className={`${textMuted} font-semibold`}>Arc:</span> {char.character_arc}
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
            <div className={`p-12 text-center ${textMuted}`}>World-building research is generating...</div>
          )}
        </div>
      )}

      {/* 3. SCREENPLAY & SCENE BREAKDOWN */}
      {activeDepartment === 'story' && (
        <div className="space-y-6">
          {project.story ? (
            <>
              {/* Screenplay Excerpt Treatment */}
              <div className={`p-6 rounded-2xl border space-y-3 ${cardBg} ${cardBorder}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-base flex items-center gap-2 ${textPrimary}`}>
                    <FileText className="w-4 h-4 text-purple-500" />
                    Screenplay Treatment & Dialogue Excerpt
                  </h3>
                  <button
                    onClick={() => handleCopy(project.story!.full_script_or_treatment, 'screenplay')}
                    className="flex items-center gap-1.5 text-xs text-purple-500 hover:text-purple-400 font-semibold"
                  >
                    {copiedPromptId === 'screenplay' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPromptId === 'screenplay' ? 'Copied' : 'Copy Excerpt'}</span>
                  </button>
                </div>
                <div className={`p-4 rounded-xl text-xs leading-relaxed whitespace-pre-wrap border max-h-64 overflow-y-auto ${quoteBg}`}>
                  {project.story.full_script_or_treatment}
                </div>
              </div>

              {/* Scene Breakdown Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-bold tracking-tight ${textPrimary}`}>
                    Chronological Scene Breakdown ({project.story.scenes.length} Scenes)
                  </h3>
                  <span className={`text-xs ${textMuted}`}>Click edit to revise any scene</span>
                </div>

                <div className="space-y-4">
                  {project.story.scenes.map((scene, idx) => (
                    <div
                      key={idx}
                      className={`p-6 rounded-2xl border transition-all space-y-3 ${cardBg} ${cardBorder}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                            isDark ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'bg-purple-100 text-purple-700 border border-purple-200'
                          }`}>
                            {scene.scene_number}
                          </span>
                          <div>
                            <h4 className={`font-bold text-base ${textPrimary}`}>{scene.title}</h4>
                            <p className={`text-xs ${textMuted}`}>
                              {scene.location} &bull; <span className="text-purple-500">{scene.time}</span>
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
                            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
                            title="Edit Scene"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {editingSceneIdx === idx ? (
                        <div className="space-y-3 pt-2">
                          <div>
                            <label className={`text-xs font-semibold block mb-1 ${textMuted}`}>Dramatic Action</label>
                            <textarea
                              rows={3}
                              value={editedAction}
                              onChange={(e) => setEditedAction(e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border text-xs ${isDark ? 'bg-slate-900 border-purple-500 text-white' : 'bg-white border-purple-500 text-slate-900'}`}
                            />
                          </div>
                          <div>
                            <label className={`text-xs font-semibold block mb-1 ${textMuted}`}>Key Dialogue</label>
                            <textarea
                              rows={2}
                              value={editedDialogue}
                              onChange={(e) => setEditedDialogue(e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg border text-xs font-mono ${isDark ? 'bg-slate-900 border-purple-500 text-white' : 'bg-white border-purple-500 text-slate-900'}`}
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className={`text-xs sm:text-sm leading-relaxed ${textSecondary}`}>
                            {scene.action}
                          </p>

                          {scene.dialogue && (
                            <div className={`p-3 rounded-xl border font-mono text-xs ${isDark ? 'bg-slate-950/80 border-slate-900 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-800'}`}>
                              <span className={`block text-[10px] uppercase font-bold mb-1 ${textMuted}`}>Dialogue Beat</span>
                              {scene.dialogue}
                            </div>
                          )}

                          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] border-t ${isDark ? 'border-slate-800/60 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                            {scene.visual_cues && (
                              <div>
                                <span className={`font-semibold ${textMuted}`}>Visual Cue:</span> {scene.visual_cues}
                              </div>
                            )}
                            {scene.audio_cues && (
                              <div>
                                <span className={`font-semibold ${textMuted}`}>Audio Cue:</span> {scene.audio_cues}
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
            <div className={`p-12 text-center ${textMuted}`}>Screenplay is generating...</div>
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
                <div className={`p-6 rounded-2xl border space-y-2 md:col-span-2 ${cardBg} ${cardBorder}`}>
                  <h3 className={`text-sm font-bold flex items-center gap-2 ${textPrimary}`}>
                    <Palette className="w-4 h-4 text-amber-500" />
                    Art Direction & Visual Philosophy
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${textSecondary}`}>
                    {project.visuals.art_direction}
                  </p>
                </div>

                <div className={`p-6 rounded-2xl border space-y-3 ${cardBg} ${cardBorder}`}>
                  <h3 className={`text-sm font-bold ${textPrimary}`}>Production Palette</h3>
                  <div className="space-y-2">
                    {project.visuals.color_palette.map((c, i) => {
                      const hexMatch = c.match(/#[0-9a-fA-F]{6}/);
                      const hex = hexMatch ? hexMatch[0] : '#7E22CE';
                      return (
                        <div
                          key={i}
                          onClick={() => handleCopy(hex, hex, 'color')}
                          className={`flex items-center justify-between p-2 rounded-xl border hover:border-purple-500/50 cursor-pointer transition-all ${
                            isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-5 h-5 rounded-md border border-white/20 shadow-sm"
                              style={{ backgroundColor: hex }}
                            />
                            <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{c}</span>
                          </div>
                          <span className="text-[10px] text-purple-500 font-bold">
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
                <div className={`p-5 rounded-2xl border ${cardBg} ${cardBorder}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${textMuted}`}>
                    Lighting Style
                  </span>
                  <p className={`text-xs sm:text-sm ${textPrimary}`}>{project.visuals.lighting_style}</p>
                </div>
                <div className={`p-5 rounded-2xl border ${cardBg} ${cardBorder}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${textMuted}`}>
                    Cinematography & Framing
                  </span>
                  <p className={`text-xs sm:text-sm ${textPrimary}`}>{project.visuals.cinematography_notes}</p>
                </div>
              </div>

              {/* Generative AI Image Prompts & Renders Gallery */}
              <ConceptArtGallery
                prompts={project.visuals.prompts}
                onUpdatePrompts={(updated) => {
                  if (project.visuals) {
                    onUpdateProject({
                      ...project,
                      visuals: {
                        ...project.visuals,
                        prompts: updated,
                      },
                    });
                  }
                }}
              />
            </>
          ) : (
            <div className={`p-12 text-center ${textMuted}`}>Visual direction is generating...</div>
          )}
        </div>
      )}

      {/* 5. AUDIO & SOUND ATMOSPHERE */}
      {activeDepartment === 'audio' && (
        <div className="space-y-6">
          {project.audio ? (
            <>
              {/* Interactive Audio Engine & Soundboard */}
              <StudioAudioPlayer
                projectTitle={project.title}
                genre={project.genre}
                tone={project.tone}
                projectType={project.project_type}
                scoreDirection={project.audio.music_score_direction}
                tempoAndInstruments={project.audio.tempo_and_instruments}
                tracks={project.audio.soundtrack_tracks}
                soundEffects={project.audio.sound_effects}
              />

              {/* Music Score Direction */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border space-y-2 ${cardBg} ${cardBorder}`}>
                  <h3 className={`text-sm font-bold flex items-center gap-2 ${textPrimary}`}>
                    <Headphones className="w-4 h-4 text-emerald-500" />
                    Soundtrack Direction & Philosophy
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${textSecondary}`}>
                    {project.audio.music_score_direction}
                  </p>
                </div>

                <div className={`p-6 rounded-2xl border space-y-2 ${cardBg} ${cardBorder}`}>
                  <h3 className={`text-sm font-bold flex items-center gap-2 ${textPrimary}`}>
                    <Sliders className="w-4 h-4 text-teal-500" />
                    Tempo & Instrumentation
                  </h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${textSecondary}`}>
                    {project.audio.tempo_and_instruments}
                  </p>
                </div>
              </div>

              {/* Soundtrack Tracks & Voice Casting */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border space-y-3 ${cardBg} ${cardBorder}`}>
                  <h3 className={`text-sm font-bold ${textPrimary}`}>Thematic Soundtrack Tracks</h3>
                  <div className="space-y-2">
                    {project.audio.soundtrack_tracks.map((t, idx) => (
                      <div key={idx} className={`p-2.5 rounded-xl border text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border space-y-2 ${cardBg} ${cardBorder}`}>
                  <h3 className={`text-sm font-bold ${textPrimary}`}>Voice Casting & Delivery Direction</h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${textSecondary}`}>
                    {project.audio.voice_casting_notes}
                  </p>
                </div>
              </div>

              {/* Sound Effects Catalog */}
              <div className="space-y-4">
                <h3 className={`text-lg font-bold tracking-tight ${textPrimary}`}>
                  Sound Effects (SFX) & Foley Cues ({project.audio.sound_effects.length})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.audio.sound_effects.map((sfx, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border space-y-2 ${cardBg} ${cardBorder}`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-bold text-sm ${textPrimary}`}>{sfx.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-md ${isDark ? 'bg-slate-800 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                          {sfx.category}
                        </span>
                      </div>
                      <span className={`text-[11px] font-semibold block ${textMuted}`}>{sfx.scene_ref}</span>
                      <p className={`text-xs leading-relaxed ${textSecondary}`}>{sfx.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className={`p-12 text-center ${textMuted}`}>Audio design is generating...</div>
          )}
        </div>
      )}

      {/* 6. CRITIC AUDIT & QUALITY REVIEW */}
      {activeDepartment === 'critic' && (
        <div className="space-y-6">
          {project.critic ? (
            <>
              {/* Score & Verdict Banner */}
              <div className={`p-6 md:p-8 rounded-3xl border shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 ${
                isDark ? 'bg-gradient-to-br from-[#131B2E] via-[#0F1626] to-[#0A0E1A] border-purple-500/30' : 'bg-gradient-to-br from-purple-50 to-white border-purple-200'
              }`}>
                <div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                    isDark ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-purple-100 text-purple-700 border border-purple-200'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Critic Continuity Audit
                  </div>
                  <h3 className={`text-xl md:text-2xl font-extrabold ${textPrimary}`}>
                    {project.critic.verdict}
                  </h3>
                  <p className={`text-xs sm:text-sm mt-1 ${textMuted}`}>
                    Continuity Status: <strong className="text-purple-500">{project.critic.continuity_status}</strong>
                  </p>
                </div>

                <div className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center min-w-[140px] ${
                  isDark ? 'bg-purple-600/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'
                }`}>
                  <span className="text-4xl font-black bg-gradient-to-r from-purple-500 to-fuchsia-400 bg-clip-text text-transparent">
                    {project.critic.score}
                  </span>
                  <span className={`text-xs uppercase tracking-wider font-bold mt-1 ${textMuted}`}>
                    Quality Index / 100
                  </span>
                </div>
              </div>

              {/* Strengths & Inconsistencies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className={`p-6 rounded-2xl border space-y-3 ${cardBg} ${cardBorder}`}>
                  <h4 className="text-sm font-bold text-emerald-500 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Standout Creative Strengths
                  </h4>
                  <ul className={`space-y-2.5 text-xs sm:text-sm ${textSecondary}`}>
                    {project.critic.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold mt-0.5">&bull;</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Inconsistencies */}
                <div className={`p-6 rounded-2xl border space-y-3 ${cardBg} ${cardBorder}`}>
                  <h4 className="text-sm font-bold text-amber-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Flagged Continuity Nuances
                  </h4>
                  <ul className={`space-y-2.5 text-xs sm:text-sm ${textSecondary}`}>
                    {project.critic.inconsistencies.map((inc, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">&bull;</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className={`p-6 rounded-2xl border space-y-3 ${cardBg} ${cardBorder}`}>
                <h4 className="text-sm font-bold text-purple-500 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Actionable Editorial Revisions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {project.critic.suggestions_for_improvement.map((sug, idx) => (
                    <div key={idx} className={`p-3.5 rounded-xl border text-xs leading-relaxed ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                      <span className="font-bold text-purple-500 block mb-1">Recommendation #{idx + 1}</span>
                      {sug}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className={`p-12 text-center ${textMuted}`}>Critic audit is generating...</div>
          )}
        </div>
      )}

      {/* HUMAN IN THE LOOP: REGENERATE SECTION MODAL */}
      {isRegeneratingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className={`w-full max-w-lg border rounded-2xl p-6 space-y-5 shadow-2xl ${cardBg} ${isDark ? 'border-purple-500/30' : 'border-purple-200'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-bold flex items-center gap-2 ${textPrimary}`}>
                <RefreshCw className="w-5 h-5 text-purple-500" />
                Regenerate Department Section
              </h3>
              <button
                onClick={() => setIsRegeneratingModalOpen(false)}
                className={`${textMuted} hover:${textPrimary}`}
              >
                ✕
              </button>
            </div>

            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider block mb-2 ${textMuted}`}>
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
                        ? 'bg-purple-600/20 border-purple-500 text-purple-500 font-bold'
                        : isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider block mb-1.5 ${textMuted}`}>
                Creative Revision Directives (Feedback)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. 'Make the ending more bittersweet', 'Emphasize neon noir visuals', 'Add a haunting violin motif'..."
                value={regenInstructions}
                onChange={(e) => setRegenInstructions(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-purple-500 resize-none ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <button
                type="button"
                onClick={() => setIsRegeneratingModalOpen(false)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
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

      {/* Export Package Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={project}
      />
    </div>
  );
};
