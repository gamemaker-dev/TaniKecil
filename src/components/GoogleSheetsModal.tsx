import React, { useState, useEffect } from 'react';
import { sheetsDB, googleAppsScriptTemplate } from '../services/googleSheetsService';
import { GameScoreRecord, UserProfile } from '../types';
import { sound } from '../utils/audio';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'sheet' | 'setup' | 'code'>('sheet');
  const [records, setRecords] = useState<GameScoreRecord[]>([]);
  const [gasUrlInput, setGasUrlInput] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setRecords(sheetsDB.getRecords());
      setGasUrlInput(sheetsDB.getGasUrl());
      setTestStatus('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveGasUrl = () => {
    sound.playClick();
    sheetsDB.setGasUrl(gasUrlInput);
    setTestStatus('✅ URL Google Apps Script berhasil disimpan!');
    setTimeout(() => setTestStatus(''), 3000);
  };

  const handleSendTestData = async () => {
    sound.playCoin();
    setTestStatus('Mengirim data simulasi ke Google Sheets...');
    const result = await sheetsDB.recordScore({
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      school: currentUser.school,
      grade: currentUser.grade,
      levelNumber: 1,
      levelTitle: 'Bersihkan Lahan Sawah (Test)',
      score: 100,
      kkm: 60,
      stars: 3,
      coinsEarned: 25,
      status: 'Lulus KKM',
      badgeUnlocked: 'Petani Pemula'
    });
    setRecords(sheetsDB.getRecords());
    setTestStatus(`✅ Sukses dicatat! Status: ${result.syncStatus}`);
    setTimeout(() => setTestStatus(''), 4000);
  };

  const handleCopyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(googleAppsScriptTemplate);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadCSV = () => {
    sound.playClick();
    const csvContent = sheetsDB.exportCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Database_Petualangan_Tani_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRecords = records.filter(r => 
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.levelTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-[#2E7D32] text-white px-5 py-3.5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-xl">
              📊
            </div>
            <div>
              <h3 className="font-rubik font-bold text-base leading-tight">
                Database Google Sheets & Google Apps Script
              </h3>
              <p className="text-xs text-green-100 font-medium">
                Pencatatan Otomatis Skor & Data Siswa Belajar.id
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-sm transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="bg-stone-100 px-5 pt-3 border-b border-stone-200 flex items-center gap-2 text-xs font-rubik font-bold">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('sheet');
            }}
            className={`px-4 py-2 rounded-t-xl transition flex items-center gap-1.5 ${
              activeTab === 'sheet'
                ? 'bg-white text-green-800 border-t-2 border-green-600 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>📑 Lembar Kerja Spreadsheet</span>
            <span className="bg-green-100 text-green-800 text-[10px] px-1.5 rounded-full font-bold">
              {records.length}
            </span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('setup');
            }}
            className={`px-4 py-2 rounded-t-xl transition flex items-center gap-1.5 ${
              activeTab === 'setup'
                ? 'bg-white text-green-800 border-t-2 border-green-600 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>⚙️ Hubungkan Apps Script (GAS)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('code');
            }}
            className={`px-4 py-2 rounded-t-xl transition flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-white text-green-800 border-t-2 border-green-600 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span>📜 Kode Apps Script (.gs)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 scroll-custom">
          {/* TAB 1: SPREADSHEET TABLE VIEW */}
          {activeTab === 'sheet' && (
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Cari siswa atau level..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-medium w-48 sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <span className="text-xs text-stone-500">
                    Menampilkan <strong>{filteredRecords.length}</strong> baris
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSendTestData}
                    className="px-3 py-1.5 rounded-xl bg-green-100 hover:bg-green-200 text-green-900 font-rubik font-bold text-xs flex items-center gap-1 transition shadow-xs"
                  >
                    <span>➕ Kirim Skor Simulasi</span>
                  </button>
                  <button
                    onClick={handleDownloadCSV}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-rubik font-bold text-xs flex items-center gap-1 transition shadow-xs"
                  >
                    <span>📥 Unduh CSV</span>
                  </button>
                </div>
              </div>

              {testStatus && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2">
                  <span>ℹ️</span> {testStatus}
                </div>
              )}

              {/* Spreadsheet Table Look & Feel */}
              <div className="border border-stone-300 rounded-2xl overflow-x-auto shadow-inner bg-white">
                <table className="w-full text-left text-xs font-medium border-collapse min-w-[760px]">
                  <thead>
                    <tr className="bg-[#2E7D32] text-white font-rubik font-bold text-[11px]">
                      <th className="py-2.5 px-3 border-r border-green-700 w-12 text-center">#</th>
                      <th className="py-2.5 px-3 border-r border-green-700">Waktu (WIB)</th>
                      <th className="py-2.5 px-3 border-r border-green-700">Nama Siswa</th>
                      <th className="py-2.5 px-3 border-r border-green-700">Kelas</th>
                      <th className="py-2.5 px-3 border-r border-green-700">Level IPAS</th>
                      <th className="py-2.5 px-3 border-r border-green-700 text-center">Skor</th>
                      <th className="py-2.5 px-3 border-r border-green-700 text-center">Bintang</th>
                      <th className="py-2.5 px-3 border-r border-green-700 text-center">Koin</th>
                      <th className="py-2.5 px-3 border-r border-green-700 text-center">Status</th>
                      <th className="py-2.5 px-3">Lencana</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-[11px]">
                    {filteredRecords.map((r, index) => (
                      <tr key={r.id} className="hover:bg-green-50/50 transition">
                        <td className="py-2 px-3 border-r border-stone-200 text-center text-stone-400 font-mono">
                          {index + 1}
                        </td>
                        <td className="py-2 px-3 border-r border-stone-200 font-mono text-[10px] text-stone-600 whitespace-nowrap">
                          {r.timestamp}
                        </td>
                        <td className="py-2 px-3 border-r border-stone-200 font-bold text-stone-900">
                          {r.studentName}
                          <div className="text-[10px] text-stone-400 font-normal">{r.studentEmail}</div>
                        </td>
                        <td className="py-2 px-3 border-r border-stone-200 text-stone-600">
                          {r.grade}
                        </td>
                        <td className="py-2 px-3 border-r border-stone-200">
                          <span className="font-bold text-stone-800">Lv.{r.levelNumber}:</span> {r.levelTitle}
                        </td>
                        <td className="py-2 px-3 border-r border-stone-200 text-center font-rubik font-bold text-green-800">
                          {r.score}
                        </td>
                        <td className="py-2 px-3 border-r border-stone-200 text-center">
                          {'⭐'.repeat(r.stars)}
                        </td>
                        <td className="py-2 px-3 border-r border-stone-200 text-center text-amber-700 font-bold">
                          +{r.coinsEarned}
                        </td>
                        <td className="py-2 px-3 border-r border-stone-200 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.status === 'Lulus KKM'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-stone-700 font-semibold">
                          {r.badgeUnlocked || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: SETUP & CONFIG */}
          {activeTab === 'setup' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                <h4 className="font-rubik font-bold text-sm text-green-950 flex items-center gap-2">
                  <span>🔗 Integrasi Webhook Google Apps Script</span>
                </h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Masukkan URL Web App dari penerapan Google Apps Script spreadsheet Anda. Setiap kali siswa
                  menyelesaikan permainan, skor dan datanya akan dikirimkan otomatis ke spreadsheet Anda!
                </p>

                <div className="mt-3 space-y-2">
                  <label className="block text-xs font-bold text-stone-800">
                    Google Apps Script Web App URL:
                  </label>
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                    value={gasUrlInput}
                    onChange={(e) => setGasUrlInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:ring-2 focus:ring-green-500 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveGasUrl}
                      className="px-4 py-2 rounded-xl btn-chunky-green text-white font-rubik font-bold text-xs"
                    >
                      Simpan Pengaturan
                    </button>
                    <button
                      onClick={handleSendTestData}
                      className="px-4 py-2 rounded-xl btn-chunky-yellow text-stone-900 font-rubik font-bold text-xs"
                    >
                      Uji Kirim Data
                    </button>
                  </div>
                </div>

                {testStatus && (
                  <div className="mt-3 p-2.5 rounded-xl bg-white border border-stone-300 text-xs font-bold text-stone-800">
                    {testStatus}
                  </div>
                )}
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs space-y-2 text-stone-600">
                <h5 className="font-rubik font-bold text-stone-800">Status Penyimpanan Data:</h5>
                <p>
                  • <strong>Online Sync:</strong> Jika URL Web App terisi, data dikirim langsung ke Google Spreadsheet guru/sekolah via <code>POST</code>.
                </p>
                <p>
                  • <strong>Local Offline Fallback:</strong> Jika tidak terhubung atau offline, skor tetap dicatat aman di <code>localStorage</code> dan dapat diunduh dalam format <code>.CSV</code> sewaktu-waktu.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CODE SNIPPET */}
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-rubik font-bold text-sm text-stone-900">
                    Kode Google Apps Script (Code.gs)
                  </h4>
                  <p className="text-xs text-stone-500">
                    Salin kode ini dan tempelkan di menu Ekstensi &gt; Apps Script pada spreadsheet Anda.
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-2 rounded-xl btn-chunky-yellow text-stone-900 font-rubik font-bold text-xs flex items-center gap-1.5"
                >
                  <span>{isCopied ? '✓ Tersalin!' : '📋 Salin Kode'}</span>
                </button>
              </div>

              <pre className="bg-stone-900 text-green-400 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-96 border border-stone-700">
                {googleAppsScriptTemplate}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-5 py-3 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <span>Database Status: Siap Mencatat Skor Otomatis</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-rubik font-bold text-xs transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
