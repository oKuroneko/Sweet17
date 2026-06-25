import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Gift, Cake, MessageCircleHeart, ArrowDown, Share2, Upload } from "lucide-react";

import FallingHearts from "./components/FallingHearts";
import MusicPlayer from "./components/MusicPlayer";
import PhotoAlbum from "./components/PhotoAlbum";
import BirthdayCake from "./components/BirthdayCake";
import ApologyLetter from "./components/ApologyLetter";
import MediaManager from "./components/MediaManager";
import VideoSection from "./components/VideoSection";

export default function App() {
  const [hasOpened, setHasOpened] = useState(false);
  const [activeModal, setActiveModal] = useState<"album" | "cake" | "letter" | null>(null);
  const [mediaTrigger, setMediaTrigger] = useState<number>(0);

  const handleMediaChanged = () => {
    setMediaTrigger(prev => prev + 1);
  };

  // Traditional Japanese Cloud SVG Pattern to inject as background
  const japaneseCloudBg = `data:image/svg+xml;utf8,<svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 50C15 50 10 46 10 40C10 34 16 30 22 31C24 25 29 20 36 20C44 20 50 26 51 32C55 30 60 30 63 34C66 38 65 44 60 48C57 50 23 50 20 50Z" stroke="%23ffd1dc" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.45"/><path d="M80 30C76 30 72 27 72 22C72 17 77 14 82 15C84 10 88 6 94 6C101 6 106 11 107 16C110 14 114 14 117 17C120 20 119 25 115 28C112 30 83 30 80 30Z" stroke="%23ffd1dc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.35"/><path d="M50 72C47 72 44 69 44 65C44 61 48 59 52 60C53 56 56 53 61 53C66 53 70 57 71 61C73 59 76 59 78 61C80 63 79 67 76 69C74 72 52 72 50 72Z" stroke="%23ffd1dc" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.3"/></svg>`;

  return (
    <div
      className="min-h-screen relative bg-gradient-to-tr from-[#FFF0F5] via-white to-[#FFE4E1] flex flex-col justify-between overflow-x-hidden text-gray-800"
      style={{
        backgroundImage: `url('${japaneseCloudBg}')`,
        backgroundSize: "240px 160px",
      }}
      id="main-birthday-container"
    >
      {/* Interactive Background & Music */}
      <FallingHearts />
      <MusicPlayer shouldPlay={hasOpened} />
      <MediaManager onMediaChanged={handleMediaChanged} />

      {/* Welcome Splash Screen */}
      <AnimatePresence>
        {!hasOpened && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-gradient-to-tr from-[#FFF0F5] via-white to-[#FFE4E1] flex flex-col items-center justify-center p-6 text-center select-none"
            style={{
              backgroundImage: `url('${japaneseCloudBg}')`,
              backgroundSize: "240px 160px",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-pink-100 shadow-2xl space-y-6 flex flex-col items-center relative overflow-hidden"
            >
              {/* Decorative top border */}
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300" />
              
              <div className="absolute -top-4 -right-4 text-pink-300 animate-pulse">
                <Sparkles size={40} />
              </div>

              {/* Envelope visual icon with pulsating heart */}
              <div className="relative">
                <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center border-2 border-pink-100 shadow-inner">
                  <Gift className="text-pink-500 animate-bounce" size={36} style={{ animationDuration: "3s" }} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                  <Heart className="text-white fill-current animate-pulse" size={16} />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-extrabold text-pink-700 font-serif tracking-tight">
                  Kado Ulang Tahun Untuk Kamu 🌸
                </h2>
                <p className="text-xs text-pink-500 font-bold uppercase tracking-widest font-mono">
                  Sweet Seventeen yaaa
                </p>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed max-w-xs italic">
                "Sebuah halaman kecil penuh kejutan dan untaian melodi indah yang dirancang khusus untuk hari bahagiamu..."
              </p>

              <button
                onClick={() => setHasOpened(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                id="btn-open-splash"
              >
                Buka Halaman & Putar Musik 🎵✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Section */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-5 py-12 flex flex-col items-center justify-center relative z-20 space-y-12">
        
        {/* Header Hero Area */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="inline-block relative"
          >
            {/* Crown or flower decorative element */}
            <div className="absolute -top-6 inset-x-0 flex justify-center text-pink-400">
              <Sparkles size={24} className="animate-spin" style={{ animationDuration: "6s" }} />
            </div>
            
            <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center border-4 border-pink-200/50 shadow-xl relative group">
              <Heart className="text-pink-500 fill-pink-500 group-hover:scale-110 transition-transform duration-300" size={48} />
              <span className="absolute text-[11px] font-bold text-white font-mono">17th</span>
            </div>
          </motion.div>

          <div className="space-y-2">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold text-pink-700 tracking-tight font-serif drop-shadow-xs"
              id="title-gisca"
            >
              Sweet Seventeen Gisca!! 🌸
            </motion.h1>
            
            <motion.p
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xs md:text-sm font-semibold text-pink-500 uppercase tracking-widest font-mono"
            >
              Selamat Ulang Tahun yang ke-17, Cantikkuuu, maniskuuu, imutkuuuu! ✨
            </motion.p>
          </div>
        </div>

        {/* Wishes and Doa Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-pink-100/60 shadow-xl relative w-full text-center space-y-4 overflow-hidden group hover:shadow-2xl transition-all duration-500"
          id="wishes-card"
        >
          {/* Decorative cherry blossom petals style details */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-100 to-transparent rounded-tr-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-100 to-transparent rounded-bl-2xl pointer-events-none"></div>

          <h3 className="text-lg font-bold text-pink-800 font-serif flex items-center justify-center gap-1.5">
            Wish you aree!!
          </h3>

          <div className="space-y-4 text-sm md:text-base leading-relaxed text-gray-700 italic font-sans max-w-lg mx-auto">
            <p>
              "Semoga di usiamu yang ke-17 ini, langkah-langkahmu selalu dipenuhi kebahagiaan, kemudahan, dan keberkahan. Semoga semua impian besar dan harapan indah yang kamu semogakan, dikabulkan oleh Allah SWT."
            </p>
            <p>
              "Tetaplah tumbuh menjadi Gisca yang ceria, penuh kasih sayang, dan selalu bersinar. Thanks for sweet color you give to my life."
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-300"></span>
            <span className="w-12 h-1.5 rounded-full bg-pink-300"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-pink-300"></span>
          </div>
        </motion.div>

        {/* Floating Scroll Indicator */}
        <div className="flex flex-col items-center gap-1.5 text-pink-400 text-xs animate-bounce" style={{ animationDuration: "2.5s" }}>
          <span>Sentuh Kado & Lihat Bawah</span>
          <ArrowDown size={14} />
        </div>

        {/* Action / Interaction Buttons Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full" id="interactive-actions-grid">
          {/* Button 1: Digital Gift Album */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveModal("album")}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white p-5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-2.5 text-center group border border-pink-400/20"
            id="btn-trigger-album"
          >
            <div className="p-3 bg-white/20 rounded-full group-hover:rotate-12 transition-transform">
              <Gift size={24} />
            </div>
            <div>
              <span className="block font-bold text-sm tracking-wide">Buka Kado 🎁</span>
              <span className="text-[10px] text-pink-100 block mt-0.5 font-medium">Buka Album Foto Kenangan Kita</span>
            </div>
          </motion.button>

          {/* Button 2: Interactive Cake Info */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveModal("cake")}
            className="bg-white hover:bg-pink-50 text-pink-700 p-5 rounded-2xl shadow-md hover:shadow-xl border border-pink-100 transition-all duration-300 flex flex-col items-center gap-2.5 text-center group"
            id="btn-trigger-cake"
          >
            <div className="p-3 bg-pink-50 rounded-full group-hover:scale-110 transition-transform">
              <Cake size={24} className="text-pink-600" />
            </div>
            <div>
              <span className="block font-bold text-sm tracking-wide text-pink-800">Kue Spesial Untukmu 🎂</span>
              <span className="text-[10px] text-pink-500 block mt-0.5 font-medium">Kue kamu bakal diantar nanti soree!</span>
            </div>
          </motion.button>

          {/* Button 3: Heartfelt Apology Letter */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveModal("letter")}
            className="bg-white hover:bg-pink-50 text-pink-700 p-5 rounded-2xl shadow-md hover:shadow-xl border border-pink-100 transition-all duration-300 flex flex-col items-center gap-2.5 text-center group"
            id="btn-trigger-letter"
          >
            <div className="p-3 bg-pink-50 rounded-full group-hover:animate-pulse">
              <MessageCircleHeart size={24} className="text-pink-600" />
            </div>
            <div>
              <span className="block font-bold text-sm tracking-wide text-pink-800">Surat Kecil 💌</span>
              <span className="text-[10px] text-pink-500 block mt-0.5 font-medium">But sorry :(</span>
            </div>
          </motion.button>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center justify-center gap-3 py-4">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-pink-200"></span>
          <Heart className="text-pink-300 fill-pink-100" size={14} />
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-pink-200"></span>
        </div>

        {/* Closing Video Section */}
        <VideoSection mediaTrigger={mediaTrigger} onMediaChanged={handleMediaChanged} />

      </main>

      {/* Footer copyright */}
      <footer className="py-6 text-center text-[11px] text-pink-500/80 font-mono tracking-widest relative z-20 border-t border-pink-100/30 bg-white/10">
        Created with ❤️ especially for Gisca's 17th Birthday • 2026
      </footer>

      {/* Modals & Slide-overs Layer */}
      <AnimatePresence>
        {activeModal === "album" && (
          <PhotoAlbum onClose={() => setActiveModal(null)} mediaTrigger={mediaTrigger} />
        )}
        {activeModal === "cake" && (
          <BirthdayCake onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "letter" && (
          <ApologyLetter onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
