import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { UserProfile, GameScoreRecord } from '../types';
import { sound } from '../utils/audio';

interface ResultModalProps {
  score: number;
  stars: number;
  coinsEarned: number;
  accuracy: number;
  levelId: number;
  levelTitle: string;
  badgeName?: string;
  currentUser: UserProfile;
  syncResult: { success: boolean; message: string; record?: GameScoreRecord };
  onRetry: () => void;
  onContinue: () => void;
  onOpenGoogleSheets: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  score,
  stars,
  coinsEarned,
  accuracy,
  levelId,
  levelTitle,
  badgeName,
  currentUser,
  syncResult,
  onRetry,
  onContinue,
  onOpenGoogleSheets,
}) => {
  const [animatedStars, setAnimatedStars] = useState(0);

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899'],
      });
    } catch (e) {
      // ignore
    }

    const t1 = setTimeout(() => setAnimatedStars(1), 300);
    const t2 = setTimeout(() => {
      if (stars >= 2) setAnimatedStars(2);
    }, 600);
    const t3 = setTimeout(() => {
      if (stars >= 3) setAnimatedStars(3);
    }, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [stars]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-emerald-400 relative text-center animate-in fade-in zoom-in duration-300">
        {/* Ribbon Header */}
        <div className="inline-block bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-900 font-fredoka font-black text-sm px-6 py-1.5 rounded-full border-2 border-white shadow-md -mt-10 mb-4">
          🎉 MISI TANI SELESAI!
        </div>

        <h2 className="text-xl sm:text-2xl font-black font-fredoka text-stone-900 leading-tight">
          {levelTitle}
        </h2>
        <p className="text-xs text-stone-500 mt-1 font-medium">
          Prestasi belajar tani oleh <strong>{currentUser.name}</strong> ({currentUser.nisn})
        </p>

        {/* Stars Display */}
        <div className="flex justify-center gap-2 my-5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`text-5xl transition-all duration-500 transform ${
                s <= animatedStars ? 'scale-110 drop-shadow-md' : 'opacity-20 grayscale scale-95'
              }`}
            >
              ⭐
            </div>
          ))}
        </div>

        {/* Score & Rewards Cards */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200">
            <div className="text-[10px] font-bold text-emerald-700 uppercase">Skor Misi</div>
            <div className="text-xl font-extrabold text-stone-900 font-fredoka">{score}</div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200">
            <div className="text-[10px] font-bold text-amber-700 uppercase">Koin Panen</div>
            <div className="text-xl font-extrabold text-amber-900 font-fredoka">+{coinsEarned}</div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-3 border border-blue-200">
            <div className="text-[10px] font-bold text-blue-700 uppercase">Akurasi IPAS</div>
            <div className="text-xl font-extrabold text-blue-900 font-fredoka">{accuracy}%</div>
          </div>
        </div>

        {/* Badge Unlocked Notification if any */}
        {badgeName && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-100 border-2 border-amber-300 rounded-2xl p-3 mb-5 flex items-center gap-3 text-left">
            <span className="text-3xl">🎖️</span>
            <div>
              <div className="text-[10px] font-extrabold text-amber-800 uppercase">Lencana Baru Diraih!</div>
              <div className="text-xs font-black text-stone-900">{badgeName}</div>
            </div>
          </div>
        )}

        {/* Automatic Google Sheets Sync Notification Card */}
        <div className="bg-stone-50 rounded-2xl p-3.5 border-2 border-emerald-300/80 mb-6 text-left">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-base">📊</span>
              <span className="text-xs font-extrabold text-emerald-900">
                Pencatatan Otomatis Google Sheets
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Tersinkron
            </span>
          </div>

          <p className="text-[11px] text-stone-600 leading-snug">
            {syncResult.message || 'Skor, bintang, NISN, dan waktu bermain telah otomatis tersimpan ke lembar kerja guru.'}
          </p>

          <button
            onClick={() => {
              sound.playClick();
              onOpenGoogleSheets();
            }}
            className="mt-2 text-[11px] font-extrabold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 underline underline-offset-2"
          >
            <span>Buka & Verifikasi Lembar Nilai Google Sheets</span>
            <span>↗</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onRetry();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-xs transition"
          >
            🔄 Main Ulang
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onContinue();
            }}
            className="flex-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg transition active:scale-95 font-fredoka flex items-center justify-center gap-1.5"
          >
            <span>Lanjut Misi Berikutnya</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
