import React from "react";
import { motion } from "motion/react";
import { Heart, Sparkles, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";

interface ApologyLetterProps {
  onClose: () => void;
}

export default function ApologyLetter({ onClose }: ApologyLetterProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-45 bg-pink-950/40 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
      id="apology-letter-overlay"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-stone-50 rounded-2xl max-w-md w-full shadow-2xl border-2 border-double border-pink-100 p-6 flex flex-col relative"
        id="apology-letter-card"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-pink-600 hover:text-pink-800 p-2 hover:bg-pink-50 rounded-full transition-all border border-pink-100/50 flex items-center justify-center"
          id="btn-back-letter"
          title="Kembali ke Menu Utama"
        >
          <ArrowLeft size={16} />
        </button>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-pink-600 transition-colors p-1"
          id="btn-close-letter-x"
        >
          ✕
        </button>

        {/* Vintage Parchment Aesthetic Top Border */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-pink-200 via-pink-300 to-pink-200 rounded-t-xl" />

        <div className="flex flex-col items-center text-center mt-3">
          <div className="w-12 h-12 bg-pink-100/70 rounded-full flex items-center justify-center text-pink-500 mb-3 animate-pulse">
            <Heart size={24} fill="currentColor" />
          </div>
          
          <h3 className="text-xl font-bold text-pink-800 font-serif tracking-wide">
            Surat Kecil Untuk Kamu 💌
          </h3>
          <span className="text-[10px] text-pink-500 font-mono tracking-widest mt-1 uppercase">
            Ehehe
          </span>
        </div>

        {/* Letter Content Section */}
        <div className="mt-6 space-y-4 text-gray-700 text-sm leading-relaxed text-justify font-sans bg-white p-5 rounded-xl border border-stone-200/60 shadow-inner">
          <p className="indent-4 italic">
            "Hai sayang... Di umurmu yang sangat spesial ini, ada sesuatu yang ingin aku sampaikan."
          </p>
          
          <p className="indent-4">
            Aku ingin meminta maaf yang sebesar-besarnya karena <strong className="text-pink-700">hadiahnya mungkin tidak dapat datang tepat waktu</strong>. Tapi, aku akan terus berusaha semaksimal mungkin agar bisa memberikan yang terbaik untukmu.
          </p>

          <p className="indent-4">
            Maaf juga yaa, mungkin di umur yang sangat spesial ini, aku malah <strong className="text-pink-700">belum bisa kasih sesuatu yang 'wah'</strong> seperti tahun-tahun sebelumnya atau seperti orang-orang di luar sana... Tapi satu hal yang pasti, <em className="text-pink-600 font-medium">I'll keep trying</em>. Aku akan terus mencoba memberikan yang aku mampu buat kamu.
          </p>

          <div className="flex items-center gap-2 pt-2 text-xs text-pink-500 font-medium border-t border-dashed border-pink-100">
            <AlertCircle size={14} className="shrink-0 text-pink-400" />
            <span>Terima kasih sudah selalu memahami dan sabar denganku... ❤️</span>
          </div>
        </div>

        {/* Signature */}
        <div className="mt-6 flex flex-col items-end pr-2 text-right">
          <span className="text-xs text-gray-500 italic font-mono">With Love,</span>
          <span className="text-sm font-bold text-pink-700 font-serif mt-1 flex items-center gap-1">
            Your Man <Sparkles size={12} className="text-yellow-400 animate-spin" style={{ animationDuration: "3s" }} />
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-md hover:shadow-lg hover:scale-[1.01] flex items-center justify-center gap-1.5"
          id="btn-close-letter"
        >
          Tutup
        </button>
      </motion.div>
    </motion.div>
  );
}
