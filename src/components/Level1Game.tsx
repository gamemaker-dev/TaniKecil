import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

interface Level1GameProps {
  onComplete: (score: number, stars: number, coins: number, accuracy: number) => void;
  onExit: () => void;
}

interface Question {
  id: number;
  question: string;
  category: 'organ' | 'bibit';
  illustration: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'organ',
    question: 'Bagian tumbuhan yang bertugas menyerap air dan mineral dari dalam tanah serta menopang tanaman adalah...',
    illustration: '🌱',
    options: ['Akar', 'Batang', 'Daun', 'Bunga'],
    correctAnswer: 'Akar',
    explanation: 'Hebat! Akar menyerap air dan hara mineral dari dalam tanah serta memperkokoh tanaman berdiri tegak.',
  },
  {
    id: 2,
    category: 'organ',
    question: 'Organ tempat terjadinya proses FOTOSINTESIS dengan bantuan sinar matahari dan klorofil adalah...',
    illustration: '🍃',
    options: ['Bunga', 'Daun', 'Batang', 'Akar'],
    correctAnswer: 'Daun',
    explanation: 'Tepat sekali! Daun memiliki zat hijau daun (klorofil) yang mengolah karbon dioksida dan air menjadi glukosa oksigen!',
  },
  {
    id: 3,
    category: 'bibit',
    question: 'Biji berbentuk lonjong kuning keemasan berkulit gabah ini adalah bibit makanan pokok utama Indonesia, yaitu...',
    illustration: '🌾',
    options: ['Bibit Padi', 'Bibit Jagung', 'Bibit Kedelai', 'Bibit Gandum'],
    correctAnswer: 'Bibit Padi',
    explanation: 'Benar! Gabah adalah bibit padi yang akan tumbuh menjadi tanaman padi penghasil beras makanan pokok kita.',
  },
  {
    id: 4,
    category: 'organ',
    question: 'Bagian tanaman yang berfungsi sebagai alat perkembangbiakan generatif (penyerbukan antara serbuk sari dan putik) adalah...',
    illustration: '🌸',
    options: ['Batang', 'Daun', 'Bunga', 'Buah'],
    correctAnswer: 'Bunga',
    explanation: 'Keren! Bunga memiliki serbuk sari (jantan) dan kepala putik (betina) untuk pembuahan membentuk biji baru.',
  },
  {
    id: 5,
    category: 'bibit',
    question: 'Biji berwarna kuning cerah tebal yang menjadi bahan baku pakan ternak dan jagung rebus manis adalah...',
    illustration: '🌽',
    options: ['Biji Kopi', 'Biji Jagung', 'Biji Cabai', 'Biji Tomat'],
    correctAnswer: 'Biji Jagung',
    explanation: 'Mantap! Biji jagung kaya karbohidrat dan sangat mudah ditanam di lahan tegalan atau sawah tadah hujan.',
  },
  {
    id: 6,
    category: 'organ',
    question: 'Bagian yang mengalirkan air dari akar ke daun serta mengedarkan hasil fotosintesis ke seluruh tubuh tumbuhan adalah...',
    illustration: '🎋',
    options: ['Batang (Xilem & Floem)', 'Buah Manis', 'Ujung Daun', 'Kelopak Bunga'],
    correctAnswer: 'Batang (Xilem & Floem)',
    explanation: 'Luar biasa! Batang memiliki pembuluh kayu (xilem) untuk air dan pembuluh tapis (floem) untuk hasil fotosintesis.',
  },
  {
    id: 7,
    category: 'bibit',
    question: 'Biji kecil berkhasiat tinggi yang menjadi bahan utama tempe dan tahu makanan khas nusantara adalah...',
    illustration: '🥜',
    options: ['Kedelai', 'Kacang Merah', 'Kacang Hijau', 'Wijen'],
    correctAnswer: 'Kedelai',
    explanation: 'Bagus sekali! Kedelai adalah tanaman legum kaya protein nabati yang sangat menyehatkan tanah karena mengikat nitrogen.',
  },
];

export const Level1Game: React.FC<Level1GameProps> = ({ onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const currentQ = QUESTIONS[currentIndex];

  useEffect(() => {
    if (isAnswered) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered]);

  const handleTimeOut = () => {
    sound.playError();
    setIsAnswered(true);
    setIsCorrect(false);
    setSelectedOption('Waktu Habis');
    setStreak(0);
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const correct = opt === currentQ.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      sound.playSuccessChime();
      const points = 100 + streak * 20 + Math.floor(timeLeft * 2);
      setScore((prev) => prev + points);
      setStreak((prev) => prev + 1);
      setCorrectCount((prev) => prev + 1);
    } else {
      sound.playError();
      setStreak(0);
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex + 1 < QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setTimeLeft(30);
    } else {
      // Finished level
      const accuracy = Math.round((correctCount / QUESTIONS.length) * 100);
      let stars = 1;
      if (accuracy >= 85) stars = 3;
      else if (accuracy >= 60) stars = 2;

      const coinsEarned = Math.floor(score / 5) + stars * 25;
      sound.playFanfare();
      onComplete(score, stars, coinsEarned, accuracy);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Top Game Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-lg border-2 border-emerald-300 mb-6">
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

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Soal {currentIndex + 1} / {QUESTIONS.length}
            </span>
            <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full text-xs font-black text-amber-900">
              <span>🔥 Streak: {streak}</span>
            </div>
          </div>
        </div>

        {/* Progress bar and Score bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-semibold text-stone-500 mb-1">
              <span>Waktu Menjawab</span>
              <span className={timeLeft <= 5 ? 'text-rose-600 font-extrabold animate-pulse' : 'text-stone-700'}>
                ⏱️ {timeLeft}s
              </span>
            </div>
            <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 5 ? 'bg-rose-500' : timeLeft <= 10 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-stone-900 text-amber-400 font-fredoka text-lg font-black px-4 py-1.5 rounded-2xl border-2 border-amber-400/50 shadow-inner">
            {score} pts
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-emerald-400 relative">
        <div className="text-center mb-6">
          <div className="inline-block p-4 rounded-3xl bg-emerald-50 border-2 border-emerald-200 text-6xl sm:text-7xl shadow-inner mb-3">
            {currentQ.illustration}
          </div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 mb-1">
            Kategori: {currentQ.category === 'organ' ? 'Morfologi & Organ Tanaman' : 'Eksplorasi Bibit Tani'}
          </div>
          <h2 className="text-base sm:text-lg font-bold text-stone-900 leading-snug font-fredoka max-w-lg mx-auto">
            {currentQ.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {currentQ.options.map((opt) => {
            const isChosen = selectedOption === opt;
            const isTheRightOne = opt === currentQ.correctAnswer;

            let btnClass = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800';
            if (isAnswered) {
              if (isTheRightOne) {
                btnClass = 'bg-emerald-500 border-emerald-600 text-white font-black shadow-md';
              } else if (isChosen) {
                btnClass = 'bg-rose-500 border-rose-600 text-white font-black';
              } else {
                btnClass = 'bg-stone-100 border-stone-200 text-stone-400 opacity-60';
              }
            }

            return (
              <button
                key={opt}
                disabled={isAnswered}
                onClick={() => handleSelectOption(opt)}
                className={`p-4 rounded-2xl border-2 text-sm font-bold text-left transition-all active:scale-98 flex items-center justify-between ${btnClass}`}
              >
                <span>{opt}</span>
                {isAnswered && isTheRightOne && <span className="text-lg">✅</span>}
                {isAnswered && isChosen && !isTheRightOne && <span className="text-lg">❌</span>}
              </button>
            );
          })}
        </div>

        {/* Explanation Card when answered */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl mb-6 border-2 transition-all ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2 font-black text-sm mb-1">
              <span>{isCorrect ? '🎉 Benar Banget!' : '💡 Pembahasan IPAS:'}</span>
            </div>
            <p className="text-xs leading-relaxed font-medium">{currentQ.explanation}</p>
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-base shadow-lg transition-transform active:scale-98 font-fredoka flex items-center justify-center gap-2"
          >
            <span>{currentIndex + 1 < QUESTIONS.length ? 'Lanjut ke Soal Berikutnya' : 'Lihat Hasil & Rekam Nilai'}</span>
            <span>➔</span>
          </button>
        )}
      </div>
    </div>
  );
};
