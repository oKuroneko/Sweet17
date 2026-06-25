import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Play, Pause, RefreshCw, Upload, Heart, Sparkles, Video as VideoIcon } from "lucide-react";
import { getMedia, setMedia } from "./MediaManager";

interface VideoSectionProps {
  mediaTrigger: number;
  onMediaChanged: () => void;
}

export default function VideoSection({ mediaTrigger, onMediaChanged }: VideoSectionProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    async function loadVideo() {
      setIsLoading(true);
      try {
        const blob = await getMedia("closing_video");
        if (blob) {
          // Clean up old URL
          if (videoUrl) {
            URL.revokeObjectURL(videoUrl);
          }
          const url = URL.createObjectURL(blob);
          setVideoUrl(url);
        } else {
          setVideoUrl(null);
        }
      } catch (e) {
        console.error("Failed to load video from DB", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadVideo();

    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [mediaTrigger]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    try {
      await setMedia("closing_video", file);
      onMediaChanged();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Error playing video:", err);
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8" id="video-section-wrapper">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-pink-800 font-serif flex items-center gap-2 justify-center">
          <Heart className="text-pink-500 fill-pink-500 animate-pulse" size={24} /> Video Spesial Gisca ❤️
        </h3>
        <p className="text-xs text-pink-600 mt-1.5 max-w-md mx-auto">
          Momen berharga, benang merah takdir, dan kisah cinta manis yang tak lekang oleh waktu.
        </p>
      </div>

      {/* Cinematic Frame */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-pink-950/25 border-4 border-white/90 shadow-2xl flex flex-col items-center justify-center group">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 text-pink-300">
            <RefreshCw className="animate-spin" size={32} />
            <span className="text-xs font-medium">Memuat video cinta...</span>
          </div>
        ) : videoUrl ? (
          // The Video Element
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              loop
              playsInline
              onClick={handlePlayToggle}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Play/Pause Overlay Button */}
            <div
              onClick={handlePlayToggle}
              className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 cursor-pointer ${isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"}`}
            >
              <div className="p-4 bg-white/90 rounded-full text-pink-600 shadow-lg transform hover:scale-110 transition-transform">
                {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </div>
            </div>
          </div>
        ) : (
          // Elegant placeholder with upload interface
          <div className="p-8 text-center max-w-md flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-pink-100/10 border border-white/20 flex items-center justify-center text-white/80 relative">
              <VideoIcon size={28} className="animate-bounce" style={{ animationDuration: "3s" }} />
              <div className="absolute -bottom-1 -right-1 text-pink-400">
                <Sparkles size={16} />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <h4 className="text-sm font-bold text-white tracking-wide">Video "Red String Theory" Belum Diunggah</h4>
              <p className="text-xs text-pink-200/80 leading-relaxed">
                Silakan pilih file video MP4 yang diunggah di chat untuk memutarnya langsung di pemutar sinematik ini.
              </p>
            </div>

            <label className="cursor-pointer bg-white hover:bg-pink-50 text-pink-700 py-2.5 px-5 rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-1.5">
              <Upload size={14} />
              Unggah Video Kamu (MP4)
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleVideoUpload}
              />
            </label>
          </div>
        )}

        {/* Decorative Torii Pagoda corners */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-pink-400/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-pink-400/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-pink-400/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-pink-400/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
    </div>
  );
}
