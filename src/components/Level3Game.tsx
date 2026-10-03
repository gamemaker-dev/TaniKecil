import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';

interface Level3GameProps {
  onComplete: (score: number, stars: number, coins: number, accuracy: number) => void;
  onExit: () => void;
}

interface Creature {
  id: string;
  name: string;
  emoji: string;
  isPest: boolean;
  info: string;
}

const CREATURES: Creature[] = [
  { id: 'ulat', name: 'Ulat Grayak', emoji: '🐛', isPest: true, info: 'Merusak daun muda tanaman!' },
  { id: 'wereng', name: 'Wereng Coklat', emoji: '🦗', isPest: true, info: 'Menghisap cairan batang padi!' },
  { id: 'tikus', name: 'Tikus Sawah', emoji: '🐀', isPest: true, info: 'Memotong tangkai bulir padi!' },
  { id: 'kutu', name: 'Kutu Daun', emoji: '🦟', isPest: true, info: 'Menularkan virus penyakit tanaman!' },
  { id: 'lebah', name: 'Lebah Madu', emoji: '🐝', isPest: false, info: 'Sahabat penyerbukan bunga tanaman!' },
  { id: 'kepik', name: 'Kepik Koksi', emoji: '🐞', isPest: false, info: 'Predator alami pemangsa kutu daun!' },
  { id: 'burung', name: 'Burung Hantu', emoji: '🦉', isPest: false, info: 'Pemburu alami tikus sawah malam hari!' },
  { id: 'katak', name: 'Katak Sawah', emoji: '🐸', isPest: false, info: 'Memakan serangga perusak di sawah!' },
];

export const Level3Game: React.FC<Level3GameProps> = ({ onComplete, onExit }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);
  const [correctHits, setCorrectHits] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [floatingFeedback, setFloatingFeedback] = useState<string | null>(null);

  // 9 holes grid
  const [activeHoles, setActiveHoles] = useState<(Creature | null)[]>(Array(9).fill(null));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Spawn creatures loop
  useEffect(() => {
    if (timeLeft <= 0) return;

    const spawner = setInterval(() => {
      // Pick random hole 0 to 8
      const holeIdx = Math.floor(Math.random() * 9);
      const randomCreature = CREATURES[Math.floor(Math.random() * CREATURES.length)];

      setActiveHoles((prev) => {
        const next = [...prev];
        next[holeIdx] = randomCreature;
        return next;
      });

      // Clear creature after 1.6s
      setTimeout(() => {
        setActiveHoles((prev) => {
          const next = [...prev];
          if (next[holeIdx]?.name === randomCreature.name) {
            next[holeIdx] = null;
          }
          return next;
        });
      }, 1600);
    }, 900);

    return () => clearInterval(spawner);
  }, [timeLeft]);

  const handleWhack = (index: number) => {
    const creature = activeHoles[index];
    if (!creature) return;

    setTotalAttempts((prev) => prev + 1);

    if (creature.isPest) {
      sound.playSuccessChime();
      const points = 100 + combo * 25;
      setScore((prev) => prev + points);
      setCombo((prev) => prev + 1);
      setCorrectHits((prev) => prev + 1);
      setFloatingFeedback(`💥 Semprot Nabati! +${points} pts`);
    } else {
      sound.playError();
      setScore((prev) => Math.max(0, prev - 80));
      setCombo(0);
      setFloatingFeedback(`⚠️ AWAS! ${creature.name} itu SAHABAT PETANI!`);
    }

    // clear hole immediately
    setActiveHoles((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });

    setTimeout(() => {
      setFloatingFeedback(null);
    }, 1200);
  };

  const finishGame = () => {
    sound.playFanfare();
    const accuracy = totalAttempts > 0 ? Math.min(100, Math.round((correctHits / totalAttempts) * 100)) : 70;
    let stars = 1;
    if (score >= 800 && accuracy >= 75) stars = 3;
    else if (score >= 450) stars = 2;

    const coinsEarned = Math.floor(score / 5) + stars * 35;
    onComplete(score, stars, coinsEarned, accuracy);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-amber-300 mb-6">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              sound.playClick();
              onExit();
            }}
            className="flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full transition"
          >
            <span>← Kembali ke Peta</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
              Level 3: Basmi Hama Sahabat Petani
            </span>
            <span className="text-xs font-black text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
              ⏱️ {timeLeft}s
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500">Target:</span>
            <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
              Semprot Hama (🐛 🦗 🐀)
            </span>
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
              Lindungi Sahabat (🐝 🐞 🦉)
            </span>
          </div>

          <div className="bg-stone-900 text-amber-400 font-fredoka text-lg font-black px-4 py-1 rounded-2xl border-2 border-amber-400/50">
            {score} pts
          </div>
        </div>
      </div>

      {/* Floating feedback alert */}
      {floatingFeedback && (
        <div className="text-center mb-3">
          <span
            className={`inline-block px-4 py-1.5 rounded-full text-xs font-extrabold shadow-md animate-bounce ${
              floatingFeedback.includes('AWAS')
                ? 'bg-rose-500 text-white'
                : 'bg-emerald-500 text-white'
            }`}
          >
            {floatingFeedback}
          </span>
        </div>
      )}

      {/* Whack-a-pest 3x3 Garden Field */}
      <div className="bg-gradient-to-b from-[#8D6E63] to-[#5D4037] p-4 sm:p-6 rounded-3xl shadow-2xl border-4 border-[#3E2723] mb-6">
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto">
          {activeHoles.map((creature, idx) => (
            <div
              key={idx}
              className="aspect-square bg-[#3E2723] rounded-3xl border-4 border-[#27160F] shadow-inner relative overflow-hidden flex items-center justify-center cursor-pointer group select-none"
              onClick={() => handleWhack(idx)}
            >
              {/* Earth mound graphics */}
              <div className="absolute inset-x-2 bottom-0 h-6 bg-[#4E342E] rounded-t-full border-t-2 border-[#6D4C41] pointer-events-none" />

              {creature ? (
                <div className="flex flex-col items-center justify-center transform active:scale-90 transition-transform">
                  <span className="text-5xl sm:text-6xl animate-bounce drop-shadow-md">
                    {creature.emoji}
                  </span>
                  <span
                    className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full mt-1 ${
                      creature.isPest
                        ? 'bg-rose-500 text-white'
                        : 'bg-emerald-500 text-white ring-2 ring-emerald-200'
                    }`}
                  >
                    {creature.name}
                  </span>
                </div>
              ) : (
                <div className="w-12 h-6 bg-black/40 rounded-full blur-xs" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Educational Guide Card */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 text-xs text-stone-600 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🌿</div>
          <div>
            <div className="font-extrabold text-stone-800">Prinsip Pengendalian Hama Terpadu (PHT)</div>
            <div className="text-[11px] text-stone-500">
              Jangan menggunakan racun kimia berlebihan yang membunuh lebah penyerbuk dan predator alami tanaman!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
