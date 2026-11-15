import os
import wave
import struct
import math
import hashlib
import urllib.request
import json
from typing import Optional

AUDIO_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

class MusicGenService:
    @staticmethod
    def _generate_procedural_wav(file_path: str, prompt: str, duration: int = 15, genre: str = "cinematic"):
        """
        Synthesizes a real 44.1kHz 16-bit stereo PCM .WAV audio file
        composed dynamically to match the genre and prompt.
        Zero dependencies (uses standard python wave and struct).
        """
        sample_rate = 44100
        total_samples = int(sample_rate * duration)
        
        # Derive key frequencies from prompt hash
        hash_val = abs(int(hashlib.md5(f"{prompt}_{genre}".encode()).hexdigest(), 16))
        
        # Base chords based on genre
        genre_lower = genre.lower()
        if "cyber" in genre_lower or "sci-fi" in genre_lower:
            chords = [
                [55.0, 110.0, 164.81, 220.0],     # A minor / sub-bass
                [48.99, 97.99, 146.83, 196.0],    # G
                [65.41, 130.81, 196.0, 261.63],   # C
                [55.0, 110.0, 146.83, 220.0]      # Sus4
            ]
        elif "mystery" in genre_lower or "noir" in genre_lower or "horror" in genre_lower:
            chords = [
                [65.41, 98.0, 155.56, 196.0],     # C min 7
                [58.27, 87.31, 138.59, 174.61],   # Bb
                [65.41, 116.54, 155.56, 233.08],  # Suspense
                [49.0, 98.0, 146.83, 196.0]       # Low G
            ]
        elif "fantasy" in genre_lower or "adventure" in genre_lower:
            chords = [
                [65.41, 130.81, 196.0, 293.66],   # C add9
                [87.31, 130.81, 174.61, 261.63],  # F
                [73.42, 110.0, 164.81, 220.0],    # D min
                [98.0, 146.83, 196.0, 293.66]     # G maj
            ]
        else:
            chords = [
                [65.41, 130.81, 196.0, 261.63],
                [58.27, 116.54, 174.61, 233.08],
                [73.42, 110.0, 146.83, 220.0],
                [65.41, 130.81, 196.0, 261.63]
            ]
            
        chord_duration = duration / len(chords)
        
        with wave.open(file_path, "wb") as wav_file:
            wav_file.setnchannels(2)      # Stereo
            wav_file.setsampwidth(2)      # 16-bit
            wav_file.setframerate(sample_rate)
            
            frames = bytearray()
            
            for s in range(total_samples):
                t = s / sample_rate
                
                # Active chord
                chord_idx = min(int(t / chord_duration), len(chords) - 1)
                active_chord = chords[chord_idx]
                chord_local_t = t - (chord_idx * chord_duration)
                
                # Smooth envelope (fade in and fade out per chord)
                envelope = math.sin(math.pi * (chord_local_t / chord_duration)) ** 0.8
                
                # Global track fade in / out
                global_fade = min(1.0, t / 1.5) * min(1.0, (duration - t) / 1.5)
                
                # Synthesize harmonic tones
                left_sample = 0.0
                right_sample = 0.0
                
                for i, freq in enumerate(active_chord):
                    # Slight detuning for analog chorus width
                    detune = (i - 1.5) * 0.35
                    
                    # LFO vibrato
                    vibrato = math.sin(2 * math.pi * 0.25 * t) * 1.2
                    
                    # Oscillator sample
                    phase_l = 2 * math.pi * (freq + detune + vibrato) * t
                    phase_r = 2 * math.pi * (freq - detune - vibrato) * t
                    
                    amp = (0.28 / (i + 1)) * envelope * global_fade
                    left_sample += math.sin(phase_l) * amp
                    right_sample += math.sin(phase_r) * amp
                
                # Add subtle atmospheric rain/vinyl crackle
                noise = (hash_val % 1000 - 500) / 50000.0
                hash_val = (hash_val * 1103515245 + 12345) & 0x7FFFFFFF
                
                left_sample += noise * 0.08 * global_fade
                right_sample += noise * 0.08 * global_fade
                
                # Clamp to 16-bit range
                clamped_l = max(-1.0, min(1.0, left_sample))
                clamped_r = max(-1.0, min(1.0, right_sample))
                
                int_l = int(clamped_l * 32767)
                int_r = int(clamped_r * 32767)
                
                frames.extend(struct.pack("<hh", int_l, int_r))
                
            wav_file.writeframes(frames)

    @staticmethod
    def generate_music_track(prompt: str, duration: int = 15, genre: str = "cinematic", hf_token: Optional[str] = None) -> dict:
        """
        Generates a 15-second musical track.
        Attempts free Meta MusicGen inference if configured,
        with an immediate procedural stereo WAV synthesis fallback.
        """
        track_hash = hashlib.md5(f"{prompt}_{genre}_{duration}".encode()).hexdigest()
        file_name = f"track_{track_hash}.wav"
        file_path = os.path.join(AUDIO_DIR, file_name)
        
        # 1. Return cached file if it exists
        if os.path.exists(file_path) and os.path.getsize(file_path) > 1024:
            return {
                "track_id": track_hash,
                "url": f"/api/media/audio/{file_name}",
                "duration": duration,
                "cached": True,
                "provider": "musicgen_cached"
            }
            
        # 2. Attempt Free HuggingFace Meta MusicGen Inference if token available
        token = hf_token or os.environ.get("HUGGINGFACE_API_TOKEN")
        if token:
            try:
                api_url = "https://api-inference.huggingface.co/models/facebook/musicgen-small"
                headers = {"Authorization": f"Bearer {token}", "User-Agent": "SwarmStudio/1.0"}
                data = json.dumps({"inputs": f"{genre} cinematic soundtrack, {prompt}"}).encode("utf-8")
                
                req = urllib.request.Request(api_url, data=data, headers=headers)
                with urllib.request.urlopen(req, timeout=18) as resp:
                    if resp.status == 200:
                        audio_data = resp.read()
                        with open(file_path, "wb") as f:
                            f.write(audio_data)
                        return {
                            "track_id": track_hash,
                            "url": f"/api/media/audio/{file_name}",
                            "duration": duration,
                            "cached": False,
                            "provider": "meta_musicgen_hf"
                        }
            except Exception as e:
                print(f"[MusicGenService] Free cloud inference skipped ({e}). Using stereo synthesis.")

        # 3. Procedural Stereo Audio Synthesis (guaranteed $0, 100% offline, immediate)
        MusicGenService._generate_procedural_wav(file_path, prompt, duration=duration, genre=genre)
        
        return {
            "track_id": track_hash,
            "url": f"/api/media/audio/{file_name}",
            "duration": duration,
            "cached": False,
            "provider": "swarm_musicgen_synthesizer"
        }

music_service = MusicGenService()
