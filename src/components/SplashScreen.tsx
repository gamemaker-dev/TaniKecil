import React, { useState } from 'react';
import { UserProfile } from '../types';
import { sound } from '../utils/audio';

interface SplashScreenProps {
  onLogin: (updatedUser: UserProfile) => void;
  currentUser: UserProfile;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onLogin, currentUser }) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [showEditName, setShowEditName] = useState(false);

  const handleStart = () => {
    sound.playClick();
    sound.playCoin();
    onLogin({
      ...currentUser,
      name: name.trim() || 'Budi Santoso',
      email: email.trim() || 'budi.santoso@belajar.id'
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between overflow-hidden relative bg-gradient-to-b from-[#76D1F9] via-[#E1F7D5] to-[#7CB342] p-5 select-none text-center">
      {/* Illustrated Sky & Hills Backdrop */}
      <div className="absolute top-3 right-6 text-4xl animate-pulse">☀️</div>
      <div className="absolute top-8 left-5 text-2xl opacity-75">☁️</div>
      <div className="absolute top-16 right-20 text-xl opacity-60">☁️</div>

      {/* Rice Terrace Layer Art */}
      <div className="absolute bottom-0 inset-x-0 h-64 pointer-events-none flex flex-col justify-end">
        <div className="w-[120%] -ml-[10%] h-44 bg-[#689F38] rounded-t-[140px] opacity-80"></div>
        <div className="w-[130%] -ml-[15%] h-32 bg-[#558B2F] rounded-t-[120px] -mt-16 shadow-lg relative">
          <span className="absolute top-3 left-16 text-3xl">🌾</span>
          <span className="absolute top-5 right-20 text-3xl">🌾</span>
          <span className="absolute top-8 left-36 text-2xl">🌱</span>
        </div>
      </div>

      {/* Top Branding & Mascot */}
      <div className="relative z-10 pt-4 flex flex-col items-center">
        {/* Mascot inside round badge with caping hat */}
        <div className="relative mb-3">
          <div className="w-32 h-32 rounded-full bg-gradient-to-b from-amber-100 to-white border-4 border-amber-400 shadow-xl flex items-center justify-center relative transform hover:scale-105 transition">
            <span className="text-6xl animate-bounce">🧑‍🌾</span>
            
            {/* Indonesian Caping Badge */}
            <div className="absolute -top-3.5 bg-amber-500 text-stone-900 border-2 border-white text-[11px] font-rubik font-extrabold px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
              <span>👒</span> <span>Caping Petani</span>
            </div>
          </div>
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-green-800 text-white font-rubik font-bold text-[10px] px-3.5 py-0.5 rounded-full border border-green-300 shadow">
            Fase B & C (SD)
          </div>
        </div>

        <h2 className="font-rubik font-black text-3xl sm:text-4xl text-stone-900 leading-tight drop-shadow-sm mt-3">
          Petualangan<br />
          <span className="text-green-800 underline decoration-amber-400 decoration-wavy">Tani Cilik</span>
        </h2>

        <div className="inline-flex items-center gap-1.5 bg-amber-100/90 text-amber-950 px-3.5 py-1 rounded-full text-xs font-rubik font-bold border border-amber-300 mt-2 shadow-xs">
          <span>Ayo jadi petani hebat!</span> 🌾🧑‍🌾
        </div>

        <p className="text-xs text-stone-700 font-semibold mt-2.5 max-w-[280px] leading-relaxed bg-white/70 backdrop-blur-xs py-2 px-3 rounded-2xl border border-white/60">
          Belajar sains IPAS padi, air, cacing sahabat & cuaca lewat petualangan arcade seru!
        </p>

        {/* Optional student name quick switcher */}
        {showEditName ? (
          <div className="mt-3 bg-white/95 p-3 rounded-2xl border border-green-300 shadow-md text-left w-full max-w-xs space-y-2">
            <div>
              <label className="text-[10px] font-bold text-stone-700">Nama Siswa:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-2.5 py-1 text-xs border border-stone-300 rounded-lg font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-700">Email Belajar.id:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2.5 py-1 text-xs border border-stone-300 rounded-lg font-mono text-[11px]"
              />
            </div>
            <button
              onClick={() => setShowEditName(false)}
              className="w-full py-1 rounded-lg bg-green-700 text-white font-rubik text-xs font-bold"
            >
              Simpan Profil
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowEditName(true)}
            className="mt-2 text-[11px] text-green-900 font-bold hover:underline bg-white/50 px-2 py-0.5 rounded-full"
          >
            Siswa: <u>{name}</u> (Ganti Nama)
          </button>
        )}
      </div>

      {/* Bottom Single CTA Login */}
      <div className="relative z-10 pb-6 w-full flex flex-col items-center">
        <button
          onClick={handleStart}
          className="w-full max-w-sm py-4 px-4 rounded-2xl btn-chunky-yellow text-stone-900 font-rubik font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 shadow-lg"
        >
          {/* Google Icon */}
          <div className="w-7 h-7 rounded-full bg-white p-1 shadow flex items-center justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <span>Masuk dengan Google</span>
        </button>

        <p className="text-[11px] font-bold text-stone-900 mt-2.5 bg-white/80 px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1.5">
          <span>✨ 1-Klik Masuk Terhubung Akun Belajar.id</span>
        </p>

        <div className="mt-4 pt-3 border-t border-green-200/60 w-full max-w-sm flex items-center justify-between text-[11px] text-green-900 font-bold">
          <span>Untuk Siswa SD Kelas 4–6</span>
          <span className="flex gap-2 text-sm">🌱 💧 🌾</span>
        </div>
      </div>
    </div>
  );
};
