import React, { useState } from 'react';
import { UserProfile } from '../types';
import { sound } from '../utils/audio';

interface NavbarProps {
  currentUser: UserProfile;
  currentScreen: string;
  isLoggedIn?: boolean;
  onNavigate: (screen: string) => void;
  onOpenGoogleSheets: () => void;
  onOpenTeacherGradebook?: () => void;
  onOpenStudyMaterial?: () => void;
  onOpenShop?: () => void;
  onOpenCostume?: () => void;
  onOpenReport?: () => void;
  onLogout?: () => void;
  soundMuted?: boolean;
  onToggleSound?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentScreen,
  isLoggedIn = false,
  onNavigate,
  onOpenGoogleSheets,
  onOpenTeacherGradebook,
  onOpenStudyMaterial,
  onOpenShop,
  onOpenCostume,
  onOpenReport,
  onLogout,
  soundMuted,
  onToggleSound,
}) => {
  const [isMutedLocal, setIsMutedLocal] = useState(sound.getMuted());
  const isTeacher = currentUser.role === 'Guru';

  const handleToggleSound = () => {
    if (onToggleSound) {
      onToggleSound();
    } else {
      const next = sound.toggleMute();
      setIsMutedLocal(next);
    }
  };

  const currentMuted = soundMuted !== undefined ? soundMuted : isMutedLocal;

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-stone-200/90 sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            sound.playClick();
            onNavigate('map');
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white text-lg shadow-sm border border-green-600 group-hover:scale-105 transition">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-rubik font-extrabold text-sm sm:text-base text-stone-900 leading-tight">
                Tani Kecil
              </span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full border border-amber-300">
                IPAS SD
              </span>
            </div>
            <p className="text-[10px] text-stone-500 font-medium hidden sm:block leading-tight">
              Kurikulum Merdeka Fase B & C
            </p>
          </div>
        </div>

        {/* Center Nav Links & Right Stats (Only shown when logged in and not on splash) */}
        {(!isLoggedIn || currentScreen === 'splash') ? (
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-rubik font-bold flex items-center gap-1.5 shadow-2xs">
              <span>🌾</span>
              <span>Portal Masuk Guru & Murid</span>
            </div>
            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={currentMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
              className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 flex items-center justify-center text-sm shadow-xs transition"
            >
              {currentMuted ? '🔇' : '🔊'}
            </button>
          </div>
        ) : (
          <>
            {/* Center Nav Links */}
            <nav className="hidden md:flex items-center gap-1.5 bg-stone-100/90 p-1 rounded-2xl text-xs font-rubik font-bold">
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('map');
                }}
                className={`px-3 py-1.5 rounded-xl transition ${
                  currentScreen === 'map'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🌾 Peta Misi
              </button>

              {/* KHUSUS GURU: DAFTAR NILAI SISWA */}
              {isTeacher && onOpenTeacherGradebook && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenTeacherGradebook();
                  }}
                  className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1 ${
                    currentScreen === 'teacher-gradebook'
                      ? 'bg-amber-500 text-stone-900 font-black shadow-xs'
                      : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                  }`}
                >
                  <span>📋</span>
                  <span>Daftar Nilai Guru</span>
                </button>
              )}

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('leaderboard');
                }}
                className={`px-3 py-1.5 rounded-xl transition ${
                  currentScreen === 'leaderboard'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                🏆 Peringkat
              </button>

              {onOpenStudyMaterial && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenStudyMaterial();
                  }}
                  className="px-3 py-1.5 rounded-xl text-stone-600 hover:text-stone-900 transition flex items-center gap-1"
                >
                  <span>📖 Materi IPAS</span>
                </button>
              )}

              {onOpenShop && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenShop();
                  }}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    currentScreen === 'shop'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  🤠 Toko Caping
                </button>
              )}

              <button
                onClick={() => {
                  sound.playClick();
                  onOpenGoogleSheets();
                }}
                className="px-3 py-1.5 rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition flex items-center gap-1"
              >
                <span>📊 Database Sheets</span>
              </button>
            </nav>

            {/* Right Stats & User Pills */}
            <div className="flex items-center gap-2">
              {/* User Role Badge */}
              <div
                className={`px-2.5 py-1 rounded-full text-xs font-rubik font-bold flex items-center gap-1 shadow-2xs ${
                  isTeacher
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}
              >
                <span>{isTeacher ? '👨‍🏫' : '🧑‍🎓'}</span>
                <span className="hidden sm:inline">{currentUser.role}</span>
              </div>

              {/* Sound Toggle */}
              <button
                onClick={handleToggleSound}
                title={currentMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 flex items-center justify-center text-sm shadow-xs transition"
              >
                {currentMuted ? '🔇' : '🔊'}
              </button>

              {/* Koin Pill */}
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-rubik font-bold text-amber-950 shadow-2xs">
                <span>🪙</span>
                <span>{currentUser.coins}</span>
              </div>

              {/* User Name Pill */}
              <div className="flex items-center gap-1.5 bg-stone-100 border border-stone-300 p-1 pr-2 rounded-full">
                <div className="w-6 h-6 rounded-full bg-green-200 border border-green-600 flex items-center justify-center text-xs">
                  {currentUser.capingStyle === 'caping_emas' ? '👑' : '🤠'}
                </div>
                <span className="text-xs font-rubik font-bold text-stone-800 hidden sm:inline">
                  {currentUser.name ? currentUser.name.split(' ')[0] : 'User'}
                </span>
              </div>

              {/* Logout / Switch User Button */}
              {onLogout && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onLogout();
                  }}
                  title="Keluar / Ganti Akun"
                  className="w-8 h-8 rounded-full bg-stone-100 hover:bg-rose-100 text-stone-600 hover:text-rose-700 border border-stone-300 flex items-center justify-center text-xs font-bold transition shadow-xs"
                >
                  🚪
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};
