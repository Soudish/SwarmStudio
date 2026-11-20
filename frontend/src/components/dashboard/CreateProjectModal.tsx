import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Film,
  Gamepad2,
  Mic,
  Sliders,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CreateProjectPayload, ProjectType } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateProjectPayload) => Promise<void>;
  availableModels: string[];
  defaultModel: string;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableModels,
  defaultModel
}) => {
  const [projectType, setProjectType] = useState<ProjectType>('film');
  const [title, setTitle] = useState('');
  const [idea, setIdea] = useState('');
  const [tone, setTone] = useState('Cinematic and Thought-provoking');
  const [genre, setGenre] = useState('Science Fiction');
  const [targetAudience, setTargetAudience] = useState('Young Adults & Cinephiles');
  const [instructions, setInstructions] = useState('');
  const [selectedModel, setSelectedModel] = useState(defaultModel || 'llama3.2');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplateIdx, setSelectedTemplateIdx] = useState<number | null>(null);

  const shouldReduceMotion = useReducedMotion();
  const premiseRef = useRef<HTMLTextAreaElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const quickTemplates = [
    {
      label: 'Sci-Fi Short Film',
      type: 'film' as ProjectType,
      genre: 'Science Fiction',
      tone: 'Poetic & Emotional',
      text: 'Create a science-fiction short film about a decommissioned maintenance robot that discovers human emotions after meeting a lonely orphan child in a rain-slicked industrial city.',
    },
    {
      label: 'Cyberpunk Narrative RPG',
      type: 'game' as ProjectType,
      genre: 'Cyberpunk',
      tone: 'Gritty Noir & High Stakes',
      text: 'An indie narrative RPG about a neural memory courier in Neo-Kyoto who accidentally downloads the final living thoughts of a murdered corporate CEO.',
    },
    {
      label: 'Investigative Podcast',
      type: 'podcast' as ProjectType,
      genre: 'Supernatural Mystery',
      tone: 'Atmospheric & Eerie',
      text: 'A serialized 6-part investigative audio drama following an audio restoration archivist who discovers hidden rhythmic signals inside 1970s radio broadcast tapes.',
    }
  ];

  // Autofocus premise when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        premiseRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Escape key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // Basic focus trap
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Auto-grow textarea
  const handlePremiseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIdea(e.target.value);
    // Clear template selection when user manually edits
    if (selectedTemplateIdx !== null) setSelectedTemplateIdx(null);
    // Auto-grow
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 240) + 'px';
  };

  const handleSelectTemplate = (t: typeof quickTemplates[0], idx: number) => {
    setProjectType(t.type);
    setGenre(t.genre);
    setTone(t.tone);
    setIdea(t.text);
    setSelectedTemplateIdx(idx);
    if (!title) setTitle(t.label);
    // Resize textarea after template fill
    setTimeout(() => {
      if (premiseRef.current) {
        premiseRef.current.style.height = 'auto';
        premiseRef.current.style.height = Math.min(premiseRef.current.scrollHeight, 240) + 'px';
      }
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim() || undefined,
        idea: idea.trim(),
        project_type: projectType,
        tone,
        genre,
        target_audience: targetAudience,
        instructions: instructions.trim() || undefined,
        model_override: selectedModel || undefined
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.97, y: shouldReduceMotion ? 0 : 8 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, scale: shouldReduceMotion ? 1 : 0.97, y: shouldReduceMotion ? 0 : 8, transition: { duration: 0.14 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            key="modal-dialog"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="New Project"
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full sm:max-w-2xl max-h-[95dvh] sm:max-h-[90vh] flex flex-col card sm:rounded-[20px] rounded-t-[24px] rounded-b-none sm:m-4 overflow-hidden shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border shrink-0">
              <h2 className="text-xl font-bold tracking-tight text-text1">New Project</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-text3 hover:text-text1 hover:bg-surface-muted transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Quick Inspiration Chips */}
              <div>
                <span className="label block mb-2">Templates</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {quickTemplates.map((t, idx) => {
                    const isSelected = selectedTemplateIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        title={`${t.genre} • ${t.tone}`}
                        onClick={() => handleSelectTemplate(t, idx)}
                        className={`relative text-left p-3 rounded-xl border transition-all text-xs ${
                          isSelected
                            ? 'border-accent bg-accent-tint'
                            : 'border-border bg-surface-muted hover:border-border-hover hover:bg-surface'
                        }`}
                      >
                        <div className={`font-semibold ${isSelected ? 'text-accent-text' : 'text-text1'}`}>
                          {t.label}
                        </div>
                        <div className="text-[11px] text-text3 mt-0.5">
                          {t.genre} · {t.tone}
                        </div>
                        {isSelected && (
                          <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <form id="create-project-form" onSubmit={handleSubmit} className="space-y-5">
                {/* Segmented Format Selector */}
                <div>
                  <label className="label block mb-2">Medium / Format</label>
                  <div className="grid grid-cols-3 gap-2 bg-surface-muted p-1 rounded-2xl border border-border">
                    {[
                      { type: 'film', label: 'Film & Screenplay', icon: Film },
                      { type: 'game', label: 'Game Narrative', icon: Gamepad2 },
                      { type: 'podcast', label: 'Audio Drama', icon: Mic },
                    ].map(({ type, label, icon: Icon }) => {
                      const isActive = projectType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setProjectType(type as ProjectType)}
                          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-surface text-text1 shadow-sm font-semibold'
                              : 'text-text2 hover:text-text1'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-accent' : 'text-text3'}`} />
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Project Title (Optional) */}
                <div>
                  <label className="label block mb-1.5">
                    Project Title <span className="text-text3 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Whispers in the Rain, Circuit of Hearts..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input"
                  />
                </div>

                {/* Creative Idea (Core Prompt) — heavier label + auto-grow */}
                <div>
                  <label className="text-xs font-bold tracking-widest uppercase text-text2 block mb-1.5">
                    Creative Idea / Premise <span className="text-accent">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      ref={premiseRef}
                      required
                      rows={6}
                      placeholder="Describe your creative vision, protagonist conflict, key setting, or dramatic arc..."
                      value={idea}
                      onChange={handlePremiseChange}
                      className="input resize-none w-full pb-6"
                      style={{ minHeight: '144px', maxHeight: '240px' }}
                    />
                    <span className="absolute bottom-2 right-3 text-[10px] text-text3 font-mono select-none pointer-events-none">
                      {idea.length} chars
                    </span>
                  </div>
                </div>

                {/* Genre & Tone Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="label block mb-1.5">Genre</label>
                    <input
                      type="text"
                      value={genre}
                      onChange={(e) => { setGenre(e.target.value); setSelectedTemplateIdx(null); }}
                      placeholder="Sci-Fi, Cyberpunk, Noir..."
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label block mb-1.5">Tone & Atmosphere</label>
                    <input
                      type="text"
                      value={tone}
                      onChange={(e) => { setTone(e.target.value); setSelectedTemplateIdx(null); }}
                      placeholder="Cinematic, Emotional, Tense..."
                      className="input"
                    />
                  </div>
                </div>

                {/* Toggle Advanced Options */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-1.5 text-xs font-medium text-text2 hover:text-text1 transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5 text-text3" />
                    <span>Advanced options</span>
                    <motion.span
                      animate={{ rotate: showAdvanced ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'inline-flex' }}
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-text3" />
                    </motion.span>
                  </button>
                </div>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      key="advanced-panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="card-muted p-4 space-y-3 text-xs">
                        <div>
                          <label className="label block mb-1">Target Audience</label>
                          <input
                            type="text"
                            value={targetAudience}
                            onChange={(e) => setTargetAudience(e.target.value)}
                            placeholder="e.g. Young Adults, Cinephiles, RPG Gamers"
                            className="input text-xs"
                          />
                        </div>

                        <div>
                          <label className="label block mb-1">Custom Directives</label>
                          <textarea
                            rows={2}
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="Specific rules: e.g. 'Must have an ambiguous ending', 'Focus on practical effects aesthetic'..."
                            className="input text-xs resize-none"
                          />
                        </div>

                        <div>
                          <label className="label block mb-1">Model Override</label>
                          <input
                            type="text"
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            placeholder="llama3.2, mistral, gemma2, etc."
                            className="input text-xs"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Sticky Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border shrink-0 bg-surface">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-project-form"
                disabled={isSubmitting || !idea.trim()}
                className="btn-primary"
                style={{ opacity: !idea.trim() ? 0.4 : 1, cursor: !idea.trim() ? 'not-allowed' : 'pointer' }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
