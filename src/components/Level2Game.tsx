import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

interface Level2GameProps {
  onComplete: (score: number, stars: number, coins: number, accuracy: number) => void;
  onExit: () => void;
}

export const Level2Game: React.FC<Level2GameProps> = ({ onComplete, onExit }) => {
  const [moisture, setMoisture] = useState(60); // 0 - 100
  const [nutrients, setNutrients] = useState(55); // 0 - 100
  const [sunlight, setSunlight] = useState(50); // 0 - 100
  const [aeration, setAeration] = useState(65); // 0 - 100

  const [growth, setGrowth] = useState(0); // 0 - 100%
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameTime, setGameTime] = useState(35); // seconds
  const [weatherEvent, setWeatherEvent] = useState<string>('Cuaca Normal: Pagi Cerah');
  const [isGameOver, setIsGameOver] = useState(false);

  // Weather events loop
  useEffect(() => {
    const events = [
      'Cuaca Normal: Pagi Cerah',
      'Terik Siang: Penguapan Meningkat! ☀️',
      'Hujan Rintik: Tanah Lembap 🌧️',
      'Cacing Tanah Muncul: Tanah Makin Gembur 🪱',
      'Mendung Teduh: Sinar Matahari Berkurang ⛅',
    ];

    const interval = setInterval(() => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setWeatherEvent(randomEvent);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Main growth & depletion simulation loop
  useEffect(() => {
    if (isGameOver) return;

    const loop = setInterval(() => {
      // Natural resource drain
      setMoisture((prev) => Math.max(0, Math.min(100, prev - (weatherEvent.includes('Terik') ? 3 : 1.5))));
      setNutrients((prev) => Math.max(0, Math.min(100, prev - 1.2)));
      setSunlight((prev) => Math.max(0, Math.min(100, prev + (weatherEvent.includes('Mendung') ? -2 : 1))));
      setAeration((prev) => Math.max(0, Math.min(100, prev - 1.0)));

      // Check ideal zone (all between 35% and 85%)
      const isMoistGood = moisture >= 35 && moisture <= 85;
      const isNutrientGood = nutrients >= 35 && nutrients <= 85;
      const isSunGood = sunlight >= 35 && sunlight <= 85;
      const isAerateGood = aeration >= 35 && aeration <= 85;

      const idealFactors = [isMoistGood, isNutrientGood, isSunGood, isAerateGood].filter(Boolean).length;

      if (idealFactors >= 3) {
        // Growing well!
        setGrowth((prev) => {
          const next = prev + 3;
          if (next >= 100) {
            finishGame(100);
            return 100;
          }
          return next;
        });
        setScore((prev) => prev + 25 + combo * 5);
        setCombo((prev) => prev + 1);
      } else {
        setCombo(0);
      }

      // Timer countdown
      setGameTime((prev) => {
        if (prev <= 1) {
          finishGame(growth);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(loop);
  }, [moisture, nutrients, sunlight, aeration, weatherEvent, isGameOver, growth, combo]);

  const finishGame = (finalGrowth: number) => {
    setIsGameOver(true);
    sound.playFanfare();

    let stars = 1;
    if (finalGrowth >= 95) stars = 3;
    else if (finalGrowth >= 60) stars = 2;

    const accuracy = Math.round(finalGrowth);
    const finalScore = score + Math.floor(finalGrowth * 3);
    const coinsEarned = Math.floor(finalScore / 5) + stars * 30;

    onComplete(finalScore, stars, coinsEarned, accuracy);
  };

  const handleWater = () => {
    sound.playWaterSound();
    setMoisture((prev) => Math.min(100, prev + 18));
    setScore((prev) => prev + 10);
  };

  const handleFertilize = () => {
    sound.playClick();
    setNutrients((prev) => Math.min(100, prev + 20));
    setScore((prev) => prev + 10);
  };

  const handleAdjustSun = () => {
    sound.playClick();
    setSunlight((prev) => (prev > 70 ? 40 : prev + 25));
    setScore((prev) => prev + 10);
  };

  const handleHoe = () => {
    sound.playClick();
    setAeration((prev) => Math.min(100, prev + 22));
    setScore((prev) => prev + 10);
  };

  // Determine plant stage visual
  let plantEmoji = '🌱';
  let stageName = 'Tahap 1: Tunas Muda (Kecambah)';
  if (growth >= 75) {
    plantEmoji = '🌳';
    stageName = 'Tahap 4: Tanaman Berbuah Lebat & Siap Panen!';
  } else if (growth >= 50) {
    plantEmoji = '🌼';
    stageName = 'Tahap 3: Berbunga Menarik Serangga';
  } else if (growth >= 25) {
    plantEmoji = '🌿';
    stageName = 'Tahap 2: Daun Lebat & Batang Menguat';
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-blue-300 mb-6">
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
            <span className="text-xs font-extrabold text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
              Level 2: Nutrisi & Olah Tanah
            </span>
            <span className="text-xs font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
              ⏱️ {gameTime}s
            </span>
          </div>
        </div>

        {/* Growth and Weather */}
        <div className="grid grid-cols-2 gap-3 items-center">
          <div>
            <div className="flex justify-between text-xs font-bold text-stone-600 mb-1">
              <span>Pertumbuhan Tanaman</span>
              <span className="text-emerald-700 font-black">{Math.min(100, Math.round(growth))}%</span>
            </div>
            <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 via-emerald-500 to-green-600 transition-all duration-300"
                style={{ width: `${Math.min(100, growth)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <div className="text-right">
              <div className="text-[10px] text-stone-400 font-bold uppercase">Skor Nutrisi</div>
              <div className="text-lg font-black text-emerald-800 font-fredoka">{score} pts</div>
            </div>
          </div>
        </div>

        <div className="mt-2.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-xl text-xs font-semibold text-blue-900 flex items-center justify-between">
          <span>{weatherEvent}</span>
          {combo > 2 && <span className="text-amber-600 font-extrabold">🔥 Kombo Subur x{combo}!</span>}
        </div>
      </div>

      {/* Center Plant Simulator Stage */}
      <div className="bg-gradient-to-b from-sky-100 via-emerald-50 to-[#5C4033]/20 rounded-3xl p-6 shadow-xl border-4 border-emerald-400 text-center relative overflow-hidden mb-6">
        <div className="text-xs font-extrabold text-emerald-800 uppercase tracking-wide bg-white/80 inline-block px-4 py-1 rounded-full border border-emerald-200 mb-3 shadow-xs">
          {stageName}
        </div>

        {/* Animated Plant in Pot/Soil */}
        <div className="my-4 py-6 relative">
          <div className="text-8xl sm:text-9xl transition-transform duration-500 hover:scale-105 select-none drop-shadow-md">
            {plantEmoji}
          </div>
          <div className="w-48 h-8 bg-[#3E2723]/30 rounded-full mx-auto blur-xs -mt-2" />
        </div>

        {/* Status meters in 4 cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2">
          {/* Moisture */}
          <div className="bg-white/90 rounded-2xl p-2.5 border border-stone-200 text-left shadow-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 mb-1">
              <span>💧 Air Tanah</span>
              <span>{Math.round(moisture)}%</span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${moisture < 35 || moisture > 85 ? 'bg-rose-500' : 'bg-blue-500'}`}
                style={{ width: `${moisture}%` }}
              />
            </div>
            <div className="text-[9px] text-stone-500 mt-1">
              {moisture < 35 ? '⚠️ Kekeringan!' : moisture > 85 ? '⚠️ Terlalu Becek' : '✅ Ideal'}
            </div>
          </div>

          {/* Nutrients */}
          <div className="bg-white/90 rounded-2xl p-2.5 border border-stone-200 text-left shadow-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 mb-1">
              <span>🍂 Kompos</span>
              <span>{Math.round(nutrients)}%</span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${nutrients < 35 || nutrients > 85 ? 'bg-rose-500' : 'bg-amber-500'}`}
                style={{ width: `${nutrients}%` }}
              />
            </div>
            <div className="text-[9px] text-stone-500 mt-1">
              {nutrients < 35 ? '⚠️ Kurang Hara' : nutrients > 85 ? '⚠️ Dosis Tinggi' : '✅ Subur'}
            </div>
          </div>

          {/* Sunlight */}
          <div className="bg-white/90 rounded-2xl p-2.5 border border-stone-200 text-left shadow-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-yellow-900 mb-1">
              <span>☀️ Cahaya</span>
              <span>{Math.round(sunlight)}%</span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${sunlight < 35 || sunlight > 85 ? 'bg-rose-500' : 'bg-yellow-500'}`}
                style={{ width: `${sunlight}%` }}
              />
            </div>
            <div className="text-[9px] text-stone-500 mt-1">
              {sunlight < 35 ? '⚠️ Terlalu Gelap' : sunlight > 85 ? '⚠️ Terbakar Sinar' : '✅ Fotosintesis'}
            </div>
          </div>

          {/* Aeration */}
          <div className="bg-white/90 rounded-2xl p-2.5 border border-stone-200 text-left shadow-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-stone-800 mb-1">
              <span>🌾 Gembur</span>
              <span>{Math.round(aeration)}%</span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${aeration < 35 ? 'bg-rose-500' : 'bg-emerald-600'}`}
                style={{ width: `${aeration}%` }}
              />
            </div>
            <div className="text-[9px] text-stone-500 mt-1">
              {aeration < 35 ? '⚠️ Tanah Padat' : '✅ Akar Bernapas'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons to control the farming balance */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={handleWater}
          className="p-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black text-xs shadow-md border-b-4 border-blue-700 active:translate-y-1 transition flex flex-col items-center gap-1"
        >
          <span className="text-2xl">🚿</span>
          <span>Siram Air</span>
          <span className="text-[10px] opacity-80">+18% Lembap</span>
        </button>

        <button
          onClick={handleFertilize}
          className="p-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md border-b-4 border-amber-800 active:translate-y-1 transition flex flex-col items-center gap-1"
        >
          <span className="text-2xl">🍂</span>
          <span>Pupuk Kompos</span>
          <span className="text-[10px] opacity-80">+20% Nutrisi</span>
        </button>

        <button
          onClick={handleAdjustSun}
          className="p-3.5 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-white font-black text-xs shadow-md border-b-4 border-yellow-700 active:translate-y-1 transition flex flex-col items-center gap-1"
        >
          <span className="text-2xl">☀️</span>
          <span>Atur Naungan</span>
          <span className="text-[10px] opacity-80">Seimbangkan Sinar</span>
        </button>

        <button
          onClick={handleHoe}
          className="p-3.5 rounded-2xl bg-stone-600 hover:bg-stone-700 text-white font-black text-xs shadow-md border-b-4 border-stone-800 active:translate-y-1 transition flex flex-col items-center gap-1"
        >
          <span className="text-2xl">⛏️</span>
          <span>Cangkul Tanah</span>
          <span className="text-[10px] opacity-80">+22% Gembur</span>
        </button>
      </div>

      <div className="mt-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs font-semibold text-emerald-800">
        💡 <strong>Tips IPAS:</strong> Jaga semua indikator tetap berada di zona hijau (35% - 85%) agar tanaman tumbuh cepat dan subur!
      </div>
    </div>
  );
};
