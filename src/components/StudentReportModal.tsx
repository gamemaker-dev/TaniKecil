import React from 'react';
import { UserProfile } from '../types';
import { sound } from '../utils/audio';

interface StudentReportModalProps {
  currentUser: UserProfile;
  levelScores: Record<number, { stars: number; highScore: number }>;
  onClose: () => void;
}

export const StudentReportModal: React.FC<StudentReportModalProps> = ({
  currentUser,
  levelScores,
  onClose,
}) => {
  const totalStars = Object.values(levelScores).reduce((acc, curr) => acc + (curr?.stars || 0), 0);
  const totalScore = Object.values(levelScores).reduce((acc, curr) => acc + (curr?.highScore || 0), 0);

  const levelDetails = [
    { id: 1, title: 'Organ & Bibit Pangan', fase: 'Fase B', maxScore: 300 },
    { id: 2, title: 'Olah Tanah & Nutrisi', fase: 'Fase B & C', maxScore: 400 },
    { id: 3, title: 'Hama & Sahabat Petani', fase: 'Fase C', maxScore: 500 },
    { id: 4, title: 'Panen Raya & Pasar Tani', fase: 'Fase B & C', maxScore: 600 },
    { id: 5, title: 'Irigasi Subak & Ekosistem', fase: 'Fase C', maxScore: 800 },
  ];

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-emerald-600 overflow-hidden my-auto print:border-none print:shadow-none print:m-0 print:w-full">
        {/* Modal Toolbar (hidden when printing) */}
        <div className="bg-emerald-800 text-white px-5 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <span className="font-rubik font-bold text-sm">
              Rapor Capaian Belajar IPAS & Sertifikat Siswa
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-rubik font-bold text-xs flex items-center gap-1 shadow-xs transition"
            >
              <span>🖨️ Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-xs transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Certificate & Report Card Body */}
        <div className="p-6 sm:p-8 space-y-6 text-stone-800 bg-[#FCFDF9]">
          {/* Certificate Header Banner */}
          <div className="text-center border-b-2 border-emerald-700/30 pb-5">
            <div className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-black uppercase px-4 py-1 rounded-full border border-emerald-300 mb-2">
              Kurikulum Merdeka Belajar • IPAS SD Fase B & C
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-fredoka text-emerald-900 uppercase tracking-wide">
              Sertifikat Capaian Petani Cilik
            </h1>
            <p className="text-xs text-stone-600 font-medium mt-1">
              Pencatatan Otomatis Evaluasi Game Edukasi Berbasis Sains & Pertanian Berkelanjutan
            </p>
          </div>

          {/* Student Bio Grid */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-stone-400 font-bold block text-[10px] uppercase">Nama Siswa</span>
              <span className="font-rubik font-extrabold text-stone-900 text-sm">{currentUser.name}</span>
            </div>
            <div>
              <span className="text-stone-400 font-bold block text-[10px] uppercase">NISN / ID</span>
              <span className="font-mono font-bold text-stone-800">{currentUser.nisn || '-'}</span>
            </div>
            <div>
              <span className="text-stone-400 font-bold block text-[10px] uppercase">Sekolah</span>
              <span className="font-bold text-stone-800">{currentUser.school || 'SDN 01 Percontohan'}</span>
            </div>
            <div>
              <span className="text-stone-400 font-bold block text-[10px] uppercase">Kelas</span>
              <span className="font-bold text-stone-800">{currentUser.grade || 'Kelas 4'}</span>
            </div>
          </div>

          {/* Level Progression Table */}
          <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-700 text-white font-rubik font-bold">
                <tr>
                  <th className="py-2.5 px-3">No</th>
                  <th className="py-2.5 px-3">Misi Pembelajaran IPAS</th>
                  <th className="py-2.5 px-3 text-center">Fase</th>
                  <th className="py-2.5 px-3 text-center">Skor Terbaik</th>
                  <th className="py-2.5 px-3 text-center">Bintang</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {levelDetails.map((lvl) => {
                  const score = levelScores[lvl.id]?.highScore || 0;
                  const stars = levelScores[lvl.id]?.stars || 0;
                  const isPass = score >= 60;

                  return (
                    <tr key={lvl.id} className="hover:bg-emerald-50/40">
                      <td className="py-2 px-3 font-mono font-bold text-stone-400 text-center">{lvl.id}</td>
                      <td className="py-2 px-3 font-bold text-stone-800">{lvl.title}</td>
                      <td className="py-2 px-3 text-center text-stone-500 font-medium">{lvl.fase}</td>
                      <td className="py-2 px-3 text-center font-rubik font-bold text-emerald-800">{score}</td>
                      <td className="py-2 px-3 text-center">
                        {stars > 0 ? '⭐'.repeat(stars) : <span className="text-stone-300">-</span>}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isPass
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {isPass ? 'Tuntas KKM' : 'Belum Selesai'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Overall Stats Cards */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3">
              <div className="text-[10px] font-bold text-amber-800 uppercase">Total Bintang</div>
              <div className="text-xl font-black font-fredoka text-amber-900">⭐ {totalStars} / 15</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3">
              <div className="text-[10px] font-bold text-emerald-800 uppercase">Akumulasi Skor</div>
              <div className="text-xl font-black font-fredoka text-emerald-900">{totalScore} Poin</div>
            </div>
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3">
              <div className="text-[10px] font-bold text-teal-800 uppercase">Koin Mandiri</div>
              <div className="text-xl font-black font-fredoka text-teal-900">🪙 {currentUser.coins}</div>
            </div>
          </div>

          {/* Teacher Signature & Database Sync Footer */}
          <div className="pt-4 border-t border-stone-200 flex justify-between items-end text-xs text-stone-600">
            <div>
              <p className="font-semibold text-emerald-800">
                ✅ Diverifikasi oleh Database Google Spreadsheet Kelas
              </p>
              <p className="text-[10px] text-stone-400 mt-0.5">
                Dicetak tanggal: {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
              </p>
            </div>

            <div className="text-center">
              <p className="text-[10px] text-stone-400 mb-8">Tanda Tangan Guru Pembimbing:</p>
              <div className="border-b border-stone-400 w-36 mx-auto"></div>
              <p className="text-[10px] font-bold text-stone-800 mt-1">( Guru Kelas IPAS )</p>
            </div>
          </div>
        </div>

        {/* Modal Footer (hidden when printing) */}
        <div className="bg-stone-50 px-6 py-3 border-t border-stone-200 flex justify-end print:hidden">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-rubik font-bold text-xs transition"
          >
            Tutup Rapor
          </button>
        </div>
      </div>
    </div>
  );
};
