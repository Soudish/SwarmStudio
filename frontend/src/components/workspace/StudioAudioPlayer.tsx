import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Square,
  Volume2,
  VolumeX,
  Headphones,
  Music2,
  Disc,
  Download,
  Wand2,
  Radio,
  Loader2
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

          // Single clean accent gradient in lavender
          const gradient = ctx.createLinearGradient(0, height, 0, 0);
          gradient.addColorStop(0, isDark ? '#4A3BA8' : '#8B7FE8');
          gradient.addColorStop(1, isDark ? '#8B7FE8' : '#6D5BD0');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, height - barHeight, barWidth - 2, barHeight, 2);
          ctx.fill();

          x += barWidth;
        }
      } else {
        ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(10, 10, 11, 0.1)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const sliceWidth = width / 30;
        let x = 0;
        for (let i = 0; i < 30; i++) {
          const y = height / 2 + Math.sin(i * 0.3) * 3;
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

  const currentGeneratedAudio = generatedAudioMap[activeTrackIndex];

  return (
    <div className="card p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-tint text-accent-text flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-text1">Audio Studio</h3>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={handleGenerateRealAudio}
            disabled={isGeneratingAudio}
            className="btn-primary text-xs disabled:opacity-50"
          >
            {isGeneratingAudio ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Generate Audio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Rendered HTML5 Audio Player Card (If rendered) */}
      {currentGeneratedAudio && (
        <div className="card-muted p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music2 className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-text1">
                Rendered Track: <strong className="text-accent">{currentTrackName}</strong>
              </span>
            </div>
            <a
              href={currentGeneratedAudio}
              download={`${currentTrackName.toLowerCase().replace(/\s+/g, '-')}.wav`}
              className="btn-ghost py-1 px-2.5 text-xs font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .WAV</span>
            </a>
          </div>
          <audio
            ref={htmlAudioRef}
            src={currentGeneratedAudio}
            controls
            className="w-full h-9 rounded-xl"
          />
        </div>
      )}

      {/* Visualizer Canvas & In-Browser Procedural Synthesizer */}
      <div className="card-muted p-4 space-y-4">
        <div className="h-14 w-full flex items-center justify-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={600}
            height={56}
            className="w-full h-full max-h-14"
          />
        </div>

        {/* Playback & Volume Control Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSynthPlay}
              className={`btn-primary text-xs ${
                isPlayingSynth ? 'bg-rose-600 hover:bg-rose-500 text-white' : ''
              }`}
            >
              {isPlayingSynth ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play: {currentTrackName}</span>
                </>
              )}
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className="p-1 rounded-lg text-text3 hover:text-text1 transition-colors"
              aria-label="Toggle mute"
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
              className="w-20 sm:w-28 accent-accent cursor-pointer h-1 rounded-lg bg-border"
            />
          </div>
        </div>

        {/* Project Specific Soundtrack Tracks */}
        {tracks.length > 0 && (
          <div className="pt-2 border-t border-border">
            <span className="label block mb-2">Soundtrack Stems</span>
            <div className="flex flex-wrap gap-1.5">
              {tracks.map((t, idx) => {
                const isSelected = activeTrackIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectTrack(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-accent-tint text-accent-text font-semibold'
                        : 'card bg-surface text-text2 hover:text-text1'
                    }`}
                  >
                    <Disc className={`w-3.5 h-3.5 ${isSelected && isPlayingSynth ? 'animate-spin text-accent' : 'text-text3'}`} />
                    <span>{t}</span>
                    {generatedAudioMap[idx] && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" title="Rendered WAV ready" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Interactive SFX Soundboard */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-text3" />
            <span className="label">Scene Foley & SFX Cues ({soundEffects.length})</span>
          </div>
          <span className="text-[11px] text-text3">Click to synthesize cue</span>
        </div>

        {soundEffects.length === 0 ? (
          <div className="card-muted p-6 text-center text-xs text-text3 border-dashed">
            No sound effect cues generated yet for this project.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {soundEffects.map((sfx, idx) => {
              const isActive = activeSFXName === sfx.name;
              return (
                <button
                  key={idx}
                  onClick={() => handleTriggerSFX(sfx)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'border-accent bg-accent-tint scale-[0.99]'
                      : 'border-border bg-surface hover:border-border-hover hover:bg-surface-muted'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-text1 truncate max-w-[170px]">{sfx.name}</span>
                    <span className="pill text-[9px] py-0 px-1.5">{sfx.category}</span>
                  </div>
                  <div className="text-[10px] text-accent font-medium mb-1">{sfx.scene_ref}</div>
                  <p className="text-[11px] text-text3 leading-tight line-clamp-2">{sfx.description}</p>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
