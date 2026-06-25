import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Sparkles, Image as ImageIcon, Calendar, ArrowLeft } from "lucide-react";
import { PhotoSlide } from "../types";
import { DEFAULT_PHOTOS, getMedia } from "./MediaManager";

interface PhotoAlbumProps {
  onClose: () => void;
  mediaTrigger: number; // Increment this to trigger a reload of photos
}

export default function PhotoAlbum({ onClose, mediaTrigger }: PhotoAlbumProps) {
  const [photos, setPhotos] = useState<PhotoSlide[]>(DEFAULT_PHOTOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    async function loadCustomPhotos() {
      const loadedPhotos = await Promise.all(
        DEFAULT_PHOTOS.map(async (defaultPhoto) => {
          try {
            const blob = await getMedia(`photo_${defaultPhoto.id}`);
            if (blob) {
              const url = URL.createObjectURL(blob);
              return { ...defaultPhoto, url };
            }
          } catch (e) {
            console.error("Failed to load image from DB", e);
          }
          return defaultPhoto;
        })
      );
      setPhotos(loadedPhotos);
    }
    loadCustomPhotos();
  }, [mediaTrigger]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
      },
    }),
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const currentPhoto = photos[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-45 bg-pink-950/40 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
      id="photo-album-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white/95 rounded-2xl max-w-lg w-full shadow-2xl border border-pink-100/50 p-6 flex flex-col relative my-8"
        id="photo-album-card"
      >
        {/* Sparkles element */}
        <div className="absolute -top-4 -right-4 text-pink-400 animate-bounce" style={{ animationDuration: "3s" }}>
          <Sparkles size={36} fill="currentColor" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-5 border-b border-pink-50 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-pink-600 hover:text-pink-800 p-2 hover:bg-pink-50 rounded-full transition-all border border-pink-100/50 flex items-center justify-center"
              id="btn-back-album"
              title="Kembali ke Menu Utama"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-pink-800 flex items-center gap-1.5 font-serif">
                <ImageIcon className="text-pink-500" size={18} /> Album Kenangan
              </h3>
              <p className="text-[10px] md:text-xs text-pink-600">Lembaran kisah manis berdua ❤️</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-pink-400 hover:text-pink-600 border border-pink-100 hover:bg-pink-50 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
            id="btn-close-album"
          >
            Tutup Kado 🎁
          </button>
        </div>

        {/* Carousel Viewport */}
        <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-pink-50/50 border border-pink-100/30 flex items-center justify-center group mb-4">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.img
              key={currentPhoto.id}
              src={currentPhoto.url}
              alt={currentPhoto.caption}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full object-cover select-none"
              id={`photo-slide-img-${currentPhoto.id}`}
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 p-2 rounded-full bg-white/80 hover:bg-white text-pink-600 shadow-md hover:scale-105 transition-all z-10 opacity-70 group-hover:opacity-100"
            id="btn-prev-photo"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 p-2 rounded-full bg-white/80 hover:bg-white text-pink-600 shadow-md hover:scale-105 transition-all z-10 opacity-70 group-hover:opacity-100"
            id="btn-next-photo"
          >
            <ChevronRight size={20} />
          </button>

          {/* Slide Indicator counter */}
          <div className="absolute top-3 left-3 bg-black/50 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-xs font-semibold select-none">
            {currentIndex + 1} / {photos.length}
          </div>

          {/* Category Tag */}
          <div className="absolute top-3 right-3 bg-pink-500/80 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-xs font-semibold uppercase tracking-wider select-none">
            {currentPhoto.category}
          </div>
        </div>

        {/* Caption & Date Details */}
        <div className="min-h-24 flex flex-col justify-between">
          <div className="space-y-2">
            {currentPhoto.date && (
              <span className="text-[10px] font-bold text-pink-500 uppercase tracking-widest flex items-center gap-1">
                <Calendar size={10} /> {currentPhoto.date}
              </span>
            )}
            <p className="text-gray-700 text-sm leading-relaxed text-center italic px-2">
              "{currentPhoto.caption}"
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-1.5 mt-4">
            {photos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-6 bg-pink-500" : "w-2 bg-pink-200"}`}
                id={`btn-dot-photo-${idx}`}
              ></button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
