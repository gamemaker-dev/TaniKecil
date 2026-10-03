import React from 'react';
import { UserProfile, LevelInfo } from '../types';
import { sound } from '../utils/audio';

interface MapScreenProps {
  currentUser: UserProfile;
  onSelectLevel: (levelId: number) => void;
  onOpenLeaderboard: () => void;
  onOpenStudyMaterial: () => void;
  onOpenShop: () => void;
  onOpenGoogleSheets: () => void;
  levelScores: Record<number, { stars: number; highScore: number }>;
}

export const LEVELS: LevelInfo[] = [
  {
    id: 1,
    title: 'Level 1: Kenali Organ & Bibit',
    subtitle: 'Fase B: Mengenal bagian tumbuhan dan bibit tanaman pangan unggul',
    description: 'Pelajari fungsi akar, batang, daun, bunga, serta tebak bibit padi, jagung, dan sayuran!',
    icon: '🌱',
    themeColor: 'emerald',
    unlocked: true,
    requiredStars: 0,
    targetScore: 300,
    badgeAwarded: 'Sahabat Bibit Hijau',
  },
  {
    id: 2,
    title: 'Level 2: Olah Tanah & Nutrisi',
    subtitle: 'Fase B & C: Mengelola air, kompos organik, dan sinar fotosintesis',
    description: 'Bantu bibit tumbuh subur dengan menjaga keseimbangan air, pupuk organik, dan cahaya!',
    icon: '💧',
    themeColor: 'blue',
    unlocked: true,
    requiredStars: 1,
    targetScore: 400,
    badgeAwarded: 'Penjaga Tanah Subur',
  },
  {
    id: 3,
    title: 'Level 3: Basmi Hama Sahabat Petani',
    subtitle: 'Fase C: Pengendalian hama terpadu & perlindungan serangga penyerbuk',
    description: 'Tangkap wereng & ulat perusak! Hati-hati jangan semprot lebah madu & kepik sahabat petani!',
    icon: '🐞',
    themeColor: 'amber',
    unlocked: true,
    requiredStars: 3,
    targetScore: 500,
    badgeAwarded: 'Pendekar Tani Organik',
  },
  {
    id: 4,
    title: 'Level 4: Panen Raya & Pasar Tani',
    subtitle: 'Fase B & C: Memanen hasil kebun & menghitung keuntungan ekonomi tani',
    description: 'Petik sayur buah segar ke keranjang panen dan jual di pasar tani desa!',
    icon: '🌽',
    themeColor: 'orange',
    unlocked: true,
    requiredStars: 6,
    targetScore: 600,
    badgeAwarded: 'Juragan Panen Makmur',
  },
];

export const MapScreen: React.FC<MapScreenProps> = ({
  currentUser,
  onSelectLevel,
  onOpenLeaderboard,
  onOpenStudyMaterial,
  onOpenShop,
  onOpenGoogleSheets,
  levelScores,
}) => {
  const totalStarsEarned = Object.values(levelScores).reduce((acc, curr) => acc + (curr?.stars || 0), 0);

  return (
    <div className="relative min-h-[calc(100vh-74px)] bg-[#E8F5E9] overflow-hidden pb-16">
      {/* Cartoon Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-10 -left-10 w-96 h-96 rounded-full bg-emerald-300 blur-3xl" />
        <div className="absolute top-1/2 -right-10 w-96 h-96 rounded-full bg-amber-200 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-blue-200 blur-3xl" />
      </div>

      {/* Decorative Cloud Row */}
      <div className="w-full flex justify-between px-6 pt-3 pointer-events-none opacity-80">
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xs px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-800 shadow-xs border border-white">
          <span>🌤️ Cuaca Subur Hari Ini: Cerah Berawan</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onOpenStudyMaterial();
            }}
            className="pointer-events-auto flex items-center gap-1.5 bg-white/90 hover:bg-white text-emerald-800 px-3.5 py-1.5 rounded-full text-xs font-bold border-2 border-emerald-200 hover:border-emerald-400 shadow-xs transition"
          >
            <span>📖</span>
            <span>Buku Materi IPAS</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenGoogleSheets();
            }}
            className="pointer-events-auto flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm transition"
          >
            <span>📊</span>
            <span>Database Nilai Guru</span>
          </button>
        </div>
      </div>

      {/* Top Banner / Student Greeting */}
      <div className="max-w-4xl mx-auto px-4 mt-4 mb-6">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 rounded-3xl p-5 sm:p-6 text-white shadow-lg border-4 border-emerald-400/40 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 text-8xl opacity-15 select-none pointer-events-none">
            🚜
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/50 backdrop-blur-sm flex items-center justify-center text-3xl shadow-inner">
                🤠
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold tracking-wide uppercase mb-1">
                  <span>🌾 Petani Muda SD</span>
                  <span>•</span>
                  <span>{currentUser.school || 'SDN Nusantara 01'}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold font-fredoka leading-tight">
                  Halo, {currentUser.name || 'Petani Hebat'}!
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                  Kelas {currentUser.grade || '4 SD'} | Siap menjelajahi 4 misi pertanian nusantara?
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <div className="bg-black/25 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20 text-center min-w-[85px]">
                <div className="text-[10px] uppercase font-bold text-amber-300">Total Bintang</div>
                <div className="text-xl font-extrabold text-white flex items-center justify-center gap-1">
                  <span>⭐</span>
                  <span>{totalStarsEarned}/12</span>
                </div>
              </div>

              <div className="bg-black/25 backdrop-blur-sm px-4 py-2 rounded-2xl border border-white/20 text-center min-w-[85px]">
                <div className="text-[10px] uppercase font-bold text-yellow-300">Koin Panen</div>
                <div className="text-xl font-extrabold text-white flex items-center justify-center gap-1">
                  <span>🪙</span>
                  <span>{currentUser.coins}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map Path with Level Nodes */}
      <div className="max-w-3xl mx-auto px-4 relative">
        {/* Curvy Path Background Connector Line */}
        <div className="hidden sm:block absolute left-1/2 top-12 bottom-16 -translate-x-1/2 w-4 bg-gradient-to-b from-amber-300 via-emerald-400 to-amber-500 rounded-full border-2 border-dashed border-amber-600/30 z-0" />

        <div className="space-y-6 sm:space-y-8 relative z-10">
          {LEVELS.map((level, idx) => {
            const userScore = levelScores[level.id];
            const stars = userScore?.stars || 0;
            const highScore = userScore?.highScore || 0;
            const isLocked = totalStarsEarned < level.requiredStars;
            const isLeft = idx % 2 === 0;

            return (
              <div
                key={level.id}
                className={`flex flex-col sm:flex-row items-center gap-4 ${
                  isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                {/* Level Card */}
                <div
                  onClick={() => {
                    if (isLocked) {
                      sound.playError();
                      return;
                    }
                    sound.playClick();
                    onSelectLevel(level.id);
                  }}
                  className={`w-full sm:w-[46%] p-5 rounded-3xl border-4 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl ${
                    isLocked
                      ? 'bg-stone-200/90 border-stone-300 opacity-70 grayscale cursor-not-allowed'
                      : 'bg-white border-emerald-400/80 hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      <span>{level.icon}</span>
                      <span>Misi ke-{level.id}</span>
                    </span>

                    {/* Star ratings */}
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      {[1, 2, 3].map((s) => (
                        <span
                          key={s}
                          className={`text-sm transition-transform ${
                            s <= stars ? 'opacity-100 scale-110' : 'opacity-25 grayscale'
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-stone-800 font-fredoka leading-snug">
                    {level.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {level.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div>
                      {highScore > 0 ? (
                        <span className="font-semibold text-emerald-700">
                          Skor Terbaik: <span className="font-extrabold text-stone-900">{highScore}</span>
                        </span>
                      ) : (
                        <span className="text-stone-400 italic">Belum dimainkan</span>
                      )}
                    </div>

                    {isLocked ? (
                      <div className="flex items-center gap-1 text-stone-500 font-bold text-[11px]">
                        <span>🔒 Butuh {level.requiredStars} ⭐</span>
                      </div>
                    ) : (
                      <button className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition">
                        Main Sekarang ▶
                      </button>
                    )}
                  </div>
                </div>

                {/* Big Center Node Circle for the Map Path */}
                <div className="relative flex items-center justify-center">
                  <button
                    onClick={() => {
                      if (!isLocked) {
                        sound.playClick();
                        onSelectLevel(level.id);
                      } else {
                        sound.playError();
                      }
                    }}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center border-4 shadow-lg transition-transform active:scale-95 ${
                      isLocked
                        ? 'bg-stone-300 border-stone-400 text-stone-500'
                        : stars === 3
                        ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 border-amber-500 text-white ring-4 ring-amber-200'
                        : 'bg-gradient-to-tr from-emerald-500 to-teal-400 border-white text-white ring-4 ring-emerald-200 hover:scale-105'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl leading-none">
                      {isLocked ? '🔒' : level.icon}
                    </span>
                    <span className="text-[10px] font-black uppercase mt-1">
                      {isLocked ? `Lvl ${level.id}` : stars === 3 ? 'Selesai' : `Lvl ${level.id}`}
                    </span>
                  </button>

                  {/* Little Mascot Indicator on current highest unlocked level */}
                  {!isLocked && stars < 3 && (
                    <div className="absolute -top-3 -right-2 bg-amber-400 border-2 border-white text-stone-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-md animate-bounce">
                      AYO!
                    </div>
                  )}
                </div>

                {/* Spacer on desktop to balance alternating layout */}
                <div className="hidden sm:block w-[46%]" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Action Menu at the bottom */}
      <div className="max-w-xl mx-auto px-4 mt-10">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 shadow-xl border-2 border-emerald-200 flex items-center justify-around gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard();
            }}
            className="flex-1 py-2 px-3 rounded-xl hover:bg-emerald-50 flex items-center justify-center gap-2 text-stone-700 font-bold text-xs transition"
          >
            <span className="text-lg">🏆</span>
            <span>Papan Skor</span>
          </button>

          <div className="w-px h-6 bg-stone-200" />

          <button
            onClick={() => {
              sound.playClick();
              onOpenStudyMaterial();
            }}
            className="flex-1 py-2 px-3 rounded-xl hover:bg-emerald-50 flex items-center justify-center gap-2 text-stone-700 font-bold text-xs transition"
          >
            <span className="text-lg">📚</span>
            <span>Materi IPAS</span>
          </button>

          <div className="w-px h-6 bg-stone-200" />

          <button
            onClick={() => {
              sound.playClick();
              onOpenShop();
            }}
            className="flex-1 py-2 px-3 rounded-xl hover:bg-emerald-50 flex items-center justify-center gap-2 text-stone-700 font-bold text-xs transition"
          >
            <span className="text-lg">🤠</span>
            <span>Toko Petani</span>
          </button>
        </div>
      </div>
    </div>
  );
};
