import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Film,
  Gamepad2,
  Mic,
  Sliders,
  ChevronDown,
  ChevronUp,
  Wand2
} from 'lucide-react';
import { CreateProjectPayload, ProjectType } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { isDark } = useTheme();
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
      label: '🤖 Sci-Fi Short Film',
      type: 'film' as ProjectType,
      genre: 'Science Fiction',
      tone: 'Poetic & Emotional',
      text: 'Create a science-fiction short film about a decommissioned maintenance robot that discovers human emotions after meeting a lonely orphan child in a rain-slicked industrial city.',
    },
    {
      label: '🎮 Cyberpunk Narrative RPG',
      type: 'game' as ProjectType,
      genre: 'Cyberpunk',
      tone: 'Gritty Noir & High Stakes',
      text: 'An indie narrative RPG about a neural memory courier in Neo-Kyoto who accidentally downloads the final living thoughts of a murdered corporate CEO.',
    },
    {
      label: '🎙️ Investigative Mystery Podcast',
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
      setTitle(t.label.split(' ').slice(1).join(' '));
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

  const modalBg = isDark ? 'bg-[#0F1626] border-purple-500/25 text-slate-100 shadow-purple-950/50' : 'bg-white border-purple-200 text-slate-900 shadow-xl';
  const inputBg = isDark ? 'bg-slate-900/80 border-slate-700/80 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400';
  const labelColor = isDark ? 'text-slate-300' : 'text-slate-700';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className={`relative w-full max-w-2xl border rounded-2xl shadow-2xl p-6 md:p-8 my-8 theme-transition ${modalBg}`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-purple-400/30 flex-shrink-0">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Create New Swarm Project</h2>
            <p className={`text-sm ${textMuted}`}>Deploy a crew of 5 collaborative AI agents to develop your concept.</p>
          </div>
        </div>

        {/* Quick Idea Templates */}
        <div className="mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-purple-400 block mb-2">
            Quick Spark Inspiration
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {quickTemplates.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectTemplate(t)}
                className={`text-left p-2.5 rounded-xl border transition-all text-xs ${
                  isDark
                    ? 'bg-slate-900/60 border-slate-800 hover:border-purple-500/50 hover:bg-purple-950/20 text-slate-300'
                    : 'bg-slate-50 border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700'
                }`}
              >
                <div className={`font-semibold ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>{t.label}</div>
                <div className={`text-[11px] truncate mt-0.5 ${textMuted}`}>{t.genre} &bull; {t.tone}</div>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Type Selection */}
          <div>
            <label className={`text-xs font-semibold uppercase tracking-wider block mb-2 ${labelColor}`}>
              Select Medium / Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { type: 'film', label: 'Film & Cinema', icon: Film, desc: 'Short film, feature, or cinematic pilot' },
                { type: 'game', label: 'Game Narrative', icon: Gamepad2, desc: 'Indie game, RPG lore & quest beats' },
                { type: 'podcast', label: 'Audio Podcast', icon: Mic, desc: 'Narrative audio drama or docuseries' },
              ].map(({ type, label, icon: Icon, desc }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setProjectType(type as ProjectType)}
                  className={`flex flex-col items-center text-center p-3.5 rounded-xl border transition-all ${
                    projectType === type
                      ? isDark
                        ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-600/20 text-white'
                        : 'bg-purple-100 border-purple-500 shadow-md text-purple-900 font-bold'
                      : isDark
                      ? 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-1.5 ${projectType === type ? 'text-purple-500' : textMuted}`} />
                  <span className="text-sm font-semibold">{label}</span>
                  <span className={`text-[11px] mt-1 leading-snug ${textMuted}`}>{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Project Title (Optional) */}
          <div>
            <label className={`text-xs font-semibold uppercase tracking-wider block mb-1.5 ${labelColor}`}>
              Project Title <span className={`${textMuted} font-normal`}>(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Whispers in the Rain, Circuit of Hearts..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${inputBg}`}
            />
          </div>

          {/* Creative Idea (Core Prompt) */}
          <div>
            <label className={`text-xs font-semibold uppercase tracking-wider block mb-1.5 ${labelColor}`}>
              Creative Idea / Premise <span className="text-purple-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe your creative vision, protagonist conflict, key setting, or emotional core..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 ${inputBg}`}
            />
          </div>

          {/* Genre & Tone Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider block mb-1.5 ${labelColor}`}>
                Genre
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Sci-Fi, Cyberpunk, Fantasy..."
                className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:border-purple-500 ${inputBg}`}
              />
            </div>
            <div>
              <label className={`text-xs font-semibold uppercase tracking-wider block mb-1.5 ${labelColor}`}>
                Tone & Atmosphere
              </label>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="Cinematic, Dark Noir, Whimsical..."
                className={`w-full px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:border-purple-500 ${inputBg}`}
              />
            </div>
          </div>

          {/* Toggle Advanced Options */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs font-medium text-purple-500 hover:text-purple-400"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide advanced settings' : 'Show target audience & agent directives'}</span>
              {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showAdvanced && (
            <div className={`p-4 rounded-xl border space-y-4 text-xs animate-fadeIn ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div>
                <label className={`font-semibold block mb-1 ${labelColor}`}>Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Young Adults, Indie Film Fest, Mature RPG Gamers"
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${inputBg}`}
                />
              </div>

              <div>
                <label className={`font-semibold block mb-1 ${labelColor}`}>
                  Custom Agent Directives & Constraints
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Specific rules: e.g. 'Must have an ambiguous ending', 'Focus on practical effects aesthetic', 'No supernatural elements'..."
                  className={`w-full px-3 py-2 rounded-lg border text-xs resize-none ${inputBg}`}
                />
              </div>

              <div>
                <label className={`font-semibold block mb-1 ${labelColor}`}>Ollama Model</label>
                <input
                  type="text"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  placeholder="llama3.2, mistral, gemma2, etc."
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${inputBg}`}
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className={`flex items-center justify-end gap-3 pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !idea.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/40 border border-purple-400/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Deploying Swarm...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Start AI Collaboration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
