import React, { useState, useEffect } from 'react';
import { sheetsDB } from '../services/googleSheetsService';
import { GameScoreRecord, UserProfile } from '../types';
import { sound } from '../utils/audio';

interface LeaderboardScreenProps {
  currentUser: UserProfile;
  onBack: () => void;
  onOpenGoogleSheets: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  currentUser,
  onBack,
  onOpenGoogleSheets,
}) => {
  const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
  const [records, setRecords] = useState<GameScoreRecord[]>([]);

  useEffect(() => {
    loadScores();
  }, [filterLevel]);

  const loadScores = () => {
    let all = sheetsDB.getScores();
    if (filterLevel !== 'all') {
      all = all.filter((r) => r.levelId === filterLevel);
    }
    // Sort by score descending
    all.sort((a, b) => b.score - a.score);
    setRecords(all);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-white hover:bg-stone-50 px-4 py-2 rounded-2xl border border-stone-200 shadow-xs transition"
        >
          <span>← Kembali ke Peta</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onOpenGoogleSheets();
          }}
          className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-4 py-2 rounded-2xl border border-emerald-300 shadow-xs transition"
        >
          <span>📊 Lihat Database Asli Google Sheets</span>
        </button>
      </div>

      {/* Main Leaderboard Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-300">
        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-2xl bg-amber-100 border border-amber-300 text-4xl mb-2">
            🏆
          </div>
          <h1 className="text-2xl font-black font-fredoka text-stone-900">
            Papan Peringkat Tani Cilik
          </h1>
          <p className="text-xs text-stone-500 font-medium mt-1">
            Data tersinkron langsung dengan Google Spreadsheet Kelas SD
          </p>
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => {
              sound.playClick();
              setFilterLevel('all');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              filterLevel === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Semua Misi
          </button>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                sound.playClick();
                setFilterLevel(lvl);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                filterLevel === lvl
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Level {lvl}
            </button>
          ))}
        </div>

        {/* Top 3 Podium Highlights if enough records */}
        {records.length >= 3 && (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 pt-6 items-end">
            {/* Rank 2 */}
            <div className="bg-stone-50 rounded-2xl p-3 border-2 border-stone-300 text-center flex flex-col items-center">
              <span className="text-2xl mb-1">🥈</span>
              <span className="text-xs font-black text-stone-800 line-clamp-1">{records[1].userName}</span>
              <span className="text-[11px] font-bold text-emerald-700">{records[1].score} pts</span>
              <span className="text-[9px] text-stone-400 mt-1">Lvl {records[1].levelId}</span>
            </div>

            {/* Rank 1 */}
            <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-400 text-center flex flex-col items-center -translate-y-3 shadow-md">
              <span className="text-4xl mb-1">👑 🥇</span>
              <span className="text-sm font-black text-stone-900 line-clamp-1">{records[0].userName}</span>
              <span className="text-xs font-extrabold text-amber-800">{records[0].score} pts</span>
              <span className="text-[9px] font-semibold text-amber-700 mt-1">Lvl {records[0].levelId}</span>
            </div>

            {/* Rank 3 */}
            <div className="bg-orange-50 rounded-2xl p-3 border-2 border-orange-300 text-center flex flex-col items-center">
              <span className="text-2xl mb-1">🥉</span>
              <span className="text-xs font-black text-stone-800 line-clamp-1">{records[2].userName}</span>
              <span className="text-[11px] font-bold text-orange-700">{records[2].score} pts</span>
              <span className="text-[9px] text-stone-400 mt-1">Lvl {records[2].levelId}</span>
            </div>
          </div>
        )}

        {/* Ranking List Table */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {records.length === 0 ? (
            <div className="text-center py-10 text-stone-400 text-xs italic">
              Belum ada riwayat permainan pada level ini. Mainkan misi untuk mencatat skor!
            </div>
          ) : (
            records.map((rec, index) => {
              const isCurrent = rec.userEmail === currentUser.email || rec.nisn === currentUser.nisn;
              return (
                <div
                  key={rec.id || index}
                  className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition ${
                    isCurrent
                      ? 'bg-emerald-50 border-emerald-400 font-bold'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                        index === 0
                          ? 'bg-yellow-400 text-yellow-900'
                          : index === 1
                          ? 'bg-stone-300 text-stone-800'
                          : index === 2
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {index + 1}
                    </span>

                    <div>
                      <div className="text-xs font-extrabold text-stone-900 flex items-center gap-1.5">
                        <span>{rec.userName}</span>
                        {isCurrent && (
                          <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.2 rounded-full font-bold">
                            Kamu
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        NISN: {rec.nisn || '-'} • Lvl {rec.levelId}: {rec.levelTitle}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-emerald-800 font-fredoka">
                      {rec.score} pts
                    </div>
                    <div className="text-[10px] text-amber-600 font-bold">
                      {'⭐'.repeat(rec.stars)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
