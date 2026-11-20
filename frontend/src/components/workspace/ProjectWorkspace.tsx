import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FileDown,
  X,
  ArrowRight
} from 'lucide-react';
import { ProjectData } from '../../types';
import { api } from '../../services/api';
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

// Reusable count-up for critic quality score
const CountUpScore: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 850;

    const animate = (time: number) => {
      if (startTime === null) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{count}</span>;
};

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
  const isGenerating = project.status === 'generating';

  // Section placeholder: shimmer skeleton while generating, clean empty state when finished
  const renderSectionPlaceholder = (
    sectionName: string,
    deptKey: 'overview' | 'research' | 'story' | 'visuals' | 'audio' | 'critic'
  ) => {
    if (isGenerating) {
      return (
        <div className="card p-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
            <span className="text-xs font-semibold text-text1">
              Generating {sectionName}...
            </span>
          </div>
          <div className="max-w-md mx-auto space-y-2.5 pt-2">
            <div className="h-4 bg-surface-muted rounded-full w-full animate-pulse" />
            <div className="h-4 bg-surface-muted rounded-full w-4/5 mx-auto animate-pulse" />
            <div className="h-4 bg-surface-muted rounded-full w-3/5 mx-auto animate-pulse" />
          </div>
        </div>
      );
    }

    return (
      <div className="card p-12 text-center border-dashed space-y-3">
        <h3 className="text-sm font-semibold text-text1">Nothing here yet</h3>
        <p className="text-xs text-text3 max-w-sm mx-auto">
          This section has not been generated for this project.
        </p>
        <button
          onClick={() => {
            if (deptKey !== 'overview') setRegenSection(deptKey);
            setIsRegeneratingModalOpen(true);
          }}
          className="btn-primary text-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Regenerate Section</span>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20 max-w-[1100px] mx-auto">
      {/* Top Project Header Card */}
      <div className="card p-6 md:p-8 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Metadata Chips: FORMAT · GENRE only (tone in muted text), status as dot + label */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="pill text-xs font-semibold uppercase tracking-wider">
                <TypeIcon className="w-3.5 h-3.5 text-text3" />
                <span>{project.project_type} · {project.genre}</span>
              </span>
              <span className="text-xs text-text3">{project.tone}</span>
              <span className="text-text3 text-xs">•</span>
              <div className="flex items-center gap-1.5 text-xs font-medium">
                <span
                  className={`w-2 h-2 rounded-full ${
                    project.status === 'completed'
                      ? 'bg-emerald-500'
                      : isGenerating
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-text3'
                  }`}
                />
                <span className="text-text2">
                  {project.status === 'completed' ? 'Ready' : `Generating (${project.progress}%)`}
                </span>
              </div>
            </div>

            {/* Editable Title */}
            <div>
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="input font-bold text-xl md:text-2xl py-1.5"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="btn-primary py-2 px-3 text-xs"
                    title="Save title"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsEditingTitle(false)}
                    className="btn-ghost py-2 px-3 text-xs"
                    title="Cancel edit"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text1">
                    {project.title}
                  </h1>
                  <button
                    onClick={() => {
                      setTitleInput(project.title);
                      setIsEditingTitle(true);
                    }}
                    className="p-1.5 rounded-lg text-text3 hover:text-text1 hover:bg-surface-muted transition-colors"
                    title="Edit Title"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs sm:text-sm text-text2 line-clamp-2 max-w-2xl leading-relaxed">
              <span className="font-medium text-text1">Premise:</span> {project.idea}
            </p>
          </div>

          {/* Action Toolbar: Export (primary), Regenerate (outline), icon-only Activity and PDF */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="btn-primary text-xs py-1.5 px-3.5 shadow-sm"
              title="Export Project"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={() => setIsRegeneratingModalOpen(true)}
              className="btn-ghost border border-border hover:border-border-hover text-xs py-1.5 px-3"
              title="Regenerate Section"
            >
              <RefreshCw className="w-3.5 h-3.5 text-text3" />
              <span>Regenerate</span>
            </button>

            <button
              onClick={() => onSelectTab('activity')}
              className="p-2 rounded-xl text-text3 hover:text-text1 hover:bg-surface-muted border border-border transition-colors"
              title="View Agent Activity"
              aria-label="View Agent Activity"
            >
              <Activity className="w-4 h-4" />
            </button>

            <button
              onClick={handleQuickDownloadPdf}
              disabled={isQuickExportingPdf}
              className="p-2 rounded-xl text-text3 hover:text-text1 hover:bg-surface-muted border border-border transition-colors disabled:opacity-50"
              title="Download PDF"
              aria-label="Download PDF"
            >
              {isQuickExportingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar when Generating */}
        {isGenerating && (
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex items-center justify-between text-xs text-text3">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span>
                  Current Agent:{' '}
                  <strong className="text-text1">{project.current_agent || 'Swarm Orchestrator'}</strong>
                </span>
              </span>
              <span className="font-medium text-text1">{project.progress}%</span>
            </div>
            <div className="w-full bg-surface-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-accent h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Underline Tab Row with Sliding Active Indicator */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border scrollbar-none relative">
        {[
          { id: 'overview', label: 'Overview', icon: Sparkles },
          { id: 'research', label: 'World & Lore', icon: Brain },
          { id: 'story', label: 'Screenplay', icon: Feather },
          { id: 'visuals', label: 'Visuals', icon: Palette },
          { id: 'audio', label: 'Audio', icon: Headphones },
          { id: 'critic', label: 'Critic', icon: CheckCircle2 },
        ].map(({ id, label, icon: Icon }) => {
          const isActive = activeDepartment === id;
          return (
            <button
              key={id}
              onClick={() => setActiveDepartment(id as any)}
              className={`relative flex items-center gap-2 px-3.5 py-3 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? 'text-accent font-semibold' : 'text-text3 hover:text-text1'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeWorkspaceTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* DEPARTMENT CONTENT PANELS */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDepartment}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
        >
          {/* 1. CONCEPT & OVERVIEW */}
          {activeDepartment === 'overview' && (
            <div className="space-y-6">
              {project.story ? (
                <>
                  {/* Editorial Logline Pull-Quote */}
                  <div className="card p-6 md:p-8 space-y-2">
                    <span className="label">Logline</span>
                    <blockquote className="text-xl md:text-2xl font-serif italic text-text1 leading-relaxed">
                      "{project.story.logline}"
                    </blockquote>
                  </div>

                  {/* Synopsis & 3-Act Structure Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <Feather className="w-4 h-4 text-accent" />
                        <h3 className="text-sm font-semibold text-text1">Synopsis</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-text2 leading-relaxed whitespace-pre-line">
                        {project.story.synopsis}
                      </p>
                    </div>

                    <div className="card p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-accent" />
                        <h3 className="text-sm font-semibold text-text1">Three-Act Structure</h3>
                      </div>
                      <div className="card-muted p-4 text-xs font-mono text-text2 leading-relaxed whitespace-pre-line">
                        {project.story.three_act_structure}
                      </div>
                    </div>
                  </div>

                  {/* Executive Critic Score Card */}
                  {project.critic && (
                    <div className="card-dark p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="space-y-1.5 text-center sm:text-left">
                        <h3 className="text-xl font-bold text-white">{project.critic.verdict}</h3>
                        <p className="text-xs text-white/70">
                          Continuity: <strong className="text-white">{project.critic.continuity_status}</strong>
                        </p>
                      </div>

                      <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/10 border border-white/10 min-w-[120px] text-center">
                        <span className="text-4xl font-extrabold text-white tracking-tight">
                          <CountUpScore value={project.critic.score} />
                        </span>
                        <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider mt-0.5">
                          Quality Score
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                renderSectionPlaceholder('Narrative Overview', 'overview')
              )}
            </div>
          )}

      {/* 2. WORLD LORE & CHARACTERS */}
      {activeDepartment === 'research' && (
        <div className="space-y-6">
          {project.research ? (
            <>
              {/* World Building & Lore Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold text-text1">Setting & Environment</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-text2 leading-relaxed">
                    {project.research.world_building}
                  </p>
                </div>

                <div className="card p-6 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold text-text1">Laws & Lore</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-text2 leading-relaxed">
                    {project.research.lore_and_rules}
                  </p>
                </div>
              </div>

              {/* Characters Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-text1">Characters</h3>
                  </div>
                  <span className="pill text-xs">{project.research.characters.length} Roles</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.research.characters.map((char, idx) => (
                    <div key={idx} className="card p-5 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="label text-accent font-semibold">{char.role}</span>
                          {char.archetype && (
                            <span className="pill text-[10px]">{char.archetype}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-8 h-8 rounded-full bg-accent-tint text-accent-text flex items-center justify-center font-bold text-xs shrink-0">
                            {char.name.charAt(0).toUpperCase()}
                          </div>
                          <h4 className="text-base font-bold text-text1 truncate">{char.name}</h4>
                        </div>

                        <div className="space-y-2 text-xs text-text2">
                          <p><strong className="text-text1">Appearance:</strong> {char.appearance}</p>
                          <p><strong className="text-text1">Personality:</strong> {char.personality}</p>
                          <p><strong className="text-text1">Motivation:</strong> {char.motivation}</p>
                          {char.character_arc && (
                            <div className="pt-2 border-t border-border text-[11px] text-accent">
                              <strong className="text-text3">Arc:</strong> {char.character_arc}
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
            renderSectionPlaceholder('World Lore & Characters', 'research')
          )}
        </div>
      )}

      {/* 3. SCREENPLAY & SCENES */}
      {activeDepartment === 'story' && (
        <div className="space-y-6">
          {project.story ? (
            <>
              {/* Screenplay Excerpt Treatment */}
              <div className="card p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold text-text1">
                      Treatment & Excerpt
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCopy(project.story!.full_script_or_treatment, 'screenplay')}
                    className="flex items-center gap-1.5 text-xs text-accent font-medium hover:underline"
                  >
                    {copiedPromptId === 'screenplay' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPromptId === 'screenplay' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="card-muted p-4 text-xs font-mono text-text2 leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {project.story.full_script_or_treatment}
                </div>
              </div>

              {/* Scene Breakdown Table / Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-text1">
                      Scene Breakdown ({project.story.scenes.length})
                    </h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {project.story.scenes.map((scene, idx) => (
                    <div key={idx} className="card p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-surface-muted text-text1 font-bold text-xs flex items-center justify-center border border-border">
                            {scene.scene_number}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-text1">{scene.title}</h4>
                            <p className="text-xs text-text3">
                              {scene.location} • <span className="text-accent">{scene.time}</span>
                            </p>
                          </div>
                        </div>

                        {editingSceneIdx === idx ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleSaveSceneEdit(idx)}
                              className="btn-primary py-1 px-3 text-xs"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => setEditingSceneIdx(null)}
                              className="btn-ghost py-1 px-3 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingSceneIdx(idx);
                              setEditedAction(scene.action);
                              setEditedDialogue(scene.dialogue || '');
                            }}
                            className="p-1.5 rounded-lg text-text3 hover:text-text1 hover:bg-surface-muted transition-colors"
                            title="Edit Scene"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {editingSceneIdx === idx ? (
                        <div className="space-y-3 pt-2 border-t border-border">
                          <div>
                            <label className="label block mb-1">Dramatic Action</label>
                            <textarea
                              rows={3}
                              value={editedAction}
                              onChange={(e) => setEditedAction(e.target.value)}
                              className="input text-xs"
                            />
                          </div>
                          <div>
                            <label className="label block mb-1">Key Dialogue Line</label>
                            <textarea
                              rows={2}
                              value={editedDialogue}
                              onChange={(e) => setEditedDialogue(e.target.value)}
                              className="input font-mono text-xs"
                            />
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-xs sm:text-sm text-text2 leading-relaxed">
                            {scene.action}
                          </p>

                          {scene.dialogue && (
                            <div className="card-muted p-3 text-xs font-mono text-text1">
                              <span className="label block mb-1">Dialogue Beat</span>
                              {scene.dialogue}
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] text-text3 border-t border-border">
                            {scene.visual_cues && (
                              <div>
                                <strong className="text-text2">Visual Cue:</strong> {scene.visual_cues}
                              </div>
                            )}
                            {scene.audio_cues && (
                              <div>
                                <strong className="text-text2">Audio Cue:</strong> {scene.audio_cues}
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
            renderSectionPlaceholder('Screenplay & Scenes', 'story')
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
                <div className="card p-6 space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold text-text1">
                      Art Direction
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-text2 leading-relaxed">
                    {project.visuals.art_direction}
                  </p>
                </div>

                {/* 5-Color Hex Production Palette */}
                <div className="card p-6 space-y-3">
                  <h3 className="text-sm font-semibold text-text1">Palette</h3>
                  <div className="space-y-2">
                    {project.visuals.color_palette.map((c, i) => {
                      const hexMatch = c.match(/#[0-9a-fA-F]{6}/);
                      const hex = hexMatch ? hexMatch[0] : '#7E22CE';
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: i * 0.05, duration: 0.2 }}
                          onClick={() => handleCopy(hex, hex, 'color')}
                          className="flex items-center justify-between p-2 rounded-xl border border-border bg-surface-muted hover:border-border-hover cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-5 h-5 rounded-md border border-black/10 shrink-0"
                              style={{ backgroundColor: hex }}
                            />
                            <span className="text-xs font-mono text-text1">{c}</span>
                          </div>
                          <span className="text-[10px] text-accent font-semibold">
                            {copiedColor === hex ? 'Copied' : 'Copy'}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Lighting & Cinematography */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="card p-5 space-y-1">
                  <span className="label">Lighting Setup</span>
                  <p className="text-xs sm:text-sm text-text1">{project.visuals.lighting_style}</p>
                </div>
                <div className="card p-5 space-y-1">
                  <span className="label">Cinematography & Framing</span>
                  <p className="text-xs sm:text-sm text-text1">{project.visuals.cinematography_notes}</p>
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
            renderSectionPlaceholder('Visual Art Direction', 'visuals')
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
                <div className="card p-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold text-text1">Soundtrack Direction</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-text2 leading-relaxed">
                    {project.audio.music_score_direction}
                  </p>
                </div>

                <div className="card p-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold text-text1">Tempo & Instrumentation</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-text2 leading-relaxed">
                    {project.audio.tempo_and_instruments}
                  </p>
                </div>
              </div>

              {/* Soundtrack Tracks & Voice Casting */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card p-6 space-y-3">
                  <h3 className="text-sm font-semibold text-text1">Soundtrack Tracks</h3>
                  <div className="space-y-1.5">
                    {project.audio.soundtrack_tracks.map((t, idx) => (
                      <div key={idx} className="p-2 rounded-xl bg-surface-muted text-xs text-text2">
                        {t}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-6 space-y-2">
                  <h3 className="text-sm font-semibold text-text1">Voice Casting</h3>
                  <p className="text-xs sm:text-sm text-text2 leading-relaxed">
                    {project.audio.voice_casting_notes}
                  </p>
                </div>
              </div>

              {/* Sound Effects Catalog */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-text1">
                    Sound Effects ({project.audio.sound_effects.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {project.audio.sound_effects.map((sfx, idx) => (
                    <div key={idx} className="card p-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-text1">{sfx.name}</span>
                        <span className="pill text-[10px]">{sfx.category}</span>
                      </div>
                      <span className="text-[11px] text-accent font-medium block">{sfx.scene_ref}</span>
                      <p className="text-xs text-text2 leading-relaxed">{sfx.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            renderSectionPlaceholder('Audio & Sound Design', 'audio')
          )}
        </div>
      )}

      {/* 6. CRITIC AUDIT & QUALITY REVIEW */}
      {activeDepartment === 'critic' && (
        <div className="space-y-6">
          {project.critic ? (
            <>
              {/* Score & Verdict Banner */}
              <div className="card-dark p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-white">{project.critic.verdict}</h3>
                  <p className="text-xs text-white/70">
                    Continuity: <strong className="text-white">{project.critic.continuity_status}</strong>
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/10 border border-white/10 text-center min-w-[130px]">
                  <span className="text-4xl font-extrabold text-white tracking-tight">
                    <CountUpScore value={project.critic.score} />
                  </span>
                  <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider mt-1">
                    Quality Score
                  </span>
                </div>
              </div>

              {/* Strengths & Inconsistencies */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="card p-6 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <h4>Strengths</h4>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-text2">
                    {project.critic.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold mt-0.5">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Flagged Inconsistencies */}
                <div className="card p-6 space-y-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <h4>Continuity Nuances</h4>
                  </div>
                  <ul className="space-y-2 text-xs sm:text-sm text-text2">
                    {project.critic.inconsistencies.map((inc, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Editorial Recommendations */}
              <div className="card p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <h4 className="text-sm font-semibold text-text1">Editorial Revisions</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {project.critic.suggestions_for_improvement.map((sug, idx) => (
                    <div key={idx} className="card-muted p-4 space-y-1">
                      <span className="label block text-accent">Revision #{idx + 1}</span>
                      <p className="text-xs text-text2 leading-relaxed">{sug}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            renderSectionPlaceholder('Critic Audit & Quality Review', 'critic')
          )}
        </div>
      )}
        </motion.div>
      </AnimatePresence>

      {/* HUMAN IN THE LOOP: REGENERATE SECTION MODAL */}
      {isRegeneratingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="card p-6 space-y-5 max-w-lg w-full shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-accent" />
                <h3 className="text-base font-bold text-text1">Regenerate Section</h3>
              </div>
              <button
                onClick={() => setIsRegeneratingModalOpen(false)}
                className="p-1 rounded-lg text-text3 hover:text-text1 hover:bg-surface-muted"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="label block mb-2">Target Department</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                {[
                  { key: 'story', label: 'Screenplay' },
                  { key: 'research', label: 'World & Lore' },
                  { key: 'visuals', label: 'Visuals' },
                  { key: 'audio', label: 'Audio' },
                  { key: 'critic', label: 'Critic' },
                ].map(({ key, label }) => {
                  const isActive = regenSection === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setRegenSection(key as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isActive
                          ? 'bg-accent-tint text-accent-text border-accent font-semibold'
                          : 'border-border bg-surface-muted text-text2 hover:text-text1'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="label block mb-1.5">Revision Notes</label>
              <textarea
                rows={3}
                placeholder="e.g. 'Make the ending more bittersweet', 'Emphasize neon noir visuals', 'Add a haunting violin motif'..."
                value={regenInstructions}
                onChange={(e) => setRegenInstructions(e.target.value)}
                className="input text-xs resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsRegeneratingModalOpen(false)}
                className="btn-ghost text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTriggerRegeneration}
                disabled={isRegenerating}
                className="btn-primary text-xs"
              >
                {isRegenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Regenerating...</span>
                  </>
                ) : (
                  <>
                    <span>Regenerate</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
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
