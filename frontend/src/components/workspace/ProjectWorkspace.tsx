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
  ArrowRight,
  ChevronDown,
  Eye,
  Volume2,
  MessageSquare,
  MapPin,
  Sunrise
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

  // Scene accordion — first scene expanded by default
  const [expandedSceneIdx, setExpandedSceneIdx] = useState<number | null>(0);

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="card p-6 space-y-3 border-l-2 border-l-accent">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-accent" />
                    <h3 className="text-sm font-semibold text-text1">Setting & Environment</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-text2 leading-relaxed">
                    {project.research.world_building}
                  </p>
                </div>

                <div className="card p-6 space-y-3 border-l-2 border-l-accent/40">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-accent/70" />
                    <h3 className="text-sm font-semibold text-text1">Laws & Lore</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-text2 leading-relaxed">
                    {project.research.lore_and_rules}
                  </p>
                </div>
              </div>

              {/* Characters Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-text1">Characters</h3>
                  <span className="pill text-xs">{project.research.characters.length} Roles</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.research.characters.map((char, idx) => (
                    <div key={idx} className="card p-5 space-y-3">
                      {/* Card header: role + archetype */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="label text-accent/80 uppercase tracking-widest text-[10px]">{char.role}</span>
                        {char.archetype && (
                          <span className="pill text-[10px] shrink-0">{char.archetype}</span>
                        )}
                      </div>

                      {/* Character identity */}
                      <div className="flex items-center gap-3 pb-3 border-b border-border">
                        <div className="w-10 h-10 rounded-full bg-accent-tint text-accent-text flex items-center justify-center font-bold text-sm shrink-0">
                          {char.name.charAt(0).toUpperCase()}
                        </div>
                        <h4 className="text-base font-bold text-text1">{char.name}</h4>
                      </div>

                      {/* Attributes */}
                      <div className="space-y-2 text-xs">
                        <div className="flex gap-1.5">
                          <span className="text-text3 font-semibold w-20 shrink-0">Appearance</span>
                          <span className="text-text2 leading-relaxed">{char.appearance}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <span className="text-text3 font-semibold w-20 shrink-0">Personality</span>
                          <span className="text-text2 leading-relaxed">{char.personality}</span>
                        </div>
                        <div className="flex gap-1.5">
                          <span className="text-text3 font-semibold w-20 shrink-0">Motivation</span>
                          <span className="text-text2 leading-relaxed">{char.motivation}</span>
                        </div>
                        {char.character_arc && (
                          <div className="pt-2 border-t border-border">
                            <div className="flex items-start gap-1.5">
                              <span className="text-text3 font-semibold w-20 shrink-0 text-[10px] uppercase tracking-wider pt-0.5">Arc</span>
                              <span className="text-accent text-[11px] leading-relaxed">{char.character_arc}</span>
                            </div>
                          </div>
                        )}
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
                {/* Screenplay-style monospace block with left margin indicator */}
                <div className="relative">
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-accent/20 rounded-full" />
                  <div className="pl-4 card-muted text-xs font-mono text-text2 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto p-4 pl-5">
                    {project.story.full_script_or_treatment}
                  </div>
                </div>
              </div>

              {/* Scene Breakdown — Accordion */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-text1">
                    Scene Breakdown
                    <span className="ml-2 text-sm font-normal text-text3">({project.story.scenes.length})</span>
                  </h3>
                </div>

                <div className="space-y-2">
                  {project.story.scenes.map((scene, idx) => {
                    const isExpanded = expandedSceneIdx === idx;
                    const isEditing = editingSceneIdx === idx;
                    return (
                      <div
                        key={idx}
                        className="card overflow-hidden"
                        style={{ borderLeft: isExpanded ? '2px solid var(--accent)' : '2px solid transparent', transition: 'border-color 0.2s' }}
                      >
                        {/* ── HEADER ROW (always visible, click to expand) ── */}
                        <button
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-left group"
                          onClick={() => {
                            if (!isEditing) setExpandedSceneIdx(isExpanded ? null : idx);
                          }}
                        >
                          {/* Scene number badge */}
                          <span className={`w-7 h-7 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 transition-colors ${isExpanded ? 'bg-accent text-white' : 'bg-accent/10 text-accent border border-accent/20'}`}>
                            {scene.scene_number}
                          </span>

                          {/* Title + meta */}
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-bold text-text1 uppercase tracking-wide truncate block">{scene.title}</span>
                            <span className="flex items-center gap-1.5 mt-0.5">
                              <MapPin className="w-2.5 h-2.5 text-text3 shrink-0" />
                              <span className="text-[11px] text-text3 truncate">{scene.location}</span>
                              <span className="text-text3 mx-0.5">·</span>
                              <Sunrise className="w-2.5 h-2.5 text-accent/70 shrink-0" />
                              <span className="text-[11px] text-accent/80 font-medium truncate">{scene.time}</span>
                            </span>
                          </div>

                          {/* Cue type indicators */}
                          <div className="flex items-center gap-1 shrink-0">
                            {scene.visual_cues && (
                              <span title="Visual cue" className="w-5 h-5 rounded-md bg-purple-500/10 flex items-center justify-center">
                                <Eye className="w-2.5 h-2.5 text-purple-500" />
                              </span>
                            )}
                            {scene.audio_cues && (
                              <span title="Audio cue" className="w-5 h-5 rounded-md bg-blue-500/10 flex items-center justify-center">
                                <Volume2 className="w-2.5 h-2.5 text-blue-500" />
                              </span>
                            )}
                            {scene.dialogue && (
                              <span title="Dialogue" className="w-5 h-5 rounded-md bg-accent/10 flex items-center justify-center">
                                <MessageSquare className="w-2.5 h-2.5 text-accent" />
                              </span>
                            )}
                          </div>

                          {/* Chevron */}
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0 text-text3"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </motion.span>
                        </button>

                        {/* ── EXPANDED CONTENT ── */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              key="content"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                              style={{ overflow: 'hidden' }}
                            >
                              <div className="px-4 pb-4 space-y-3 border-t border-border">
                                {/* Edit controls */}
                                <div className="flex items-center justify-end pt-2">
                                  {isEditing ? (
                                    <div className="flex items-center gap-1.5">
                                      <button onClick={() => handleSaveSceneEdit(idx)} className="btn-primary py-1 px-3 text-xs">
                                        <Save className="w-3 h-3" /><span>Save</span>
                                      </button>
                                      <button onClick={() => setEditingSceneIdx(null)} className="btn-ghost py-1 px-3 text-xs">Cancel</button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => { setEditingSceneIdx(idx); setEditedAction(scene.action); setEditedDialogue(scene.dialogue || ''); }}
                                      className="flex items-center gap-1 text-[11px] text-text3 hover:text-accent transition-colors"
                                    >
                                      <Edit3 className="w-3 h-3" /> Edit
                                    </button>
                                  )}
                                </div>

                                {isEditing ? (
                                  <div className="space-y-3">
                                    <div>
                                      <label className="label block mb-1">Dramatic Action</label>
                                      <textarea rows={3} value={editedAction} onChange={(e) => setEditedAction(e.target.value)} className="input text-xs" />
                                    </div>
                                    <div>
                                      <label className="label block mb-1">Key Dialogue Line</label>
                                      <textarea rows={2} value={editedDialogue} onChange={(e) => setEditedDialogue(e.target.value)} className="input font-mono text-xs" />
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {/* Action */}
                                    <p className="text-sm text-text2 leading-relaxed">{scene.action}</p>

                                    {/* Dialogue Beat — screenplay-style cue card */}
                                    {scene.dialogue && (
                                      <div className="rounded-xl bg-surface-muted/60 border border-border px-4 py-3 space-y-1.5">
                                        <div className="flex items-center gap-1.5">
                                          <MessageSquare className="w-3 h-3 text-accent" />
                                          <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Dialogue Beat</span>
                                        </div>
                                        <p className="text-xs font-mono text-text1 italic leading-relaxed">{scene.dialogue}</p>
                                      </div>
                                    )}

                                    {/* VIS + AUD cues — side by side chips */}
                                    {(scene.visual_cues || scene.audio_cues) && (
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                        {scene.visual_cues && (
                                          <div className="flex gap-2 items-start rounded-xl bg-purple-500/5 border border-purple-500/15 p-3">
                                            <div className="w-6 h-6 rounded-lg bg-purple-500/15 flex items-center justify-center shrink-0 mt-0.5">
                                              <Eye className="w-3 h-3 text-purple-500" />
                                            </div>
                                            <div>
                                              <span className="text-[9px] font-bold uppercase tracking-widest text-purple-500 block mb-0.5">Visual</span>
                                              <span className="text-[11px] text-text2 leading-relaxed">{scene.visual_cues}</span>
                                            </div>
                                          </div>
                                        )}
                                        {scene.audio_cues && (
                                          <div className="flex gap-2 items-start rounded-xl bg-blue-500/5 border border-blue-500/15 p-3">
                                            <div className="w-6 h-6 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0 mt-0.5">
                                              <Volume2 className="w-3 h-3 text-blue-500" />
                                            </div>
                                            <div>
                                              <span className="text-[9px] font-bold uppercase tracking-widest text-blue-500 block mb-0.5">Audio</span>
                                              <span className="text-[11px] text-text2 leading-relaxed">{scene.audio_cues}</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
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
                <div className="card p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-text1">Soundtrack Tracks</h3>
                  <div className="space-y-1">
                    {project.audio.soundtrack_tracks.map((t, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-muted transition-colors group">
                        <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center text-[10px] font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-xs text-text2 leading-relaxed flex-1">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-5 space-y-2">
                  <h3 className="text-sm font-semibold text-text1">Voice Casting</h3>
                  <p className="text-xs sm:text-sm text-text2 leading-relaxed">
                    {project.audio.voice_casting_notes}
                  </p>
                </div>
              </div>

              {/* Sound Effects Catalog */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-text1">Sound Effects</h3>
                  <span className="pill text-xs">{project.audio.sound_effects.length} cues</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {project.audio.sound_effects.map((sfx, idx) => (
                    <div key={idx} className="card p-4 space-y-1.5 border-l-2 border-l-accent/30">
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-semibold text-xs text-text1 leading-tight">{sfx.name}</span>
                        <span className="pill text-[9px] shrink-0">{sfx.category}</span>
                      </div>
                      <span className="text-[10px] text-accent font-medium block">{sfx.scene_ref}</span>
                      <p className="text-[11px] text-text3 leading-relaxed">{sfx.description}</p>
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
