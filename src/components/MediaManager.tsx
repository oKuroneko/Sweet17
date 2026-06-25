import React, { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, Video, CheckCircle, RefreshCw, Settings, X, Info } from "lucide-react";
import { PhotoSlide } from "../types";

// DB Setup
const DB_NAME = "GiscaBirthdayMediaDB";
const STORE_NAME = "media";

// Fallback high-quality Unsplash image URLs corresponding to the descriptions
export const DEFAULT_PHOTOS: PhotoSlide[] = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800",
    caption: "Awal dari segalanya... Senyuman manis di depan cermin, mengukir kenangan pertama kita.",
    date: "Awal Jumpa",
    category: "Mirror Selfie"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=800",
    caption: "Momen menggemaskan dengan bando renda dan kerah pelaut pink. Kamu selalu jadi yang terimut!",
    date: "Sweet Moments",
    category: "Cute Portrait"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    caption: "Gisca dengan hijab hitam yang anggun di tengah keasrian hutan pinus. Cantikmu menenangkan jiwa.",
    date: "Pinus Forest",
    category: "Serene Nature"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?auto=format&fit=crop&q=80&w=800",
    caption: "Date santai di cafe favorit, berbincang hangat di depan cangkir teh. Kebersamaan sederhana yang tak ternilai.",
    date: "Cafe Date",
    category: "Warm Talks"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800",
    caption: "Mirror selfie berdua dengan latar tanaman hijau yang asri. Seperti cinta kita yang terus tumbuh subur.",
    date: "Cozy Garden",
    category: "Mirror Selfie"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?auto=format&fit=crop&q=80&w=800",
    caption: "Senyum lepasmu di depan boneka penguin Miniso. Tawamu adalah alasan di balik bahagiaku.",
    date: "Fun Store Date",
    category: "Childlike Joy"
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
    caption: "Berdiri anggun di depan pagoda merah menyala di bawah gemerlap malam. Layaknya takdir benang merah jepang kuno.",
    date: "Night Pagoda",
    category: "Romantic Night"
  }
];

// Helper to open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Get item from db
export async function getMedia(key: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("IndexedDB Error:", err);
    return null;
  }
}

// Set item in db
export async function setMedia(key: string, value: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Clear item
export async function deleteMedia(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

interface MediaManagerProps {
  onMediaChanged: () => void;
}

export default function MediaManager({ onMediaChanged }: MediaManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [statusMap, setStatusMap] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkExistingMedia() {
      const statuses: { [key: string]: boolean } = {};
      for (let i = 1; i <= 7; i++) {
        const blob = await getMedia(`photo_${i}`);
        statuses[`photo_${i}`] = !!blob;
      }
      const videoBlob = await getMedia("closing_video");
      statuses["closing_video"] = !!videoBlob;
      
      setStatusMap(statuses);
      setIsLoading(false);
    }
    checkExistingMedia();
  }, [isOpen]);

  const handleFileUpload = async (key: string, file: File) => {
    if (!file) return;
    setIsLoading(true);
    try {
      // Save to IndexedDB
      await setMedia(key, file);
      
      // Update local status
      setStatusMap(prev => ({ ...prev, [key]: true }));
      
      // Notify parent to reload media
      onMediaChanged();
    } catch (e) {
      console.error("Upload failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetMedia = async (key: string) => {
    setIsLoading(true);
    try {
      await deleteMedia(key);
      setStatusMap(prev => ({ ...prev, [key]: false }));
      onMediaChanged();
    } catch (e) {
      console.error("Reset failed", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAll = async () => {
    if (confirm("Apakah kamu yakin ingin mengembalikan semua foto & video ke default?")) {
      setIsLoading(true);
      try {
        for (let i = 1; i <= 7; i++) {
          await deleteMedia(`photo_${i}`);
        }
        await deleteMedia("closing_video");
        
        const freshStatuses: { [key: string]: boolean } = {};
        setStatusMap(freshStatuses);
        onMediaChanged();
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {/* Floating Settings Button in top right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-6 right-6 z-40 bg-white/90 backdrop-blur-md text-pink-600 border border-pink-100 hover:bg-pink-50 p-2.5 rounded-full shadow-md transition-all duration-300 flex items-center justify-center group"
        title="Sesuaikan Foto & Video Album"
        id="btn-settings-media"
      >
        <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
      </button>

      {/* Slide-over or Modal drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="media-manager-overlay">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-fade-in-left">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100 bg-pink-50/50">
              <div className="flex items-center gap-2">
                <Settings className="text-pink-600" size={20} />
                <h2 className="text-lg font-semibold text-pink-800">Media Kenangan Gisca 🌸</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-pink-600 transition-colors p-1"
                id="btn-close-media-panel"
              >
                <X size={22} />
              </button>
            </div>

            {/* Info bar */}
            <div className="bg-pink-50 text-pink-800 px-6 py-3 flex gap-2.5 items-start text-xs leading-relaxed border-b border-pink-100">
              <Info size={16} className="shrink-0 text-pink-600 mt-0.5" />
              <p>
                Kamu bisa mengunggah <strong>7 foto asli</strong> dan <strong>1 video penutup</strong> yang diunggah di chat!
                Data disimpan aman secara lokal di peramban kamu, sehingga album akan langsung terisi dengan kenangan aslimu.
              </p>
            </div>

            {/* Main scrollable list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {isLoading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-20">
                  <RefreshCw className="animate-spin text-pink-500" size={32} />
                </div>
              )}

              {/* Photo Upload Items */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-pink-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1">
                  <ImageIcon size={14} /> Daftar Album Foto Kenangan (7 Foto)
                </h3>

                {DEFAULT_PHOTOS.map((photo, index) => {
                  const key = `photo_${photo.id}`;
                  const isUploaded = statusMap[key];

                  return (
                    <div
                      key={photo.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-pink-100 bg-white hover:shadow-xs transition-shadow"
                    >
                      <div className="flex-1 mr-4">
                        <span className="text-xs font-bold text-pink-600 block">Foto {photo.id}</span>
                        <span className="text-xs text-gray-500 line-clamp-1 block leading-tight">{photo.caption}</span>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isUploaded ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-gray-100 text-gray-500"}`}>
                            {isUploaded ? "Terpasang Foto Asli ✓" : "Menggunakan Default Placeholder"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <label className="cursor-pointer bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1">
                          <Upload size={12} />
                          Ganti
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(key, file);
                            }}
                          />
                        </label>
                        {isUploaded && (
                          <button
                            onClick={() => handleResetMedia(key)}
                            className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors"
                            title="Reset ke default"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Video Upload Section */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-pink-700 uppercase tracking-wider flex items-center gap-1.5 border-b pb-1">
                  <Video size={14} /> Video Penutup (Red String Theory)
                </h3>

                <div className="p-3.5 rounded-xl border border-pink-100 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-xs font-bold text-pink-600 block">Video Klip Penutup</span>
                      <span className="text-xs text-gray-500">Momen romantis jepang kuno & torii gate</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusMap["closing_video"] ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-gray-100 text-gray-500"}`}>
                      {statusMap["closing_video"] ? "Video Asli ✓" : "Default Placeholder"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer bg-pink-600 hover:bg-pink-700 text-white py-2 px-3 rounded-lg text-center text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                      <Upload size={14} />
                      Unggah Video Kamu
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload("closing_video", file);
                        }}
                      />
                    </label>
                    {statusMap["closing_video"] && (
                      <button
                        onClick={() => handleResetMedia("closing_video")}
                        className="px-3 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-pink-100 bg-pink-50/30 flex gap-2">
              <button
                onClick={handleResetAll}
                className="flex-1 border border-pink-200 text-pink-700 hover:bg-pink-100 py-2.5 rounded-xl text-xs font-semibold transition-colors"
              >
                Reset Semua ke Default
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md hover:shadow-lg text-center"
              >
                Simpan & Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
