import React, { useEffect, useRef, useState } from "react";
import { Music, Volume2, VolumeX, Play, Pause } from "lucide-react";

// Synthesizer melody representing a gentle romantic lullaby / birthday melody
// Notes structure: { note: string, freq: number, duration: number, delay: number }
interface ToneNote {
  freq: number;
  duration: number; // in seconds
  delay: number; // in seconds
}

// Frequency mapping for notes
const NOTES: { [key: string]: number } = {
  "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.00, "A4": 440.00, "B4": 493.88,
  "C5": 523.25, "D5": 587.33, "E5": 659.25, "F5": 698.46, "G5": 783.99, "A5": 880.00, "B5": 987.77,
  "C6": 1046.50, "Rest": 0
};

// Cute, gentle romantic birthday-inspired melody (Happy Birthday / Romance mashup)
const MELODY: ToneNote[] = [
  // Sweet intro
  { freq: NOTES["G4"], duration: 0.3, delay: 0.0 },
  { freq: NOTES["G4"], duration: 0.3, delay: 0.4 },
  { freq: NOTES["A4"], duration: 0.6, delay: 0.8 },
  { freq: NOTES["G4"], duration: 0.6, delay: 1.4 },
  { freq: NOTES["C5"], duration: 0.6, delay: 2.0 },
  { freq: NOTES["B4"], duration: 1.2, delay: 2.6 },

  { freq: NOTES["G4"], duration: 0.3, delay: 4.0 },
  { freq: NOTES["G4"], duration: 0.3, delay: 4.4 },
  { freq: NOTES["A4"], duration: 0.6, delay: 4.8 },
  { freq: NOTES["G4"], duration: 0.6, delay: 5.4 },
  { freq: NOTES["D5"], duration: 0.6, delay: 6.0 },
  { freq: NOTES["C5"], duration: 1.2, delay: 6.6 },

  { freq: NOTES["G4"], duration: 0.3, delay: 8.0 },
  { freq: NOTES["G4"], duration: 0.3, delay: 8.4 },
  { freq: NOTES["G5"], duration: 0.6, delay: 8.8 },
  { freq: NOTES["E5"], duration: 0.6, delay: 9.4 },
  { freq: NOTES["C5"], duration: 0.6, delay: 10.0 },
  { freq: NOTES["B4"], duration: 0.6, delay: 10.6 },
  { freq: NOTES["A4"], duration: 1.2, delay: 11.2 },

  { freq: NOTES["F5"], duration: 0.3, delay: 12.6 },
  { freq: NOTES["F5"], duration: 0.3, delay: 13.0 },
  { freq: NOTES["E5"], duration: 0.6, delay: 13.4 },
  { freq: NOTES["C5"], duration: 0.6, delay: 14.0 },
  { freq: NOTES["D5"], duration: 0.6, delay: 14.6 },
  { freq: NOTES["C5"], duration: 1.8, delay: 15.2 },
  
  // Romance chord arpeggio block (gentle lullaby bridge)
  { freq: NOTES["E4"], duration: 0.4, delay: 17.5 },
  { freq: NOTES["G4"], duration: 0.4, delay: 18.0 },
  { freq: NOTES["C5"], duration: 0.4, delay: 18.5 },
  { freq: NOTES["E5"], duration: 0.8, delay: 19.0 },
  
  { freq: NOTES["F4"], duration: 0.4, delay: 20.0 },
  { freq: NOTES["A4"], duration: 0.4, delay: 20.5 },
  { freq: NOTES["C5"], duration: 0.4, delay: 21.0 },
  { freq: NOTES["F5"], duration: 0.8, delay: 21.5 },

  { freq: NOTES["G4"], duration: 0.4, delay: 22.5 },
  { freq: NOTES["B4"], duration: 0.4, delay: 23.0 },
  { freq: NOTES["D5"], duration: 0.4, delay: 23.5 },
  { freq: NOTES["G5"], duration: 1.2, delay: 24.0 },
];

interface MusicPlayerProps {
  shouldPlay?: boolean;
}

export default function MusicPlayer({ shouldPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playTimeoutIdsRef = useRef<number[]>([]);
  const nextLoopTimeoutIdRef = useRef<number | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // Keep ref in sync to avoid stale closure in timeouts
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Synchronize with parent play instruction
  useEffect(() => {
    if (shouldPlay) {
      initAudio();
      if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      setIsPlaying(true);
    }
  }, [shouldPlay]);

  const initAudio = () => {
    if (!audioCtxRef.current) {
      // Create audio context
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
      
      // Create master gain node
      const masterGain = audioCtxRef.current.createGain();
      masterGain.gain.setValueAtTime(0.15, audioCtxRef.current.currentTime); // Low background volume
      masterGain.connect(audioCtxRef.current.destination);
      masterGainRef.current = masterGain;
    }
  };

  const playTone = (freq: number, duration: number, startTime: number) => {
    if (!audioCtxRef.current || !masterGainRef.current || freq === 0) return;

    const ctx = audioCtxRef.current;
    
    // Create oscillator node (triangle wave gives a sweet, soft music box vibe)
    const osc = ctx.createOscillator();
    const subOsc = ctx.createOscillator(); // Sub-oscillator for warmer tone
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();

    // Set properties
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, startTime);
    
    subOsc.type = "sine";
    subOsc.frequency.setValueAtTime(freq / 2, startTime); // One octave down for warmth

    // Filter to soften the high notes (Lowpass filter)
    filterNode.type = "lowpass";
    filterNode.frequency.setValueAtTime(800, startTime);

    // Envelope for soft attack and beautiful release
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.05); // quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // decay and release

    // Connect nodes
    osc.connect(filterNode);
    subOsc.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(masterGainRef.current);

    // Start and stop
    osc.start(startTime);
    subOsc.start(startTime);
    osc.stop(startTime + duration);
    subOsc.stop(startTime + duration);
  };

  const playMelody = () => {
    if (!audioCtxRef.current) return;
    
    // Clear existing schedules
    playTimeoutIdsRef.current.forEach(id => window.clearTimeout(id));
    playTimeoutIdsRef.current = [];
    if (nextLoopTimeoutIdRef.current) {
      window.clearTimeout(nextLoopTimeoutIdRef.current);
    }

    const now = audioCtxRef.current.currentTime;
    const totalDuration = 26.5; // loop length in seconds

    // Schedule each note
    MELODY.forEach((note) => {
      // Play on synth
      playTone(note.freq, note.duration, now + note.delay);
    });

    // Schedule next loop
    const nextLoopId = window.setTimeout(() => {
      if (isPlayingRef.current) {
        playMelody();
      }
    }, totalDuration * 1000);
    nextLoopTimeoutIdRef.current = nextLoopId;
  };

  const togglePlayback = () => {
    initAudio();
    
    if (audioCtxRef.current?.state === "suspended") {
      audioCtxRef.current.resume();
    }

    if (isPlaying) {
      // Stop playback
      playTimeoutIdsRef.current.forEach(id => window.clearTimeout(id));
      playTimeoutIdsRef.current = [];
      if (nextLoopTimeoutIdRef.current) {
        window.clearTimeout(nextLoopTimeoutIdRef.current);
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      playMelody();
    } else {
      // Clear scheduling when paused
      playTimeoutIdsRef.current.forEach(id => window.clearTimeout(id));
      playTimeoutIdsRef.current = [];
      if (nextLoopTimeoutIdRef.current) {
        window.clearTimeout(nextLoopTimeoutIdRef.current);
      }
    }
    return () => {
      playTimeoutIdsRef.current.forEach(id => window.clearTimeout(id));
      if (nextLoopTimeoutIdRef.current) {
        window.clearTimeout(nextLoopTimeoutIdRef.current);
      }
    };
  }, [isPlaying]);

  const toggleMute = () => {
    if (!masterGainRef.current) return;
    const currentMute = !muted;
    setMuted(currentMute);
    masterGainRef.current.gain.setValueAtTime(currentMute ? 0 : 0.15, audioCtxRef.current?.currentTime || 0);
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-pink-100"
      id="music-player-container"
    >
      {/* Playing state visualizer bars */}
      {isPlaying && !muted && (
        <div className="flex items-end gap-[2px] h-3 w-4 mr-1">
          <span className="w-[3px] bg-pink-400 rounded-full animate-pulse h-1" style={{ animationDuration: "0.6s" }}></span>
          <span className="w-[3px] bg-pink-400 rounded-full animate-pulse h-3" style={{ animationDuration: "0.8s", animationDelay: "0.15s" }}></span>
          <span className="w-[3px] bg-pink-400 rounded-full animate-pulse h-2" style={{ animationDuration: "0.5s", animationDelay: "0.3s" }}></span>
        </div>
      )}
      
      <span className="text-xs font-medium text-pink-700 select-none mr-1">
        {isPlaying ? "Melodi Gisca 🌸" : "Putar Musik ✨"}
      </span>

      <button
        onClick={togglePlayback}
        className="p-1.5 rounded-full hover:bg-pink-50 text-pink-600 transition-colors"
        title={isPlaying ? "Pause" : "Play"}
        id="btn-play-music"
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>

      {isPlaying && (
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-full hover:bg-pink-50 text-pink-600 transition-colors"
          title={muted ? "Unmute" : "Mute"}
          id="btn-mute-music"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}
    </div>
  );
}
