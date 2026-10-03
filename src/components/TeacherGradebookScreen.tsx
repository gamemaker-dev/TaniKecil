import React, { useState, useEffect } from 'react';
import { UserProfile, GameScoreRecord } from '../types';
import { sheetsDB } from '../services/googleSheetsService';
import { sound } from '../utils/audio';

interface TeacherGradebookScreenProps {
  currentUser: UserProfile;
  onBack: () => void;
  onOpenGoogleSheets: () => void;
}

export const TeacherGradebookScreen: React.FC<TeacherGradebookScreenProps> = ({
  currentUser,
  onBack,
  onOpenGoogleSheets,
}) => {
  const isTeacher = currentUser.role === 'Guru';

  const [records, setRecords] = useState<GameScoreRecord[]>([]);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'records' | 'students'>('records');
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    if (isTeacher) {
      loadGradebookData();
    }
  }, [isTeacher]);

  const loadGradebookData = async () => {
    setIsLoading(true);
    const resp = await sheetsDB.fetchTeacherGradebook('Guru');
    if (resp && resp.success) {
      setRecords(resp.gradebook || []);
      setStudents(resp.students || []);
    }
    setIsLoading(false);
  };

  const handleDownloadCSV = () => {
    sound.playClick();
    const csv = sheetsDB.exportCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Rekap_Nilai_IPAS_Kelas_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  // If user is not Guru, show Access Denied screen!
  if (!isTeacher) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-rose-400 space-y-4">
          <div className="text-5xl">⛔</div>
          <h2 className="text-2xl font-black font-fredoka text-rose-900">
            Akses Ditolak: Khusus Akun Guru
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Halaman <strong>Daftar Nilai & Rekap Capaian Kelas</strong> bersifat rahasia dan hanya dapat diakses oleh Akun Pendidik (Guru).
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                sound.playClick();
                onBack();
              }}
              className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-xs"
            >
              ← Kembali ke Peta Misi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchClass = filterClass === 'all' || r.grade.toLowerCase().includes(filterClass.toLowerCase());
    const matchLevel = filterLevel === 'all' || r.levelNumber === filterLevel;
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.nis && r.nis.includes(searchTerm));
    return matchClass && matchLevel && matchStatus && matchSearch;
  });

  const totalSesi = records.length;
  const passCount = records.filter((r) => r.status === 'Lulus KKM').length;
  const passRate = totalSesi > 0 ? Math.round((passCount / totalSesi) * 100) : 0;
  const avgScore =
    totalSesi > 0 ? Math.round(records.reduce((acc, c) => acc + (c.score || 0), 0) / totalSesi) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border-2 border-stone-200 shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-rubik font-bold text-xs transition"
          >
            ← Peta Misi
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h1 className="font-rubik font-black text-base sm:text-lg text-emerald-950">
                Daftar Nilai Siswa (Panel Khusus Guru)
              </h1>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                Pendidik: {currentUser.name}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">
              Data evaluasi otomatis Kurikulum Merdeka IPAS terhubung ke Google Spreadsheet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadGradebookData}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-1 transition"
          >
            <span>🔄</span>
            <span>{isLoading ? 'Menyinkron...' : 'Refresh Sheets'}</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 font-bold text-xs flex items-center gap-1 transition"
          >
            <span>📥</span>
            <span>Unduh CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 font-bold text-xs flex items-center gap-1 transition"
          >
            <span>🖨️</span>
            <span>Cetak Rekap</span>
          </button>
          <button
            onClick={onOpenGoogleSheets}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
          >
            <span>📊 Buka Spreadsheet</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
        <div className="bg-white p-4 rounded-3xl border-2 border-stone-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-stone-400 uppercase block">Total Murid</span>
          <span className="text-2xl font-black font-fredoka text-stone-900">
            {students.length} Siswa
          </span>
        </div>
        <div className="bg-white p-4 rounded-3xl border-2 border-stone-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-stone-400 uppercase block">Total Sesi Game</span>
          <span className="text-2xl font-black font-fredoka text-emerald-800">
            {totalSesi} Misi
          </span>
        </div>
        <div className="bg-white p-4 rounded-3xl border-2 border-stone-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-stone-400 uppercase block">Rata-rata Skor</span>
          <span className="text-2xl font-black font-fredoka text-blue-800">
            {avgScore} Pts
          </span>
        </div>
        <div className="bg-white p-4 rounded-3xl border-2 border-stone-200 shadow-xs text-center">
          <span className="text-[10px] font-bold text-stone-400 uppercase block">Tuntas KKM</span>
          <span className="text-2xl font-black font-fredoka text-amber-600">
            {passRate}%
          </span>
        </div>
      </div>

      {/* Filter and Tab Section */}
      <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-4 print:border-none print:p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          {/* Tab Switcher */}
          <div className="flex bg-stone-100 p-1 rounded-2xl text-xs font-rubik font-bold">
            <button
              onClick={() => setActiveTab('records')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'records' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              📑 Riwayat Sesi Misi ({filteredRecords.length})
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'students' ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              🧑‍🎓 Rekap Akumulasi per Siswa ({students.length})
            </button>
          </div>

          {/* Search Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Cari Nama atau NIS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl border border-stone-300 text-xs w-48 sm:w-60 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Filter Dropdowns for Records Tab */}
        {activeTab === 'records' && (
          <div className="flex flex-wrap items-center gap-2.5 text-xs print:hidden pt-2 border-t border-stone-100">
            <span className="font-bold text-stone-500">Filter:</span>

            {/* Filter Kelas */}
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-stone-300 bg-white font-medium"
            >
              <option value="all">Semua Kelas</option>
              <option value="4A">Kelas 4A</option>
              <option value="4B">Kelas 4B</option>
              <option value="5A">Kelas 5A</option>
              <option value="5B">Kelas 5B</option>
              <option value="6">Kelas 6</option>
            </select>

            {/* Filter Level */}
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-xl border border-stone-300 bg-white font-medium"
            >
              <option value="all">Semua Level Misi</option>
              <option value="1">Level 1: Organ & Bibit</option>
              <option value="2">Level 2: Olah Tanah & Nutrisi</option>
              <option value="3">Level 3: Hama & Sahabat</option>
              <option value="4">Level 4: Panen Raya</option>
              <option value="5">Level 5: Irigasi Subak</option>
            </select>

            {/* Filter Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl border border-stone-300 bg-white font-medium"
            >
              <option value="all">Semua Status KKM</option>
              <option value="Lulus KKM">Lulus KKM (Tuntas)</option>
              <option value="Coba Lagi">Coba Lagi (Remidial)</option>
            </select>
          </div>
        )}

        {/* TAB 1: RIWAYAT SESI NILAI */}
        {activeTab === 'records' && (
          <div className="border border-stone-200 rounded-2xl overflow-x-auto shadow-inner bg-white">
            <table className="w-full text-left text-xs border-collapse min-w-[780px]">
              <thead className="bg-emerald-800 text-white font-rubik font-bold">
                <tr>
                  <th className="py-2.5 px-3 text-center w-12">#</th>
                  <th className="py-2.5 px-3">Waktu (WIB)</th>
                  <th className="py-2.5 px-3">NIS</th>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3">Kelas</th>
                  <th className="py-2.5 px-3">Level IPAS</th>
                  <th className="py-2.5 px-3 text-center">Skor</th>
                  <th className="py-2.5 px-3 text-center">Bintang</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3">Lencana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-stone-400 italic">
                      Belum ada data nilai yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((r, index) => (
                    <tr key={r.id || index} className="hover:bg-emerald-50/50 transition">
                      <td className="py-2 px-3 text-center text-stone-400 font-mono">{index + 1}</td>
                      <td className="py-2 px-3 text-stone-500 font-mono text-[10px] whitespace-nowrap">
                        {r.timestamp}
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-stone-700">{r.nis || '-'}</td>
                      <td className="py-2 px-3 font-bold text-stone-900">{r.studentName}</td>
                      <td className="py-2 px-3 text-stone-600">{r.grade}</td>
                      <td className="py-2 px-3">
                        <span className="font-bold text-emerald-800">Lv.{r.levelNumber}:</span>{' '}
                        {r.levelTitle}
                      </td>
                      <td className="py-2 px-3 text-center font-rubik font-bold text-emerald-800">
                        {r.score}
                      </td>
                      <td className="py-2 px-3 text-center">{'⭐'.repeat(r.stars)}</td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === 'Lulus KKM'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-stone-600 font-medium">
                        {r.badgeUnlocked || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: REKAP AKUMULATIF PER SISWA */}
        {activeTab === 'students' && (
          <div className="border border-stone-200 rounded-2xl overflow-x-auto shadow-inner bg-white">
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead className="bg-emerald-800 text-white font-rubik font-bold">
                <tr>
                  <th className="py-2.5 px-3 text-center w-12">#</th>
                  <th className="py-2.5 px-3">NIS</th>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3">Kelas</th>
                  <th className="py-2.5 px-3">Sekolah</th>
                  <th className="py-2.5 px-3 text-center">Total Bintang</th>
                  <th className="py-2.5 px-3 text-center">Akumulasi Skor</th>
                  <th className="py-2.5 px-3 text-center">Koin</th>
                  <th className="py-2.5 px-3">Aktivitas Terakhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {students.map((s, idx) => (
                  <tr key={s.id || idx} className="hover:bg-emerald-50/50 transition">
                    <td className="py-2 px-3 text-center text-stone-400 font-mono">{idx + 1}</td>
                    <td className="py-2 px-3 font-mono font-bold text-stone-700">{s.nis}</td>
                    <td className="py-2 px-3 font-bold text-stone-900">{s.name}</td>
                    <td className="py-2 px-3 text-stone-600">{s.grade}</td>
                    <td className="py-2 px-3 text-stone-500">{s.school}</td>
                    <td className="py-2 px-3 text-center font-bold text-amber-600">
                      ⭐ {s.stars} / 15
                    </td>
                    <td className="py-2 px-3 text-center font-rubik font-bold text-emerald-800">
                      {s.totalScore}
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-amber-700">
                      🪙 {s.coins}
                    </td>
                    <td className="py-2 px-3 text-stone-400 font-mono text-[10px]">
                      {s.lastActive || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
