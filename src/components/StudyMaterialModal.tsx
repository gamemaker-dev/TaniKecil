import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface StudyMaterialModalProps {
  onClose: () => void;
}

export const StudyMaterialModal: React.FC<StudyMaterialModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'organ' | 'fotosintesis' | 'hama' | 'pangan' | 'subak'>('organ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-emerald-400 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📖</span>
            <div>
              <h2 className="text-lg font-black font-fredoka leading-snug">
                Buku Saku Materi IPAS: Petani Cilik
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Panduan Kurikulum Merdeka Fase B & C (SD Kelas 4 - 6)
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center font-bold text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 overflow-x-auto p-1.5 gap-1">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('organ');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'organ'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            🌱 Organ Tumbuhan
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('fotosintesis');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'fotosintesis'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            ☀️ Fotosintesis
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('hama');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'hama'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            🐞 Sahabat vs Hama
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('pangan');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'pangan'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            🌾 Ketahanan Pangan
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('subak');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === 'subak'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            🌊 Subak & Ekosistem
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-stone-700 text-xs sm:text-sm">
          {activeTab === 'organ' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                <h3 className="font-extrabold text-emerald-900 text-sm mb-1">
                  1. Akar (Radix)
                </h3>
                <p className="text-stone-600 leading-relaxed text-xs">
                  Akar berada di dalam tanah. Fungsinya: <strong>menyerap air dan zat hara</strong> dari tanah, memperkokoh berdirinya tanaman, serta tempat menyimpan cadangan makanan (contohnya singkong dan wortel).
                </p>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                <h3 className="font-extrabold text-emerald-900 text-sm mb-1">
                  2. Batang (Caulis)
                </h3>
                <p className="text-stone-600 leading-relaxed text-xs">
                  Batang menghubungkan akar dan daun. Di dalam batang terdapat pembuluh <strong>Xilem</strong> (mengalirkan air ke atas) dan <strong>Floem</strong> (mengedarkan glukosa hasil fotosintesis ke seluruh bagian tanaman).
                </p>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                <h3 className="font-extrabold text-emerald-900 text-sm mb-1">
                  3. Daun (Folium) & Klorofil
                </h3>
                <p className="text-stone-600 leading-relaxed text-xs">
                  Daun merupakan pabrik makanan tumbuhan melalui proses fotosintesis. Daun berwarna hijau karena memiliki pigmen <strong>Klorofil</strong>. Daun juga memiliki mulut daun (stomata) untuk pertukaran gas Oksigen dan Karbon Dioksida.
                </p>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                <h3 className="font-extrabold text-emerald-900 text-sm mb-1">
                  4. Bunga, Buah & Biji
                </h3>
                <p className="text-stone-600 leading-relaxed text-xs">
                  Bunga adalah organ reproduksi generatif (penyerbukan serbuk sari & putik). Buah melindungi biji calon individu tumbuhan baru dan seringkali kaya vitamin yang bermanfaat untuk manusia.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'fotosintesis' && (
            <div className="space-y-4">
              <div className="bg-amber-50 rounded-2xl p-5 border-2 border-amber-300 text-center">
                <span className="text-4xl mb-2 inline-block">☀️ 🍃 💧</span>
                <h3 className="font-black text-amber-900 text-base mb-2">
                  Rumus Fotosintesis Tumbuhan Hijau
                </h3>
                <div className="bg-white p-3 rounded-xl border border-amber-200 font-mono text-xs text-amber-950 font-bold">
                  Air (H₂O) + Karbon Dioksida (CO₂) + Sinar Matahari ➔ Glukosa (Energi) + Oksigen (O₂)
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="font-bold text-stone-900 mb-1">💧 Peran Air & Kompos</div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Air diserap dari tanah untuk reaksi biokimia. Kompos menyediakan unsur nitrogen (N), fosfor (P), dan kalium (K) untuk kesuburan.
                  </p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="font-bold text-stone-900 mb-1">🪱 Peran Cacing Tanah</div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Cacing tanah membuat terowongan kecil di tanah sehingga sirkulasi oksigen (aerasi) akar lancar dan gembur.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hama' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4">
                  <h4 className="font-extrabold text-rose-900 text-sm mb-2 flex items-center gap-1.5">
                    <span>🐛 Hama Perusak (Musuh)</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-rose-800 list-disc list-inside">
                    <li><strong>Ulat Grayak:</strong> Memakan daun muda sampai habis.</li>
                    <li><strong>Wereng Coklat:</strong> Menghisap getah batang padi.</li>
                    <li><strong>Tikus Sawah:</strong> Mengerat batang dan bulir padi malam hari.</li>
                  </ul>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
                  <h4 className="font-extrabold text-emerald-900 text-sm mb-2 flex items-center gap-1.5">
                    <span>🐝 Sahabat Petani (Predator & Penyerbuk)</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-800 list-disc list-inside">
                    <li><strong>Lebah Madu:</strong> Membantu penyerbukan bunga menjadi buah.</li>
                    <li><strong>Kepik Koksi:</strong> Predator alami pemakan kutu daun.</li>
                    <li><strong>Burung Hantu:</strong> Pemburu tikus sawah ramah lingkungan.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3.5 text-xs text-teal-900">
                🌿 <strong>Pestisida Nabati:</strong> Petani pintar membuat semprotan dari daun mimba, bawang putih, dan tembakau agar tidak membunuh serangga baik penyerbuk tanaman.
              </div>
            </div>
          )}

          {activeTab === 'pangan' && (
            <div className="space-y-3">
              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                <h4 className="font-bold text-stone-900 text-sm mb-1">
                  🌾 Mengapa Pertanian Nusantara Penting?
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Indonesia memiliki tanah vulkanik yang sangat subur. Para petani adalah pahlawan pangan yang mencukupi kebutuhan beras, sayuran, jagung, dan buah-buahan untuk seluruh rakyat Indonesia.
                </p>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                <h4 className="font-bold text-stone-900 text-sm mb-1">
                  💰 Nilai Ekonomi & Keberlanjutan
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Petani yang cerdas mengelola hasil panen secara berkelanjutan, menghitung biaya produksi dan keuntungan, serta menjaga kesuburan tanah untuk generasi masa depan!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'subak' && (
            <div className="space-y-3">
              <div className="bg-teal-50 rounded-2xl p-4 border border-teal-200">
                <h4 className="font-bold text-teal-950 text-sm mb-1">
                  🌊 Sistem Irigasi Tradisional Subak (Warisan Budaya Dunia UNESCO)
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Subak adalah organisasi kemasyarakatan petani di Bali yang mengatur sistem pengairan sawah secara adil, transparan, dan demokratis. Berlandaskan filosofi <strong>Tri Hita Karana</strong> (harmoni manusia dengan Tuhan, sesama manusia, dan alam).
                </p>
              </div>

              <div className="bg-teal-50 rounded-2xl p-4 border border-teal-200">
                <h4 className="font-bold text-teal-950 text-sm mb-1">
                  🌾 Terasering & Bangunan Bagi Air (Tembuku)
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Sawah bertingkat (terasering) mencegah erosi lereng bukit. Melalui pintu air atau <em>Tembuku</em>, air dialirkan bertahap dari petak hulu ke hilir sehingga semua petani mendapatkan jatah air yang cukup dan merata.
                </p>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                <h4 className="font-bold text-emerald-950 text-sm mb-1">
                  🕸️ Keseimbangan Rantai Makanan Sawah
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed">
                  <strong>Padi (Produsen) ➔ Tikus (Konsumen 1) ➔ Ular Sawah (Konsumen 2) ➔ Burung Hantu/Elang (Konsumen Puncak) ➔ Cacing/Bakteri (Pengurai)</strong>.<br />
                  Jika salah satu predator alami dibasmi (misal ular diburu), maka populasi hama tikus akan meledak dan sawah mengalami gagal panen!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
          >
            Tutup Buku Materi
          </button>
        </div>
      </div>
    </div>
  );
};
