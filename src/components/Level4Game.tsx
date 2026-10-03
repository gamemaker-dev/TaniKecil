import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

interface Level4GameProps {
  onComplete: (score: number, stars: number, coins: number, accuracy: number) => void;
  onExit: () => void;
}

interface CropItem {
  id: string;
  name: string;
  emoji: string;
  isRipe: boolean;
  pricePerKg: number;
}

const CROPS: CropItem[] = [
  { id: '1', name: 'Jagung Manis', emoji: '🌽', isRipe: true, pricePerKg: 8000 },
  { id: '2', name: 'Tomat Merah Segar', emoji: '🍅', isRipe: true, pricePerKg: 12000 },
  { id: '3', name: 'Wortel Renyah', emoji: '🥕', isRipe: true, pricePerKg: 10000 },
  { id: '4', name: 'Padi Gabah Emas', emoji: '🌾', isRipe: true, pricePerKg: 7000 },
  { id: '5', name: 'Sayur Terong Busuk', emoji: '🍆', isRipe: false, pricePerKg: 0 },
  { id: '6', name: 'Cabai Berulat', emoji: '🌶️', isRipe: false, pricePerKg: 0 },
];

export const Level4Game: React.FC<Level4GameProps> = ({ onComplete, onExit }) => {
  // Phase 1: Harvesting ripe crops (15s)
  // Phase 2: Market Math (3 quick questions on revenue)
  const [phase, setPhase] = useState<'harvest' | 'market'>('harvest');
  const [harvestScore, setHarvestScore] = useState(0);
  const [basket, setBasket] = useState<string[]>([]);
  const [harvestTimeLeft, setHarvestTimeLeft] = useState(18);

  // Math phase
  const [mathIndex, setMathIndex] = useState(0);
  const [mathScore, setMathScore] = useState(0);
  const [mathFeedback, setMathFeedback] = useState<string | null>(null);

  const MATH_QUESTIONS = [
    {
      q: 'Pak Tani memanen 5 kg Jagung Manis. Jika harga 1 kg adalah Rp 8.000, berapa uang yang didapat Pak Tani?',
      options: ['Rp 40.000', 'Rp 35.000', 'Rp 45.000', 'Rp 50.000'],
      correct: 'Rp 40.000',
    },
    {
      q: 'Dari kebun dipetik 3 keranjang Tomat. Setiap keranjang beratnya 4 kg seharga Rp 10.000/kg. Berapa total hasil penjualan tomat?',
      options: ['Rp 100.000', 'Rp 120.000', 'Rp 140.000', 'Rp 80.000'],
      correct: 'Rp 120.000',
    },
    {
      q: 'Pak Tani menjual hasil panen senilai Rp 150.000 dan membeli pupuk kompos seharga Rp 50.000. Berapa keuntungan bersih Pak Tani?',
      options: ['Rp 100.000', 'Rp 90.000', 'Rp 110.000', 'Rp 200.000'],
      correct: 'Rp 100.000',
    },
  ];

  // Random available crops to harvest
  const [availableCrops, setAvailableCrops] = useState<CropItem[]>([]);

  useEffect(() => {
    if (phase !== 'harvest') return;

    // Refresh crops on screen
    const interval = setInterval(() => {
      const randomSet: CropItem[] = [];
      for (let i = 0; i < 4; i++) {
        randomSet.push(CROPS[Math.floor(Math.random() * CROPS.length)]);
      }
      setAvailableCrops(randomSet);
    }, 1400);

    return () => clearInterval(interval);
  }, [phase]);

  // Harvest timer
  useEffect(() => {
    if (phase !== 'harvest') return;

    const timer = setInterval(() => {
      setHarvestTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPhase('market');
          sound.playSuccessChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const handlePickCrop = (crop: CropItem, idx: number) => {
    if (crop.isRipe) {
      sound.playClick();
      setHarvestScore((prev) => prev + 100);
      setBasket((prev) => [...prev, crop.emoji]);
    } else {
      sound.playError();
      setHarvestScore((prev) => Math.max(0, prev - 50));
    }

    // Remove picked crop from screen
    setAvailableCrops((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSelectMath = (chosen: string) => {
    const isRight = chosen === MATH_QUESTIONS[mathIndex].correct;
    if (isRight) {
      sound.playSuccessChime();
      setMathScore((prev) => prev + 150);
      setMathFeedback('✅ Hebat! Hitunganmu tepat!');
    } else {
      sound.playError();
      setMathFeedback(`❌ Kurang tepat. Jawaban benar: ${MATH_QUESTIONS[mathIndex].correct}`);
    }

    setTimeout(() => {
      setMathFeedback(null);
      if (mathIndex + 1 < MATH_QUESTIONS.length) {
        setMathIndex((prev) => prev + 1);
      } else {
        // Finished Level 4
        finishFinalLevel();
      }
    }, 1200);
  };

  const finishFinalLevel = () => {
    sound.playFanfare();
    const finalScore = harvestScore + mathScore;
    const accuracy = Math.min(100, Math.round(((harvestScore + mathScore) / 1000) * 100));

    let stars = 1;
    if (finalScore >= 800) stars = 3;
    else if (finalScore >= 450) stars = 2;

    const coinsEarned = Math.floor(finalScore / 4) + stars * 50;
    onComplete(finalScore, stars, coinsEarned, accuracy);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-orange-300 mb-6">
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
            <span className="text-xs font-extrabold text-orange-900 bg-orange-100 px-3 py-1 rounded-full">
              Level 4: Panen Raya & Pasar Tani
            </span>
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {phase === 'harvest' ? `⏱️ Panen: ${harvestTimeLeft}s` : `Pasar Tani: Soal ${mathIndex + 1}/3`}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-stone-600 font-bold">
            {phase === 'harvest'
              ? 'Petik sayur & buah matang, hindari yang busuk/berulat!'
              : 'Hitung hasil penjualan tani di Pasar Desa'}
          </div>

          <div className="bg-stone-900 text-amber-400 font-fredoka text-lg font-black px-4 py-1 rounded-2xl border-2 border-amber-400/50">
            {harvestScore + mathScore} pts
          </div>
        </div>
      </div>

      {phase === 'harvest' ? (
        /* Phase 1: Harvesting */
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-amber-100 to-emerald-100 p-6 rounded-3xl border-4 border-amber-400 shadow-xl min-h-[300px] flex flex-col justify-between">
            <div className="text-center font-bold text-amber-900 text-sm">
              🌾 Lahan Siap Panen: Klik cepat tanaman matang!
            </div>

            {/* Clickable ripe crops */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
              {availableCrops.map((crop, idx) => (
                <button
                  key={`${crop.id}-${idx}`}
                  onClick={() => handlePickCrop(crop, idx)}
                  className={`p-4 rounded-3xl border-4 flex flex-col items-center justify-center transition-transform active:scale-90 shadow-md ${
                    crop.isRipe
                      ? 'bg-white hover:bg-amber-50 border-amber-300'
                      : 'bg-rose-50 border-rose-300'
                  }`}
                >
                  <span className="text-6xl mb-1 animate-pulse">{crop.emoji}</span>
                  <span className="text-xs font-extrabold text-stone-800 text-center leading-tight">
                    {crop.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${
                      crop.isRipe ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {crop.isRipe ? 'Matang Segar' : 'Rusak/Hama'}
                  </span>
                </button>
              ))}
            </div>

            {/* Harvest Basket */}
            <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-3 border border-amber-200">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1.5">
                <span>🧺 Keranjang Hasil Panen:</span>
                <span>{basket.length} Hasil Petik</span>
              </div>
              <div className="flex flex-wrap gap-1 min-h-[32px] items-center">
                {basket.length === 0 ? (
                  <span className="text-xs text-stone-400 italic">Keranjang masih kosong...</span>
                ) : (
                  basket.map((b, i) => (
                    <span key={i} className="text-2xl animate-fadeIn">
                      {b}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Phase 2: Market Math */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-orange-400">
          <div className="text-center mb-6">
            <span className="text-5xl mb-2 inline-block">🏪</span>
            <div className="text-xs font-extrabold uppercase tracking-wider text-orange-600 mb-1">
              Pasar Tani Merdeka: Matematika IPAS
            </div>
            <h2 className="text-lg font-bold text-stone-900 leading-snug font-fredoka max-w-lg mx-auto">
              {MATH_QUESTIONS[mathIndex].q}
            </h2>
          </div>

          {mathFeedback && (
            <div className="p-3 mb-4 rounded-xl text-center text-xs font-black bg-amber-100 text-amber-900">
              {mathFeedback}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MATH_QUESTIONS[mathIndex].options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelectMath(opt)}
                className="p-4 rounded-2xl border-2 border-stone-200 hover:border-orange-500 hover:bg-orange-50 font-bold text-sm text-stone-800 transition-all active:scale-95 text-center shadow-xs"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
