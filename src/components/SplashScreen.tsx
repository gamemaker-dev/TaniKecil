import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { sheetsDB } from '../services/googleSheetsService';
import { sound } from '../utils/audio';

interface SplashScreenProps {
  onLogin: (updatedUser: UserProfile) => void;
  currentUser: UserProfile;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onLogin, currentUser }) => {
  const [activeRole, setActiveRole] = useState<UserRole>('Murid');
  const [muridMode, setMuridMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [nisInput, setNisInput] = useState<string>(currentUser.nis || '1001');
  const [pinInput, setPinInput] = useState<string>('1234');

  // Teacher login state
  const [guruMode, setGuruMode] = useState<'login' | 'register'>('login');
  const [nipInput, setNipInput] = useState<string>('GURU123');
  const [teacherPinInput, setTeacherPinInput] = useState<string>('guru123');

  // Teacher register state
  const [regGuruUsername, setRegGuruUsername] = useState<string>('');
  const [regGuruName, setRegGuruName] = useState<string>('');
  const [regGuruTitle, setRegGuruTitle] = useState<string>('Guru IPAS SD');
  const [regGuruSchool, setRegGuruSchool] = useState<string>('SDN 01 Percontohan');
  const [regGuruPassword, setRegGuruPassword] = useState<string>('');
  const [regGuruConfirmPassword, setRegGuruConfirmPassword] = useState<string>('');

  // Register form state
  const [regNis, setRegNis] = useState<string>('');
  const [regName, setRegName] = useState<string>('');
  const [regGrade, setRegGrade] = useState<string>('Kelas 4A');
  const [regSchool, setRegSchool] = useState<string>('SDN 01 Percontohan');
  const [regPin, setRegPin] = useState<string>('1234');

  // Status message
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Password visibility state toggles
  const [showPin, setShowPin] = useState<boolean>(false);
  const [showTeacherPass, setShowTeacherPass] = useState<boolean>(false);
  const [showRegPin, setShowRegPin] = useState<boolean>(false);
  const [showRegTeacherPass, setShowRegTeacherPass] = useState<boolean>(false);

  // Handle Student Login
  const handleMuridLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nisInput.trim()) {
      setStatusMsg({ text: 'Mohon masukkan NIS Anda!', isError: true });
      sound.playError();
      return;
    }

    setIsLoading(true);
    setStatusMsg({ text: 'Memeriksa kecocokan data di Google Spreadsheet...', isError: false });

    const res = await sheetsDB.loginUser({
      role: 'Murid',
      nis: nisInput.trim(),
      password: pinInput.trim(),
    });

    setIsLoading(false);

    if (res.success && res.user) {
      sound.playCoin();
      setStatusMsg({ text: res.message, isError: false });
      setTimeout(() => {
        onLogin(res.user!);
      }, 500);
    } else {
      sound.playError();
      setStatusMsg({ text: res.message, isError: true });
    }
  };

  // Handle Student Registration
  const handleMuridRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNis.trim() || !regName.trim()) {
      setStatusMsg({ text: 'NIS dan Nama Lengkap wajib diisi!', isError: true });
      sound.playError();
      return;
    }

    setIsLoading(true);
    setStatusMsg({ text: 'Mendaftarkan dan menyimpan data ke Google Spreadsheet...', isError: false });

    const res = await sheetsDB.registerUser({
      role: 'Murid',
      nis: regNis.trim(),
      name: regName.trim(),
      grade: regGrade,
      school: regSchool.trim(),
      password: regPin.trim(),
    });

    setIsLoading(false);

    if (res.success && res.user) {
      sound.playFanfare();
      setStatusMsg({ text: res.message, isError: false });
      setTimeout(() => {
        onLogin(res.user!);
      }, 700);
    } else {
      sound.playError();
      setStatusMsg({ text: res.message, isError: true });
    }
  };

  // Handle Teacher Login
  const handleGuruLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nipInput.trim()) {
      setStatusMsg({ text: 'Mohon masukkan Username / NIP Guru!', isError: true });
      sound.playError();
      return;
    }

    if (!teacherPinInput.trim()) {
      setStatusMsg({ text: 'Mohon masukkan Kata Sandi Guru!', isError: true });
      sound.playError();
      return;
    }

    setIsLoading(true);
    setStatusMsg({ text: 'Memverifikasi kredensial guru di Google Spreadsheet...', isError: false });

    const res = await sheetsDB.loginUser({
      role: 'Guru',
      nis: nipInput.trim(),
      password: teacherPinInput.trim(),
    });

    setIsLoading(false);

    if (res.success && res.user) {
      sound.playFanfare();
      setStatusMsg({ text: res.message, isError: false });
      setTimeout(() => {
        onLogin(res.user!);
      }, 500);
    } else {
      sound.playError();
      setStatusMsg({ text: res.message, isError: true });
    }
  };

  // Handle Teacher Registration
  const handleGuruRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regGuruUsername.trim() || !regGuruName.trim() || !regGuruPassword.trim()) {
      setStatusMsg({ text: 'Username/NIP, Nama Lengkap, dan Kata Sandi Guru wajib diisi!', isError: true });
      sound.playError();
      return;
    }

    if (regGuruPassword.trim().length < 4) {
      setStatusMsg({ text: 'Kata Sandi Guru minimal 4 karakter!', isError: true });
      sound.playError();
      return;
    }

    if (regGuruPassword !== regGuruConfirmPassword) {
      setStatusMsg({ text: 'Konfirmasi Kata Sandi tidak cocok!', isError: true });
      sound.playError();
      return;
    }

    setIsLoading(true);
    setStatusMsg({ text: 'Mendaftarkan Akun Guru ke Google Spreadsheet...', isError: false });

    const res = await sheetsDB.registerUser({
      role: 'Guru',
      nis: regGuruUsername.trim(),
      name: regGuruName.trim(),
      grade: regGuruTitle.trim(),
      school: regGuruSchool.trim(),
      password: regGuruPassword.trim(),
    });

    setIsLoading(false);

    if (res.success && res.user) {
      sound.playFanfare();
      setStatusMsg({ text: res.message, isError: false });
      setTimeout(() => {
        onLogin(res.user!);
      }, 700);
    } else {
      sound.playError();
      setStatusMsg({ text: res.message, isError: true });
    }
  };

  // Handle Instant Direct Login from the Quick Account Cards
  const handleDirectLogin = async (role: UserRole, nisOrUsername: string, pass: string) => {
    sound.playClick();
    setIsLoading(true);
    setStatusMsg({ text: `Memverifikasi & masuk sebagai ${role} (${nisOrUsername})...`, isError: false });

    // Update state fields
    if (role === 'Guru') {
      setActiveRole('Guru');
      setGuruMode('login');
      setNipInput(nisOrUsername);
      setTeacherPinInput(pass);
    } else {
      setActiveRole('Murid');
      setMuridMode('login');
      setNisInput(nisOrUsername);
      setPinInput(pass);
    }

    const res = await sheetsDB.loginUser({
      role,
      nis: nisOrUsername,
      password: pass,
    });

    setIsLoading(false);

    if (res.success && res.user) {
      sound.playFanfare();
      setStatusMsg({ text: `✅ Berhasil masuk! Selamat datang, ${res.user.name}!`, isError: false });
      setTimeout(() => {
        onLogin(res.user!);
      }, 350);
    } else {
      sound.playError();
      setStatusMsg({ text: res.message, isError: true });
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between overflow-hidden relative bg-gradient-to-b from-[#76D1F9] via-[#E1F7D5] to-[#7CB342] p-4 sm:p-6 select-none text-center min-h-[calc(100vh-74px)]">
      {/* Decorative Atmosphere Art */}
      <div className="absolute top-3 right-6 text-4xl animate-pulse pointer-events-none">☀️</div>
      <div className="absolute top-8 left-5 text-2xl opacity-75 pointer-events-none">☁️</div>

      {/* Rice Terrace Layer Art */}
      <div className="absolute bottom-0 inset-x-0 h-44 pointer-events-none flex flex-col justify-end opacity-90">
        <div className="w-[120%] -ml-[10%] h-32 bg-[#689F38] rounded-t-[140px] opacity-80"></div>
        <div className="w-[130%] -ml-[15%] h-24 bg-[#558B2F] rounded-t-[120px] -mt-12 shadow-lg relative flex items-center justify-around text-2xl">
          <span>🌾</span>
          <span>🌱</span>
          <span>🌾</span>
          <span>🌱</span>
        </div>
      </div>

      {/* Main Content Card Container */}
      <div className="relative z-10 max-w-md w-full mx-auto my-auto flex flex-col items-center">
        {/* Mascot Header */}
        <div className="relative mb-2">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-b from-amber-100 to-white border-4 border-amber-400 shadow-xl flex items-center justify-center text-4xl sm:text-5xl">
            {activeRole === 'Guru' ? '👨‍🏫' : '🧑‍🌾'}
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-800 text-white font-rubik font-bold text-[10px] px-3 py-0.5 rounded-full border border-emerald-300 shadow whitespace-nowrap">
            Kurikulum Merdeka SD
          </div>
        </div>

        <h1 className="font-rubik font-black text-2xl sm:text-3xl text-stone-900 leading-tight drop-shadow-xs mt-1">
          Petualangan <span className="text-emerald-800 underline decoration-amber-400 decoration-wavy">Tani Cilik</span>
        </h1>
        <p className="text-xs text-stone-700 font-semibold mt-1">
          Game Sains IPAS & Database Google Spreadsheet
        </p>

        {/* ROLE SELECTOR: MURID vs GURU */}
        <div className="w-full mt-4 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border-2 border-white shadow-md flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveRole('Murid');
              setStatusMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-rubik font-extrabold flex items-center justify-center gap-1.5 transition ${
              activeRole === 'Murid'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>🧑‍🎓</span>
            <span>Portal Murid</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveRole('Guru');
              setStatusMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-rubik font-extrabold flex items-center justify-center gap-1.5 transition ${
              activeRole === 'Guru'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>👨‍🏫</span>
            <span>Portal Guru</span>
          </button>
        </div>

        {/* LOGIN / REGISTER BOX */}
        <div className="w-full mt-3 bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border-4 border-stone-200/90 shadow-2xl text-left space-y-4">
          {/* Status Message Alert */}
          {statusMsg && (
            <div
              className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                statusMsg.isError
                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                  : 'bg-emerald-50 text-emerald-900 border-emerald-300'
              }`}
            >
              <span>{statusMsg.isError ? '⚠️' : '✅'}</span>
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* 1. ROLE MURID */}
          {activeRole === 'Murid' && (
            <div>
              {/* Murid Subtabs: Masuk vs Daftar */}
              <div className="flex border-b border-stone-200 mb-4 pb-2 gap-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setMuridMode('login');
                    setStatusMsg(null);
                  }}
                  className={`pb-1 transition border-b-2 ${
                    muridMode === 'login'
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-stone-400'
                  }`}
                >
                  Masuk (Sudah Ada NIS)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setMuridMode('register');
                    setStatusMsg(null);
                  }}
                  className={`pb-1 transition border-b-2 ${
                    muridMode === 'register'
                      ? 'border-emerald-600 text-emerald-800'
                      : 'border-transparent text-stone-400'
                  }`}
                >
                  Daftar Murid Baru
                </button>
              </div>

              {/* Murid Mode: LOGIN */}
              {muridMode === 'login' && (
                <form onSubmit={handleMuridLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Nomor Induk Siswa (NIS):
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 1001"
                      value={nisInput}
                      onChange={(e) => setNisInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-stone-400 block mt-0.5">
                      Data NIS akan dicocokkan otomatis dengan Google Spreadsheet.
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-stone-700">
                        PIN / Password Siswa:
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1"
                      >
                        <span>{showPin ? '🙈 Sembunyikan' : '👁️ Tampilkan Password'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPin ? 'text' : 'password'}
                        placeholder="Default: 1234"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-sm"
                        title={showPin ? 'Sembunyikan' : 'Tampilkan'}
                      >
                        {showPin ? '🙈' : '👁️'}
                      </button>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      Password bawaan murid: <code className="bg-stone-100 px-1.5 py-0.5 rounded font-bold text-stone-800">1234</code>
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl btn-chunky-green text-white font-rubik font-bold text-sm shadow-md mt-2 flex items-center justify-center gap-2"
                  >
                    <span>{isLoading ? 'Memeriksa...' : 'Masuk ke Game ▶'}</span>
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-[11px] text-stone-500">
                      Belum terdaftar di spreadsheet?{' '}
                      <button
                        type="button"
                        onClick={() => setMuridMode('register')}
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        Daftar Murid Baru
                      </button>
                    </span>
                  </div>
                </form>
              )}

              {/* Murid Mode: REGISTER */}
              {muridMode === 'register' && (
                <form onSubmit={handleMuridRegister} className="space-y-2.5 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">NIS (Nomor Induk Siswa):</label>
                    <input
                      type="text"
                      placeholder="Contoh: 1005"
                      value={regNis}
                      onChange={(e) => setRegNis(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Nama Lengkap Siswa:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Rizka Putri"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">Kelas:</label>
                      <select
                        value={regGrade}
                        onChange={(e) => setRegGrade(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold"
                      >
                        <option value="Kelas 4A">Kelas 4A</option>
                        <option value="Kelas 4B">Kelas 4B</option>
                        <option value="Kelas 5A">Kelas 5A</option>
                        <option value="Kelas 5B">Kelas 5B</option>
                        <option value="Kelas 6">Kelas 6</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">PIN Rahasia:</label>
                      <input
                        type="password"
                        placeholder="Contoh: 1234"
                        value={regPin}
                        onChange={(e) => setRegPin(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Asal Sekolah:</label>
                    <input
                      type="text"
                      value={regSchool}
                      onChange={(e) => setRegSchool(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl btn-chunky-yellow text-stone-900 font-rubik font-black text-sm shadow-md mt-2"
                  >
                    {isLoading ? 'Mendaftarkan...' : 'Daftar & Simpan ke Sheets 🌾'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 2. ROLE GURU */}
          {activeRole === 'Guru' && (
            <div className="space-y-3 text-left">
              {/* Guru Submode Switcher Tabs */}
              <div className="flex border-b border-stone-200 pb-2 gap-4 text-xs font-rubik font-bold">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setGuruMode('login');
                    setStatusMsg(null);
                  }}
                  className={`pb-1 transition flex items-center gap-1.5 ${
                    guruMode === 'login'
                      ? 'text-emerald-800 border-b-2 border-emerald-600'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <span>🔑</span> Masuk (Username & Sandi)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setGuruMode('register');
                    setStatusMsg(null);
                  }}
                  className={`pb-1 transition flex items-center gap-1.5 ${
                    guruMode === 'register'
                      ? 'text-emerald-800 border-b-2 border-emerald-600'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <span>📝</span> Daftar Akun Guru
                </button>
              </div>

              {/* Guru Mode: LOGIN */}
              {guruMode === 'login' && (
                <form onSubmit={handleGuruLogin} className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-2.5 text-[11px] text-amber-950 font-medium leading-relaxed">
                    🔐 <strong>Hak Akses Guru:</strong> Masuk untuk membuka <strong>Daftar Nilai Siswa</strong>, memantau riwayat evaluasi, dan mencetak rekap asesmen.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Username / NIP Guru:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: GURU123 atau username terdaftar"
                      value={nipInput}
                      onChange={(e) => setNipInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-stone-400 block mt-0.5">
                      Akun bawaan: <code>GURU123</code> (Kata Sandi: <code>guru123</code>)
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-stone-700">
                        Kata Sandi / Password Guru:
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowTeacherPass(!showTeacherPass)}
                        className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1"
                      >
                        <span>{showTeacherPass ? '🙈 Sembunyikan' : '👁️ Tampilkan Password'}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showTeacherPass ? 'text' : 'password'}
                        placeholder="Masukkan kata sandi guru"
                        value={teacherPinInput}
                        onChange={(e) => setTeacherPinInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowTeacherPass(!showTeacherPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-sm"
                        title={showTeacherPass ? 'Sembunyikan' : 'Tampilkan'}
                      >
                        {showTeacherPass ? '🙈' : '👁️'}
                      </button>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      Password bawaan guru: <code className="bg-stone-100 px-1.5 py-0.5 rounded font-bold text-stone-800">guru123</code>
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl btn-chunky-green text-white font-rubik font-bold text-sm shadow-md mt-2 flex items-center justify-center gap-2"
                  >
                    <span>{isLoading ? 'Memverifikasi...' : 'Masuk sebagai Guru IPAS 👨‍🏫'}</span>
                  </button>

                  <div className="flex items-center justify-between pt-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setNipInput('GURU123');
                        setTeacherPinInput('guru123');
                        sound.playPop();
                      }}
                      className="text-amber-800 underline font-semibold hover:text-amber-950"
                    >
                      Isi Demo (GURU123)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setGuruMode('register');
                      }}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      Daftar Akun Guru Baru →
                    </button>
                  </div>
                </form>
              )}

              {/* Guru Mode: REGISTER */}
              {guruMode === 'register' && (
                <form onSubmit={handleGuruRegister} className="space-y-2.5 text-xs">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 text-[11px] text-emerald-950 font-medium leading-relaxed">
                    ✨ <strong>Pendaftaran Guru Baru:</strong> Buat Username & Kata Sandi baru. Akun otomatis disimpan ke Google Spreadsheet pada lembar <code>Data_Pengguna</code>.
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-0.5">Username / NIP Guru:</label>
                    <input
                      type="text"
                      placeholder="Contoh: bu_pertiwi atau 198502..."
                      value={regGuruUsername}
                      onChange={(e) => setRegGuruUsername(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-0.5">Nama Lengkap & Gelar Guru:</label>
                    <input
                      type="text"
                      placeholder="Contoh: Dra. Siti Pertiwi, M.Pd."
                      value={regGuruName}
                      onChange={(e) => setRegGuruName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-stone-700 mb-0.5">Kata Sandi Guru:</label>
                      <input
                        type="password"
                        placeholder="Minimal 4 karakter"
                        value={regGuruPassword}
                        onChange={(e) => setRegGuruPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-0.5">Ulangi Sandi:</label>
                      <input
                        type="password"
                        placeholder="Konfirmasi sandi"
                        value={regGuruConfirmPassword}
                        onChange={(e) => setRegGuruConfirmPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-stone-700 mb-0.5">Jabatan / Mapel:</label>
                      <input
                        type="text"
                        placeholder="Contoh: Guru IPAS SD"
                        value={regGuruTitle}
                        onChange={(e) => setRegGuruTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-0.5">Asal Sekolah:</label>
                      <input
                        type="text"
                        placeholder="Contoh: SDN 01 Percontohan"
                        value={regGuruSchool}
                        onChange={(e) => setRegGuruSchool(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl btn-chunky-yellow text-stone-900 font-rubik font-black text-sm shadow-md mt-2 flex items-center justify-center gap-2"
                  >
                    <span>{isLoading ? 'Mendaftarkan...' : 'Daftar Akun Guru & Simpan ke Sheets 👨‍🏫'}</span>
                  </button>

                  <div className="text-center pt-1.5">
                    <span className="text-[11px] text-stone-500">
                      Sudah punya akun Guru?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          sound.playClick();
                          setGuruMode('login');
                        }}
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        Masuk dengan Username
                      </button>
                    </span>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* KARTU DAFTAR USERNAME & PASSWORD LOGIN (1-KLIK MASUK) */}
        <div className="w-full mt-3 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border-2 border-emerald-300 shadow-lg text-left">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-rubik font-black text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
              <span>📋</span>
              <span>Daftar Akun Login (Klik untuk Masuk Langsung):</span>
            </h3>
            <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-sm animate-pulse">
              ⚡ 1-Klik Masuk
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {/* 1. Guru Default */}
            <div
              onClick={() => {
                if (!isLoading) {
                  handleDirectLogin('Guru', 'GURU123', 'guru123');
                }
              }}
              className="p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100/90 border-2 border-amber-300 hover:border-amber-500 cursor-pointer transition flex items-center justify-between group shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">👨‍🏫</span>
                <div>
                  <div className="font-rubik font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <span>Guru IPAS (Ibu Pertiwi, S.Pd.)</span>
                    <span className="text-[9px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.2 rounded-full">
                      Pendidik
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 font-mono mt-0.5">
                    Username: <strong className="text-amber-950 font-bold">GURU123</strong> • Password: <strong className="text-amber-950 font-bold">guru123</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDirectLogin('Guru', 'GURU123', 'guru123');
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition active:scale-95 whitespace-nowrap flex items-center gap-1 group-hover:bg-amber-700"
              >
                <span>🚀 Masuk Guru</span>
              </button>
            </div>

            {/* 2. Murid 1001 */}
            <div
              onClick={() => {
                if (!isLoading) {
                  handleDirectLogin('Murid', '1001', '1234');
                }
              }}
              className="p-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100/90 border-2 border-emerald-300 hover:border-emerald-500 cursor-pointer transition flex items-center justify-between group shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🧑‍🌾</span>
                <div>
                  <div className="font-rubik font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <span>Murid 1 (Budi Santoso)</span>
                    <span className="text-[9px] bg-emerald-200 text-emerald-900 font-extrabold px-1.5 py-0.2 rounded-full">
                      Kelas 4A
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 font-mono mt-0.5">
                    NIS: <strong className="text-emerald-950 font-bold">1001</strong> • PIN: <strong className="text-emerald-950 font-bold">1234</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDirectLogin('Murid', '1001', '1234');
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition active:scale-95 whitespace-nowrap flex items-center gap-1 group-hover:bg-emerald-700"
              >
                <span>🚀 Masuk Murid</span>
              </button>
            </div>

            {/* 3. Murid 1002 */}
            <div
              onClick={() => {
                if (!isLoading) {
                  handleDirectLogin('Murid', '1002', '1234');
                }
              }}
              className="p-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100/90 border-2 border-teal-300 hover:border-teal-500 cursor-pointer transition flex items-center justify-between group shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🧑‍🌾</span>
                <div>
                  <div className="font-rubik font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <span>Murid 2 (Siti Nurhaliza)</span>
                    <span className="text-[9px] bg-teal-200 text-teal-900 font-extrabold px-1.5 py-0.2 rounded-full">
                      Kelas 4A
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 font-mono mt-0.5">
                    NIS: <strong className="text-teal-950 font-bold">1002</strong> • PIN: <strong className="text-teal-950 font-bold">1234</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDirectLogin('Murid', '1002', '1234');
                }}
                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition active:scale-95 whitespace-nowrap flex items-center gap-1 group-hover:bg-teal-700"
              >
                <span>🚀 Masuk Murid</span>
              </button>
            </div>

            {/* 4. Murid 1003 */}
            <div
              onClick={() => {
                if (!isLoading) {
                  handleDirectLogin('Murid', '1003', '1234');
                }
              }}
              className="p-2.5 rounded-2xl bg-cyan-50 hover:bg-cyan-100/90 border-2 border-cyan-300 hover:border-cyan-500 cursor-pointer transition flex items-center justify-between group shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🧑‍🌾</span>
                <div>
                  <div className="font-rubik font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <span>Murid 3 (Ahmad Rizki)</span>
                    <span className="text-[9px] bg-cyan-200 text-cyan-900 font-extrabold px-1.5 py-0.2 rounded-full">
                      Kelas 5B
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 font-mono mt-0.5">
                    NIS: <strong className="text-cyan-950 font-bold">1003</strong> • PIN: <strong className="text-cyan-950 font-bold">1234</strong>
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDirectLogin('Murid', '1003', '1234');
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-sm transition active:scale-95 whitespace-nowrap flex items-center gap-1 group-hover:bg-cyan-700"
              >
                <span>🚀 Masuk Murid</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
