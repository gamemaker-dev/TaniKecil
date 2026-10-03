import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

interface Level5GameProps {
  onComplete: (score: number, stars: number, coins: number, accuracy: number) => void;
  onExit: () => void;
}

export const Level5Game: React.FC<Level5GameProps> = ({ onComplete, onExit }) => {
  // Phase 1: Subak Water Gates Management (18s)
  // Phase 2: Ricefield Food Chain & Eco Balance Quiz (3 questions)
  const [phase, setPhase] = useState<'subak' | 'ecosystem'>('subak');

  // Subak irrigation state (3 terrace fields: Hulu, Tengah, Hilir)
  // Levels represent water percentage 0 - 100%. Ideal zone is 45% - 75%.
  const [fieldHulu, setFieldHulu] = useState(55);
  const [fieldTengah, setFieldTengah] = useState(50);
  const [fieldHilir, setFieldHilir] = useState(45);

  // Gate settings: 0 = Tutup, 1 = Sedang (+1.5/s), 2 = Deras (+3.5/s)
  const [gateMain, setGateMain] = useState<number>(1);
  const [gateMid, setGateMid] = useState<number>(1);
  const [gateLow, setGateLow] = useState<number>(1);

  const [subakTimeLeft, setSubakTimeLeft] = useState(20);
  const [subakScore, setSubakScore] = useState(0);
  const [streakGoodWater, setStreakGoodWater] = useState(0);

  // Phase 2: Ecosystem Food Web
  const [ecoIndex, setEcoIndex] = useState(0);
  const [ecoScore, setEcoScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const ECO_QUESTIONS = [
    {
      title: 'Tatanan Rantai Makanan Sawah',
      question: 'Urutan aliran energi makanan yang benar di ekosistem sawah adalah...',
      options: [
        'Padi (Produsen) ➔ Tikus (Konsumen I) ➔ Ular (Konsumen II) ➔ Elang (Puncak)',
        'Ular ➔ Padi ➔ Belalang ➔ Burung Elang',
        'Elang ➔ Katak ➔ Padi ➔ Wereng',
        'Padi ➔ Jamur ➔ Tikus ➔ Belalang',
      ],
      correct: 0,
      explanation: 'Benar sekali! Padi menghasilkan energi (produsen), dimakan hama tikus, tikus dimangsa ular, dan ular dimangsa elang.',
    },
    {
      title: 'Keseimbangan Ekosistem & Predator Alami',
      question: 'Jika manusia memburu dan membunuh semua Ular Sawah karena takut, apa akibat terburuk yang terjadi?',
      options: [
        'Hasil panen padi melimpah ruah',
        'Populasi tikus sawah melonjak drastis hingga terjadi gagal panen',
        'Burung elang akan bertambah banyak',
        'Air sawah menjadi kering',
      ],
      correct: 1,
      explanation: 'Tepat! Ular adalah predator alami pengontrol tikus. Tanpa ular, tikus berkembang biak tanpa kendali dan merusak seluruh sawah!',
    },
    {
      title: 'Filosofi Tradisi Subak Bali',
      question: 'Sistem irigasi Subak yang diakui UNESCO mengajarkan nilai kearifan lokal yaitu...',
      options: [
        'Petani yang lahannya paling atas berhak mengambil semua air',
        'Pembagian air secara adil, musyawarah, dan gotong royong menjaga kelestarian alam',
        'Penggunaan pompa listrik besar tanpa memedulikan tetangga',
        'Menutup aliran sungai agar sawah lain kekeringan',
      ],
      correct: 1,
      explanation: 'Hebat! Subak berlandaskan filosofi Tri Hita Karana: keharmonisan antara manusia dengan Tuhan, sesama manusia, dan alam sekitar.',
    },
  ];

  // Subak simulation loop
  useEffect(() => {
    if (phase !== 'subak') return;

    const timer = setInterval(() => {
      // Water physics:
      // Hulu gets inflow from main river gate minus outflow to middle
      setFieldHulu((prev) => {
        const inflow = gateMain * 2.8;
        const outflow = gateMid * 2.2 + 0.6; // natural seepage
        return Math.max(0, Math.min(100, prev + inflow - outflow));
      });

      // Tengah gets inflow from Hulu gate minus outflow to Hilir
      setFieldTengah((prev) => {
        const inflow = gateMid * 2.2;
        const outflow = gateLow * 2.0 + 0.6;
        return Math.max(0, Math.min(100, prev + inflow - outflow));
      });

      // Hilir gets inflow from Tengah gate minus drainage to river
      setFieldHilir((prev) => {
        const inflow = gateLow * 2.0;
        const outflow = 2.4; // constant drainage to lower river
        return Math.max(0, Math.min(100, prev + inflow - outflow));
      });

      // Check if all fields are in optimal green zone (40 - 80%)
      const isHuluOk = fieldHulu >= 40 && fieldHulu <= 80;
      const isTengahOk = fieldTengah >= 40 && fieldTengah <= 80;
      const isHilirOk = fieldHilir >= 40 && fieldHilir <= 80;

      const okCount = [isHuluOk, isTengahOk, isHilirOk].filter(Boolean).length;
      if (okCount === 3) {
        setSubakScore((s) => s + 25);
        setStreakGoodWater((st) => st + 1);
      } else if (okCount >= 2) {
        setSubakScore((s) => s + 10);
      }

      // Countdown
      setSubakTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          sound.playCoin();
          setPhase('ecosystem');
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, gateMain, gateMid, gateLow, fieldHulu, fieldTengah, fieldHilir]);

  const handleSelectEcoAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    sound.playClick();

    const isCorrect = idx === ECO_QUESTIONS[ecoIndex].correct;
    if (isCorrect) {
      sound.playFanfare();
      setEcoScore((prev) => prev + 150);
      setFeedback('✅ Jawaban Tepat! ' + ECO_QUESTIONS[ecoIndex].explanation);
    } else {
      sound.playError();
      setFeedback('❌ Kurang tepat. ' + ECO_QUESTIONS[ecoIndex].explanation);
    }

    setTimeout(() => {
      if (ecoIndex < ECO_QUESTIONS.length - 1) {
        setEcoIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setFeedback(null);
      } else {
        finishLevel5(subakScore + ecoScore + (isCorrect ? 150 : 0));
      }
    }, 2800);
  };

  const finishLevel5 = (finalTotalScore: number) => {
    let stars = 1;
    if (finalTotalScore >= 600) stars = 3;
    else if (finalTotalScore >= 450) stars = 2;

    const accuracy = Math.min(100, Math.round((finalTotalScore / 800) * 100));
    const coins = Math.floor(finalTotalScore / 6) + stars * 35;

    sound.playFanfare();
    onComplete(finalTotalScore, stars, coins, accuracy);
  };

  const getWaterZoneStatus = (level: number) => {
    if (level < 30) return { label: 'Kekeringan! 🏜️', color: 'text-amber-700 bg-amber-100 border-amber-300' };
    if (level > 85) return { label: 'Banjir! 🌊', color: 'text-blue-800 bg-blue-100 border-blue-300' };
    if (level >= 40 && level <= 80) return { label: 'Subur Ideal 🌿', color: 'text-emerald-800 bg-emerald-100 border-emerald-300' };
    return { label: 'Cukup', color: 'text-stone-700 bg-stone-100 border-stone-200' };
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-md border-4 border-teal-500 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌊</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-fredoka text-stone-900 leading-tight">
                Level 5: Irigasi Subak & Ekosistem Sawah
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Fase C (SD Kelas 5 & 6) • Warisan Budaya Subak & Keseimbangan Jaring Makanan
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-2xl text-center">
            <div className="text-[10px] font-bold text-teal-800 uppercase">Total Skor</div>
            <div className="text-lg font-black font-fredoka text-teal-900">{subakScore + ecoScore}</div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onExit();
            }}
            className="px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-rubik font-bold text-xs transition"
          >
            Keluar Misi
          </button>
        </div>
      </div>

      {/* PHASE 1: SUBAK WATER GATES SIMULATION */}
      {phase === 'subak' && (
        <div className="space-y-6">
          {/* Instructions Banner */}
          <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white p-4 sm:p-5 rounded-3xl shadow-lg flex items-center justify-between">
            <div className="space-y-1">
              <span className="bg-white/20 text-[11px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Misi Bagian 1: Manajemen Air Subak
              </span>
              <h2 className="text-lg sm:text-xl font-black font-fredoka">
                Atur Pintu Air Sawah Terasering!
              </h2>
              <p className="text-xs text-teal-100 max-w-xl">
                Jaga ketinggian air di ketiga petak sawah agar tetap di <strong>Zona Hijau (40% - 80%)</strong>. 
                Jangan biarkan kering atau tergenang banjir!
              </p>
            </div>

            <div className="bg-white text-teal-900 px-4 py-2 rounded-2xl text-center font-rubik font-black shadow-md shrink-0">
              <div className="text-[10px] uppercase tracking-wide text-teal-700">Waktu</div>
              <div className="text-2xl font-mono text-teal-800">{subakTimeLeft}s</div>
            </div>
          </div>

          {/* 3 Terraced Rice Fields Visual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Field 1: Hulu (Top Terrace) */}
            <div className="bg-white rounded-3xl p-5 border-4 border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-rubik font-extrabold text-sm text-stone-800">
                    1. Petak Hulu (Atas)
                  </span>
                  <span className="text-xs font-mono font-bold text-stone-600">
                    {Math.round(fieldHulu)}%
                  </span>
                </div>

                {/* Water Meter Gauge */}
                <div className="w-full h-24 bg-stone-100 rounded-2xl overflow-hidden relative border-2 border-stone-300 flex flex-col justify-end">
                  <div
                    className="w-full bg-gradient-to-t from-teal-600 to-cyan-400 transition-all duration-300"
                    style={{ height: `${fieldHulu}%` }}
                  ></div>
                  {/* Ideal Range marker lines */}
                  <div className="absolute inset-x-0 bottom-[40%] top-[20%] border-y-2 border-dashed border-emerald-500 bg-emerald-500/10 pointer-events-none flex items-center justify-center">
                    <span className="text-[9px] font-bold text-emerald-800 bg-white/80 px-1.5 py-0.2 rounded-full">
                      Zona Subur (40-80%)
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${getWaterZoneStatus(fieldHulu).color}`}>
                    {getWaterZoneStatus(fieldHulu).label}
                  </span>
                </div>
              </div>

              {/* Gate Control Button */}
              <div className="mt-4 pt-3 border-t border-stone-100">
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 text-center">
                  Pintu Air Sungai Utama:
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { val: 0, label: 'Tutup' },
                    { val: 1, label: 'Sedang' },
                    { val: 2, label: 'Deras' },
                  ].map((btn) => (
                    <button
                      key={btn.val}
                      onClick={() => {
                        sound.playClick();
                        setGateMain(btn.val);
                      }}
                      className={`py-1.5 rounded-xl text-xs font-bold transition ${
                        gateMain === btn.val
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field 2: Tengah (Middle Terrace) */}
            <div className="bg-white rounded-3xl p-5 border-4 border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-rubik font-extrabold text-sm text-stone-800">
                    2. Petak Tengah
                  </span>
                  <span className="text-xs font-mono font-bold text-stone-600">
                    {Math.round(fieldTengah)}%
                  </span>
                </div>

                <div className="w-full h-24 bg-stone-100 rounded-2xl overflow-hidden relative border-2 border-stone-300 flex flex-col justify-end">
                  <div
                    className="w-full bg-gradient-to-t from-teal-600 to-cyan-400 transition-all duration-300"
                    style={{ height: `${fieldTengah}%` }}
                  ></div>
                  <div className="absolute inset-x-0 bottom-[40%] top-[20%] border-y-2 border-dashed border-emerald-500 bg-emerald-500/10 pointer-events-none flex items-center justify-center">
                    <span className="text-[9px] font-bold text-emerald-800 bg-white/80 px-1.5 py-0.2 rounded-full">
                      Zona Subur (40-80%)
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${getWaterZoneStatus(fieldTengah).color}`}>
                    {getWaterZoneStatus(fieldTengah).label}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100">
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 text-center">
                  Pintu Pembagi Tengah:
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { val: 0, label: 'Tutup' },
                    { val: 1, label: 'Sedang' },
                    { val: 2, label: 'Deras' },
                  ].map((btn) => (
                    <button
                      key={btn.val}
                      onClick={() => {
                        sound.playClick();
                        setGateMid(btn.val);
                      }}
                      className={`py-1.5 rounded-xl text-xs font-bold transition ${
                        gateMid === btn.val
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Field 3: Hilir (Bottom Terrace) */}
            <div className="bg-white rounded-3xl p-5 border-4 border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-rubik font-extrabold text-sm text-stone-800">
                    3. Petak Hilir (Bawah)
                  </span>
                  <span className="text-xs font-mono font-bold text-stone-600">
                    {Math.round(fieldHilir)}%
                  </span>
                </div>

                <div className="w-full h-24 bg-stone-100 rounded-2xl overflow-hidden relative border-2 border-stone-300 flex flex-col justify-end">
                  <div
                    className="w-full bg-gradient-to-t from-teal-600 to-cyan-400 transition-all duration-300"
                    style={{ height: `${fieldHilir}%` }}
                  ></div>
                  <div className="absolute inset-x-0 bottom-[40%] top-[20%] border-y-2 border-dashed border-emerald-500 bg-emerald-500/10 pointer-events-none flex items-center justify-center">
                    <span className="text-[9px] font-bold text-emerald-800 bg-white/80 px-1.5 py-0.2 rounded-full">
                      Zona Subur (40-80%)
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${getWaterZoneStatus(fieldHilir).color}`}>
                    {getWaterZoneStatus(fieldHilir).label}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100">
                <label className="block text-[11px] font-bold text-stone-600 mb-1.5 text-center">
                  Pintu Pembuangan Hilir:
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { val: 0, label: 'Tutup' },
                    { val: 1, label: 'Sedang' },
                    { val: 2, label: 'Deras' },
                  ].map((btn) => (
                    <button
                      key={btn.val}
                      onClick={() => {
                        sound.playClick();
                        setGateLow(btn.val);
                      }}
                      className={`py-1.5 rounded-xl text-xs font-bold transition ${
                        gateLow === btn.val
                          ? 'bg-teal-700 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: ECOSYSTEM FOOD WEB QUIZ */}
      {phase === 'ecosystem' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-emerald-400 max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase">
                Misi Bagian 2: Jaring Makanan Sawah
              </span>
              <h2 className="text-xl font-black font-fredoka text-stone-900 mt-1">
                {ECO_QUESTIONS[ecoIndex].title}
              </h2>
            </div>
            <span className="font-rubik font-bold text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-full">
              Soal {ecoIndex + 1} dari {ECO_QUESTIONS.length}
            </span>
          </div>

          <p className="text-sm font-semibold text-stone-800 leading-relaxed bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
            {ECO_QUESTIONS[ecoIndex].question}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {ECO_QUESTIONS[ecoIndex].options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrectOpt = idx === ECO_QUESTIONS[ecoIndex].correct;
              let btnClass = 'bg-stone-50 border-stone-300 hover:bg-stone-100 text-stone-800';

              if (selectedAnswer !== null) {
                if (isCorrectOpt) {
                  btnClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                } else if (isSelected) {
                  btnClass = 'bg-rose-100 border-rose-500 text-rose-950';
                } else {
                  btnClass = 'opacity-50 bg-stone-50 border-stone-200';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectEcoAnswer(idx)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm font-medium transition shadow-xs flex items-center gap-3 ${btnClass}`}
                >
                  <span className="w-7 h-7 rounded-xl bg-white border border-stone-300 flex items-center justify-center font-bold text-xs shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-semibold animate-in fade-in">
              {feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
