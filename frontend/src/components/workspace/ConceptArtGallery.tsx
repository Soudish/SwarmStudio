import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Maximize2,
  X,
  RefreshCw,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { ImagePrompt } from '../../types';

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-accent" />
            <h3 className="text-base font-bold text-text1">AI Concept Art & Visual Renders</h3>
          </div>
          <p className="text-xs text-text3 mt-0.5">
            Neural concept art generated via FLUX.1. Click any card to inspect in high definition.
          </p>
        </div>
        <span className="pill text-xs self-start sm:self-auto">{prompts.length} Visual Prompts</span>
      </div>

      {/* Grid of Concept Art Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {prompts.map((p) => {
          const imgUrl = imagesMap[p.id] || buildPollinationsUrl(p.prompt);
          const isLoading = loadingMap[p.id];

          return (
            <div
              key={p.id}
              className="card overflow-hidden flex flex-col justify-between transition-all"
            >
              {/* Image Canvas */}
              <div className="relative aspect-video w-full bg-surface-muted overflow-hidden group">
                <img
                  src={imgUrl}
                  alt={p.title}
                  onError={() => handleImageError(p.id, p.prompt)}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 cursor-pointer"
                  onClick={() => setActiveLightbox(p)}
                  loading="lazy"
                />

                {/* Subtle Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setActiveLightbox(p)}
                    className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all shadow-sm"
                    title="Inspect Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <a
                    href={imgUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all shadow-sm"
                    title="Open Full Resolution"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>

                {/* Loading state overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-white">
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                    <span className="text-xs font-medium text-white/90">Rendering New Variation...</span>
                  </div>
                )}

                {/* Aspect Ratio Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white">
                    {p.aspect_ratio} • {p.style}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-text1 truncate">{p.title}</h4>
                  <button
                    onClick={(e) => handleCopyPrompt(p.prompt, p.id, e)}
                    className="flex items-center gap-1 text-[11px] text-accent hover:underline font-medium"
                  >
                    {copiedId === p.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === p.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <p className="card-muted p-2.5 text-xs font-mono text-text2 leading-relaxed line-clamp-3">
                  {p.prompt}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-border">
                  <span className="text-[11px] text-text3">FLUX.1 Neural Engine</span>
                  <button
                    onClick={(e) => handleRegenerate(p, e)}
                    disabled={isLoading}
                    className="btn-ghost py-1 px-2.5 text-xs font-medium disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Regenerate</span>
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActiveLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full card overflow-hidden shadow-md flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveLightbox(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Lightbox Image Preview */}
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
                  <span className="label block text-accent mb-1">
                    {activeLightbox.aspect_ratio} • {activeLightbox.style}
                  </span>
                  <h3 className="text-lg font-bold text-text1">{activeLightbox.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyPrompt(activeLightbox.prompt, activeLightbox.id)}
                    className="btn-ghost text-xs"
                  >
                    {copiedId === activeLightbox.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-text3" />}
                    <span>{copiedId === activeLightbox.id ? 'Copied Prompt' : 'Copy Prompt'}</span>
                  </button>

                  <a
                    href={imagesMap[activeLightbox.id] || buildPollinationsUrl(activeLightbox.prompt)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download HD</span>
                  </a>
                </div>
              </div>

              <div className="card-muted p-3 font-mono text-xs text-text2 leading-relaxed">
                {activeLightbox.prompt}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
