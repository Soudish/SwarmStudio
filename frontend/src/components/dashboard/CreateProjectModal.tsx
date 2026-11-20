import React, { useState } from 'react';
import {
  X,
  Film,
  Gamepad2,
  Mic,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';
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

  if (!isOpen) return null;

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

  const handleSelectTemplate = (t: typeof quickTemplates[0]) => {
    setProjectType(t.type);
    setGenre(t.genre);
    setTone(t.tone);
    setIdea(t.text);
    if (!title) {
      setTitle(t.label);
    }
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl card p-6 sm:p-8 my-8 shadow-md">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-text3 hover:text-text1 hover:bg-surface-muted transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-text1">New Project</h2>
        </div>

        {/* Quick Inspiration Chips */}
        <div className="mb-6">
          <span className="label block mb-2">Templates</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {quickTemplates.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectTemplate(t)}
                className="text-left p-3 rounded-xl border border-border bg-surface-muted hover:border-border-hover hover:bg-surface transition-all text-xs"
              >
                <div className="font-semibold text-text1">{t.label}</div>
                <div className="text-[11px] text-text3 truncate mt-0.5">
                  {t.genre} • {t.tone}
                </div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Creative Idea (Core Prompt) */}
          <div>
            <label className="label block mb-1.5">
              Creative Idea / Premise <span className="text-accent">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe your creative vision, protagonist conflict, key setting, or dramatic arc..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="input resize-none"
            />
          </div>

          {/* Genre & Tone Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="label block mb-1.5">Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Sci-Fi, Cyberpunk, Noir..."
                className="input"
              />
            </div>
            <div>
              <label className="label block mb-1.5">Tone & Atmosphere</label>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
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
              <span>{showAdvanced ? 'Hide options' : 'Advanced options'}</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5 text-text3" /> : <ChevronDown className="w-3.5 h-3.5 text-text3" />}
            </button>
          </div>

          {showAdvanced && (
            <div className="card-muted p-4 space-y-3 text-xs animate-fadeIn">
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
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
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
              disabled={isSubmitting || !idea.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
        </form>
      </div>
    </div>
  );
};
