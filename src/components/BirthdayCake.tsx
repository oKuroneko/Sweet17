import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, Coffee, Camera, Smile, ArrowLeft } from "lucide-react";

interface BirthdayCakeProps {
  onClose: () => void;
}

export default function BirthdayCake({ onClose }: BirthdayCakeProps) {
  const [candlesLit, setCandlesLit] = useState([true, true, true, true]);
  const [blownOut, setBlownOut] = useState(false);

  const handleBlowCandle = (index: number) => {
    const updated = [...candlesLit];
    updated[index] = false;
    setCandlesLit(updated);

    // Check if all are blown out
    if (updated.every((lit) => !lit)) {
      setBlownOut(true);
    }
  };

  const handleBlowAll = () => {
    setCandlesLit([false, false, false, false]);
    setBlownOut(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-45 bg-pink-950/40 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
      id="birthday-cake-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white/95 rounded-2xl max-w-md w-full shadow-2xl border border-pink-100 p-6 flex flex-col items-center relative text-center"
        id="birthday-cake-card"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-pink-600 hover:text-pink-800 p-2 hover:bg-pink-50 rounded-full transition-all border border-pink-100/50 flex items-center justify-center"
          id="btn-back-cake"
          title="Kembali ke Menu Utama"
        >
          <ArrowLeft size={16} />
        </button>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 transition-colors p-1 text-sm font-semibold"
          id="btn-close-cake-x"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-pink-800 font-serif mt-4 mb-1 flex items-center gap-1.5 justify-center">
          🎂 Kue Ulang Tahun!
        </h3>
        <p className="text-xs text-pink-500 mb-6 font-medium">
          {blownOut ? "Yeay! Tiup lilinnya sukses! 🎉" : "Coba klik lilin-lilinnya untuk ditiup yaa! ✨"}
        </p>

        {/* CSS Interactive Cake Layout */}
        <div className="relative w-48 h-56 flex items-end justify-center select-none mb-6">
          {/* Confetti Explosion (show when blown out) */}
          {blownOut && (
            <div className="absolute inset-x-0 -top-12 -bottom-4 overflow-visible pointer-events-none z-20">
              {Array.from({ length: 30 }).map((_, i) => {
                const randomColor = ["#FF69B4", "#FFD700", "#FF1493", "#87CEFA", "#ADFF2F", "#BA55D3"][i % 6];
                return (
                  <motion.div
                    key={i}
                    initial={{
                      x: 96,
                      y: 80,
                      scale: Math.random() * 0.5 + 0.5,
                      opacity: 1,
                    }}
                    animate={{
                      x: 96 + (Math.random() * 240 - 120),
                      y: 80 + (Math.random() * -200 - 40),
                      opacity: 0,
                      rotate: Math.random() * 360,
                    }}
                    transition={{
                      duration: Math.random() * 1.5 + 1,
                      ease: "easeOut",
                    }}
                    className="absolute w-2.5 h-2.5 rounded-xs"
                    style={{ backgroundColor: randomColor }}
                  />
                );
              })}
            </div>
          )}

          {/* Sparkles (floating when lit) */}
          {!blownOut && (
            <div className="absolute inset-x-0 top-0 h-16 pointer-events-none">
              <motion.div
                animate={{ y: [-5, 5, -5], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute left-6 text-yellow-400"
              >
                <Sparkles size={16} />
              </motion.div>
              <motion.div
                animate={{ y: [5, -5, 5], opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute right-6 text-pink-400"
              >
                <Sparkles size={14} />
              </motion.div>
            </div>
          )}

          {/* The Plate */}
          <div className="absolute bottom-0 w-44 h-4 bg-pink-100 rounded-full border border-pink-200/50 shadow-sm z-0"></div>

          {/* The Cake Base (2 Tiers) */}
          <div className="relative flex flex-col items-center w-full z-10">
            {/* Candles Group */}
            <div className="flex gap-4 mb-[-1px] z-20">
              {candlesLit.map((lit, index) => (
                <div
                  key={index}
                  onClick={() => lit && handleBlowCandle(index)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  {/* The Flame */}
                  <AnimatePresence>
                    {lit ? (
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 0.9, 1.1, 1],
                          y: [0, -1, 0.5, -0.5, 0],
                        }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                        }}
                        exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
                        className="w-2.5 h-5 bg-gradient-to-t from-red-500 via-orange-400 to-yellow-200 rounded-full shadow-lg origin-bottom mb-[-2px]"
                      />
                    ) : (
                      // Puff of smoke when blown out
                      <motion.div
                        initial={{ opacity: 0.8, y: 0, scale: 0.5 }}
                        animate={{ opacity: 0, y: -24, scale: 1.5 }}
                        transition={{ duration: 0.8 }}
                        className="w-4 h-4 bg-gray-300 rounded-full blur-[1px] absolute"
                      />
                    )}
                  </AnimatePresence>
                  {/* Candle Stick */}
                  <div className={`w-1.5 h-10 bg-gradient-to-b ${index % 2 === 0 ? "from-pink-400 to-white" : "from-purple-300 to-white"} rounded-full shadow-sm relative overflow-hidden border border-pink-200/30`}>
                    {/* Candle stripes */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.05)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.05)_50%,rgba(0,0,0,0.05)_75%,transparent_75%,transparent)] bg-[length:10px_10px]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Cake Top Tier */}
            <div className="w-28 h-14 bg-white rounded-t-xl relative border-t-2 border-pink-100 shadow-inner flex flex-col justify-end items-center overflow-hidden">
              {/* Cream dripping */}
              <div className="absolute top-0 inset-x-0 h-4 bg-pink-100 rounded-b-lg flex justify-around">
                <span className="w-3 h-3 bg-pink-100 rounded-full"></span>
                <span className="w-2.5 h-4 bg-pink-100 rounded-full mt-[-2px]"></span>
                <span className="w-3 h-2.5 bg-pink-100 rounded-full"></span>
                <span className="w-2.5 h-3.5 bg-pink-100 rounded-full mt-[-2px]"></span>
                <span className="w-3 h-3 bg-pink-100 rounded-full"></span>
              </div>
              <span className="text-[10px] font-bold text-pink-400 mb-2 font-serif z-10 tracking-widest uppercase">Gisca</span>
            </div>

            {/* Cake Bottom Tier */}
            <div className="w-36 h-20 bg-pink-50 rounded-t-xl relative border-t border-pink-200/40 shadow-sm overflow-hidden">
              {/* Decorative strawberries */}
              <div className="absolute top-2 inset-x-0 flex justify-around px-3">
                <span className="w-3 h-3 bg-red-400 rounded-full drop-shadow-sm"></span>
                <span className="w-3 h-3 bg-red-400 rounded-full drop-shadow-sm"></span>
                <span className="w-3 h-3 bg-red-400 rounded-full drop-shadow-sm"></span>
                <span className="w-3 h-3 bg-red-400 rounded-full drop-shadow-sm"></span>
              </div>
              {/* White cream layer dripping */}
              <div className="absolute top-0 inset-x-0 h-3 bg-white flex justify-around">
                <span className="w-4 h-2 bg-white rounded-full"></span>
                <span className="w-3.5 h-3.5 bg-white rounded-full"></span>
                <span className="w-4 h-2.5 bg-white rounded-full"></span>
                <span className="w-3.5 h-3 bg-white rounded-full"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-pink-50/70 p-5 rounded-2xl border border-pink-100 max-w-sm mb-5"
        >
          <p className="text-pink-800 text-sm font-semibold leading-relaxed">
            "Kue kamu bakal di antar nanti sore yaa, selama menunggu mungkin kita bisa main, jalan2, atau photostudio? 🌸"
          </p>
        </motion.div>

        {/* Quick Fun Ideas / Interaction Choices */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <span className="flex items-center gap-1 bg-white text-[10px] font-bold text-pink-600 px-3 py-1.5 rounded-full border border-pink-100 shadow-2xs">
            <Smile size={12} /> Main Bareng 🎮
          </span>
          <span className="flex items-center gap-1 bg-white text-[10px] font-bold text-pink-600 px-3 py-1.5 rounded-full border border-pink-100 shadow-2xs">
            <Coffee size={12} /> Jalan-Jalan 🚗
          </span>
          <span className="flex items-center gap-1 bg-white text-[10px] font-bold text-pink-600 px-3 py-1.5 rounded-full border border-pink-100 shadow-2xs">
            <Camera size={12} /> Photostudio 📸
          </span>
        </div>

        {!blownOut && (
          <button
            onClick={handleBlowAll}
            className="text-xs bg-pink-100 hover:bg-pink-200 text-pink-700 py-1.5 px-4 rounded-full font-bold transition-all"
            id="btn-blow-all"
          >
            Tiup Semua Sekaligus 💨
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}
