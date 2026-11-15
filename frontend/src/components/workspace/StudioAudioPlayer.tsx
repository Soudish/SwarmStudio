import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Square,
  Volume2,
  VolumeX,
  Headphones,
  Sliders,
  Sparkles,
  Radio,
  Music2,
  Disc,
  Download,
  RefreshCw,
  Wand2
} from 'lucide-react';
import { dynamicAudioSynthesizer } from '../../services/audioSynthesizer';
import { SoundEffect } from '../../types';
import { api } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

interface StudioAudioPlayerProps {
  projectTitle?: string;
  genre?: string;
  tone?: string;
  projectType?: string;
  scoreDirection?: string;
  tempoAndInstruments?: string;
  tracks?: string[];
  soundEffects?: SoundEffect[];
}

export const StudioAudioPlayer: React.FC<StudioAudioPlayerProps> = ({
  projectTitle,
  genre = 'Cinematic',
  tone = 'Atmospheric',
  projectType = 'film',
  scoreDirection,
  tempoAndInstruments,
  tracks = [],
  soundEffects = []
}) => {
  const { isDark } = useTheme();
  const [isPlayingSynth, setIsPlayingSynth] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSFXName, setActiveSFXName] = useState<string | null>(null);

  // Rendered Audio files map (track index -> audio URL)
  const [generatedAudioMap, setGeneratedAudioMap] = useState<Record<number, string>>({});
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const htmlAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrackName = tracks.length > 0 ? tracks[activeTrackIndex] : 'Main Studio Theme';

  const getAudioProfile = (trackIdx: number) => ({
    genre,
    tone,
    projectType,
    tempoAndInstruments,
    trackName: tracks[trackIdx] || currentTrackName,
    trackIndex: trackIdx
  });

  // Toggle in-browser synthesizer
  const handleToggleSynthPlay = () => {
    if (isPlayingSynth) {
      dynamicAudioSynthesizer.stop();
      setIsPlayingSynth(false);
    } else {
      // Pause HTML audio if playing
      if (htmlAudioRef.current && !htmlAudioRef.current.paused) {
        htmlAudioRef.current.pause();
      }
      dynamicAudioSynthesizer.play(getAudioProfile(activeTrackIndex));
      setIsPlayingSynth(true);
    }
  };

  const handleSelectTrack = (idx: number) => {
    setActiveTrackIndex(idx);
    if (isPlayingSynth) {
      dynamicAudioSynthesizer.play(getAudioProfile(idx));
    }
  };

  const handleGenerateRealAudio = async () => {
    try {
      setIsGeneratingAudio(true);
      const prompt = `${currentTrackName}. ${scoreDirection || ''}. ${tempoAndInstruments || ''}`;
      const res = await api.generateMusic(prompt, 15, genre);
      const audioUrl = api.getAudioUrl(res.url);

      setGeneratedAudioMap((prev) => ({ ...prev, [activeTrackIndex]: audioUrl }));

      // Automatically play the rendered audio
      if (isPlayingSynth) {
        dynamicAudioSynthesizer.stop();
        setIsPlayingSynth(false);
      }
      setTimeout(() => {
        if (htmlAudioRef.current) {
          htmlAudioRef.current.src = audioUrl;
          htmlAudioRef.current.play().catch(() => {});
        }
      }, 100);
    } catch (e) {
      console.error('Audio generation error:', e);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    if (isMuted && newVal > 0) setIsMuted(false);
    dynamicAudioSynthesizer.setVolume(newVal);
    if (htmlAudioRef.current) {
      htmlAudioRef.current.volume = newVal;
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      dynamicAudioSynthesizer.setVolume(volume);
      if (htmlAudioRef.current) htmlAudioRef.current.volume = volume;
    } else {
      setIsMuted(true);
      dynamicAudioSynthesizer.setVolume(0);
      if (htmlAudioRef.current) htmlAudioRef.current.volume = 0;
    }
  };

  const handleTriggerSFX = (sfx: SoundEffect) => {
    dynamicAudioSynthesizer.playCustomSFX(sfx);
    setActiveSFXName(sfx.name);
    setTimeout(() => setActiveSFXName(null), 400);
  };

  // Canvas visualizer render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderVisualizer = () => {
      animationFrameRef.current = requestAnimationFrame(renderVisualizer);

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const analyser = dynamicAudioSynthesizer.getAnalyser();

      if (isPlayingSynth && analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 2.2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height;

          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          gradient.addColorStop(0, '#7E22CE');
          gradient.addColorStop(0.5, '#A855F7');
          gradient.addColorStop(1, '#06B6D4');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, height - barHeight, barWidth - 2, barHeight, 2);
          ctx.fill();

          x += barWidth;
        }
      } else {
        ctx.strokeStyle = isDark ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const sliceWidth = width / 30;
        let x = 0;
        for (let i = 0; i < 30; i++) {
          const y = height / 2 + Math.sin(i * 0.3) * 4;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }
        ctx.stroke();
      }
    };

    renderVisualizer();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlayingSynth, isDark]);

  useEffect(() => {
    return () => {
      dynamicAudioSynthesizer.stop();
    };
  }, []);

  const cardBg = isDark ? 'bg-[#0F1626]' : 'bg-white';
  const cardBorder = isDark ? 'border-purple-500/25 shadow-purple-950/40' : 'border-purple-200 shadow-md';
  const textPrimary = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';

  const currentGeneratedAudio = generatedAudioMap[activeTrackIndex];

  return (
    <div className={`p-6 rounded-3xl border shadow-xl space-y-6 ${cardBg} ${cardBorder}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-600/20">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-bold tracking-tight ${textPrimary}`}>
                Meta MusicGen Soundtrack & Audio Engine
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                AI Audio Active
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${textMuted}`}>
              Full audio generation pipeline: synthesize ambient streams or render master 16-bit .WAV tracks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateRealAudio}
            disabled={isGeneratingAudio}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-900/30 transition-all disabled:opacity-50"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isGeneratingAudio ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAudio ? 'Synthesizing Track...' : 'Generate .WAV Track'}</span>
          </button>
        </div>
      </div>

      {/* Real Generated HTML5 Audio Player Card (If rendered) */}
      {currentGeneratedAudio && (
        <div className={`p-4 rounded-2xl border space-y-2 ${
          isDark ? 'bg-purple-950/20 border-purple-500/30' : 'bg-purple-50 border-purple-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music2 className="w-4 h-4 text-purple-500" />
              <span className={`text-xs font-bold ${textPrimary}`}>
                Rendered Audio: <strong className="text-purple-400">{currentTrackName}</strong>
              </span>
            </div>
            <a
              href={currentGeneratedAudio}
              download={`${currentTrackName.toLowerCase().replace(/\s+/g, '-')}.wav`}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .WAV</span>
            </a>
          </div>
          <audio
            ref={htmlAudioRef}
            src={currentGeneratedAudio}
            controls
            className="w-full h-10 rounded-xl"
          />
        </div>
      )}

      {/* Visualizer Canvas & In-Browser Procedural Synthesizer */}
      <div className={`p-4 rounded-2xl border space-y-4 ${
        isDark ? 'bg-slate-950 border-slate-900' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="h-14 w-full flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={56}
            className="w-full h-full max-h-14"
          />
        </div>

        {/* Playback & Volume Control Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/40">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSynthPlay}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white transition-all shadow-md ${
                isPlayingSynth
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/30'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-900/30'
              }`}
            >
              {isPlayingSynth ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop Stream</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Stream Atmosphere: {currentTrackName}</span>
                </>
              )}
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className={`p-1.5 rounded-lg ${textMuted} hover:${textPrimary}`}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 sm:w-28 accent-purple-600 cursor-pointer h-1.5 rounded-lg bg-slate-700"
            />
          </div>
        </div>

        {/* Project Specific Soundtrack Tracks */}
        {tracks.length > 0 && (
          <div className="pt-2 border-t border-slate-800/40">
            <span className={`text-[11px] font-bold uppercase tracking-wider block mb-2 ${textMuted}`}>
              Project Production Tracks:
            </span>
            <div className="flex flex-wrap gap-2">
              {tracks.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectTrack(idx)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTrackIndex === idx
                      ? 'bg-purple-600 text-white shadow-md'
                      : isDark
                      ? 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Disc className={`w-3.5 h-3.5 ${activeTrackIndex === idx && isPlayingSynth ? 'animate-spin text-purple-200' : 'text-purple-400'}`} />
                  <span>{t}</span>
                  {generatedAudioMap[idx] && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1" title="Rendered WAV Ready" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Story-Specific SFX Soundboard */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${textMuted}`}>
            <Radio className="w-3.5 h-3.5 text-purple-500" />
            <span>Interactive Scene SFX & Foley Soundboard ({soundEffects.length} Cues)</span>
          </span>
          <span className="text-[11px] text-purple-500 font-semibold">Click any effect to synthesize Foley cue</span>
        </div>

        {soundEffects.length === 0 ? (
          <div className={`p-6 text-center text-xs rounded-xl border border-dashed ${textMuted} ${cardBorder}`}>
            No sound effect cues generated yet for this project.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {soundEffects.map((sfx, idx) => {
              const isActive = activeSFXName === sfx.name;
              return (
                <button
                  key={idx}
                  onClick={() => handleTriggerSFX(sfx)}
                  className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                    isActive
                      ? 'border-purple-400 bg-purple-600/20 scale-[0.98]'
                      : isDark
                      ? 'bg-slate-900/60 border-slate-800 hover:border-purple-500/40 hover:bg-slate-900'
                      : 'bg-slate-50 border-slate-200 hover:border-purple-300 hover:bg-purple-50/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold text-xs truncate max-w-[180px] ${textPrimary}`}>{sfx.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {sfx.category}
                    </span>
                  </div>
                  <div className="text-[10px] text-purple-400 font-semibold mb-1">{sfx.scene_ref}</div>
                  <p className={`text-[11px] leading-tight line-clamp-2 ${textMuted}`}>{sfx.description}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
