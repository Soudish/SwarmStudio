import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Maximize2,
  X,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { ImagePrompt } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

interface ConceptArtGalleryProps {
  prompts: ImagePrompt[];
  onUpdatePrompts?: (updated: ImagePrompt[]) => void;
}

// Fallback curated cinematic images by genre keyword to guarantee the user NEVER sees raw text
const GENRE_FALLBACK_IMAGES: Record<string, string> = {
  robot: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
  cyberpunk: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
  scifi: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  city: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80',
  rain: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80',
  space: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
  fantasy: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  mystery: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
  nature: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'
};

const getCuratedFallback = (promptText: string): string => {
  const lower = promptText.toLowerCase();
  for (const [key, url] of Object.entries(GENRE_FALLBACK_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return GENRE_FALLBACK_IMAGES.default;
};

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const buildPollinationsUrl = (prompt: string, seed?: number): string => {
  // Strip dialogue, script labels, and clean visual keywords
  const clean = prompt
    .replace(/SCENE|Midjourney|Flux|--ar 16:9|--v 6|--v 5/gi, '')
    .replace(/[\[\]]/g, '')
    .trim();
  const enhanced = `${clean}, cinematic masterpiece concept art, 8k resolution, volumetric lighting, photorealistic octane render, atmospheric`;
  const seedVal = seed || (hashString(prompt) % 999999);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(enhanced)}?width=1024&height=576&nologo=true&seed=${seedVal}&model=flux`;
};

export const ConceptArtGallery: React.FC<ConceptArtGalleryProps> = ({
  prompts,
  onUpdatePrompts,
}) => {
  const { isDark } = useTheme();
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  
  // Initialize with real image URLs for all prompts immediately
  const [imagesMap, setImagesMap] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    prompts.forEach((p) => {
      initial[p.id] = p.image_url || buildPollinationsUrl(p.prompt);
    });
    return initial;
  });

  const [activeLightbox, setActiveLightbox] = useState<ImagePrompt | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleRegenerate = (promptItem: ImagePrompt, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLoadingMap((prev) => ({ ...prev, [promptItem.id]: true }));

    // Create fresh seed for new image variation
    const newSeed = Math.floor(Math.random() * 900000) + 100000;
    const newUrl = buildPollinationsUrl(promptItem.prompt, newSeed);

    // Preload image in background
    const img = new Image();
    img.src = newUrl;
    img.onload = () => {
      setImagesMap((prev) => ({ ...prev, [promptItem.id]: newUrl }));
      setLoadingMap((prev) => ({ ...prev, [promptItem.id]: false }));
      if (onUpdatePrompts) {
        onUpdatePrompts(
          prompts.map((p) => (p.id === promptItem.id ? { ...p, image_url: newUrl } : p))
        );
      }
    };
    img.onerror = () => {
      // Fallback to high-res photographic artwork
      const fallback = getCuratedFallback(promptItem.prompt);
      setImagesMap((prev) => ({ ...prev, [promptItem.id]: fallback }));
      setLoadingMap((prev) => ({ ...prev, [promptItem.id]: false }));
    };
  };

  const handleImageError = (promptId: string, promptText: string) => {
    // If Pollinations is slow or fails, switch immediately to curated cinematic photography
    const fallback = getCuratedFallback(promptText);
    setImagesMap((prev) => {
      if (prev[promptId] === fallback) return prev;
      return { ...prev, [promptId]: fallback };
    });
  };

  const handleCopyPrompt = (text: string, id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const cardBg = isDark ? 'bg-[#0F1626]' : 'bg-white';
  const cardBorder = isDark ? 'border-slate-800' : 'border-slate-200 shadow-sm';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className={`text-lg font-bold tracking-tight flex items-center gap-2 ${textPrimary}`}>
            <ImageIcon className="w-5 h-5 text-purple-500" />
            <span>AI Concept Art & Visual Renders</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
              isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
            }`}>
              {prompts.length} Visual Prompts
            </span>
          </h3>
          <p className={`text-xs mt-1 ${textMuted}`}>
            Real-time visual concept art rendered directly in browser. Click any image to view HD lightbox.
          </p>
        </div>
      </div>

      {/* Grid of Concept Art Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prompts.map((p) => {
          const imgUrl = imagesMap[p.id] || buildPollinationsUrl(p.prompt);
          const isLoading = loadingMap[p.id];

          return (
            <div
              key={p.id}
              className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all ${cardBg} ${cardBorder}`}
            >
              {/* Image Preview Canvas */}
              <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group">
                <img
                  src={imgUrl}
                  alt={p.title}
                  onError={() => handleImageError(p.id, p.prompt)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                  onClick={() => setActiveLightbox(p)}
                  loading="lazy"
                />

                {/* Overlay actions on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveLightbox(p)}
                    className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all shadow-lg"
                    title="Inspect Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <a
                    href={imgUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all shadow-lg"
                    title="Open Full Resolution Image"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>

                {/* Loading spinner overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white">
                    <div className="w-8 h-8 border-3 border-purple-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-semibold text-purple-300">Rendering Fresh Variation...</span>
                  </div>
                )}

                {/* Badges on top of image */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/70 backdrop-blur-md text-purple-300 border border-purple-500/30">
                    {p.aspect_ratio} &bull; {p.style}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className={`font-bold text-sm ${textPrimary}`}>{p.title}</h4>
                  <button
                    onClick={(e) => handleCopyPrompt(p.prompt, p.id, e)}
                    className="flex items-center gap-1 text-[11px] text-purple-500 hover:text-purple-400 font-semibold"
                  >
                    {copiedId === p.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === p.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <p className={`text-xs leading-relaxed line-clamp-3 font-mono p-2.5 rounded-xl border ${
                  isDark ? 'bg-slate-950 text-slate-400 border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>
                  {p.prompt}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <span className={`text-[11px] ${textMuted}`}>AI Visual Synthesis</span>
                  <button
                    onClick={(e) => handleRegenerate(p, e)}
                    disabled={isLoading}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-900/30 transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Regenerate Art</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {activeLightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveLightbox(null)}
        >
          <div
            className={`relative max-w-4xl w-full rounded-3xl overflow-hidden border shadow-2xl flex flex-col ${
              isDark ? 'bg-[#0F1626] border-purple-500/30' : 'bg-white border-purple-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Lightbox Image View */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              <img
                src={imagesMap[activeLightbox.id] || buildPollinationsUrl(activeLightbox.prompt)}
                alt={activeLightbox.title}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            {/* Lightbox Details Bar */}
            <div className="p-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">
                    {activeLightbox.aspect_ratio} &bull; {activeLightbox.style}
                  </span>
                  <h3 className={`text-xl font-bold ${textPrimary}`}>{activeLightbox.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyPrompt(activeLightbox.prompt, activeLightbox.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                      isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-700'
                    }`}
                  >
                    {copiedId === activeLightbox.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === activeLightbox.id ? 'Copied Prompt' : 'Copy Prompt'}</span>
                  </button>

                  <a
                    href={imagesMap[activeLightbox.id] || buildPollinationsUrl(activeLightbox.prompt)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Open HD Image</span>
                  </a>
                </div>
              </div>

              <div className={`p-3 rounded-xl font-mono text-xs leading-relaxed border ${
                isDark ? 'bg-slate-950 text-slate-300 border-slate-900' : 'bg-slate-50 text-slate-800 border-slate-200'
              }`}>
                {activeLightbox.prompt}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
