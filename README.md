# 🌾 Petualangan Tani Cilik
> **Game Edukasi IPAS SD Kurikulum Merdeka (Fase B & C) Berbasis Google Apps Script & Google Spreadsheet Database**

![Petualangan Tani Cilik](https://img.shields.io/badge/Platform-Google%20Apps%20Script%20%7C%20React%20%7C%20Vite-2E7D32?style=for-the-badge)
![Database](https://img.shields.io/badge/Database-Google%20Spreadsheet-0F9D58?style=for-the-badge)
![Kurikulum](https://img.shields.io/badge/Kurikulum-Merdeka%20Fase%20B%20%26%20C-F89C00?style=for-the-badge)

---

## 🎯 Gambaran Umum Proyek
**Petualangan Tani Cilik** adalah permainan arcade edukasi interaktif yang dirancang untuk siswa Sekolah Dasar (Kelas 4, 5, dan 6) guna mempelajari muatan pelajaran **Ilmu Pengetahuan Alam dan Sosial (IPAS)** sesuai **Kurikulum Merdeka**.

Permainan ini terhubung langsung dengan **Google Spreadsheet** guru/sekolah sebagai basis data (database) penyimpanan skor, profil siswa (Akun Belajar.id / NISN), dan papan peringkat secara otomatis.

---

## 🚀 Fitur Utama & Misi Permainan

### 🎮 5 Level Misi Pembelajaran IPAS:
1. **Level 1: Kenali Organ & Bibit Pangan (Fase B)**
   - Kuis sains organ tumbuhan (Akar, Batang, Daun, Bunga) dan bibit pangan unggul nusantara (Padi, Jagung, Kedelai).
2. **Level 2: Olah Tanah & Nutrisi Tumbuhan (Fase B & C)**
   - Simulasi fotosintesis: menjaga keseimbangan air, pupuk kompos organik, sinar matahari, dan aerasi cacing tanah.
3. **Level 3: Basmi Hama Sahabat Petani (Fase C)**
   - Arcade tangkap hama wereng & ulat, sembari melindungi serangga sahabat petani seperti lebah madu penyerbuk dan kepik predator alami.
4. **Level 4: Panen Raya & Pasar Tani (Fase B & C)**
   - Petik sayur buah segar dan hitung literasi finansial penjualan panen di pasar desa.
5. **Level 5: Irigasi Subak & Ekosistem Sawah (Fase C - UNESCO World Heritage)**
   - **Tantangan 1**: Mengatur pintu air 3 petak sawah terasering bertingkat (Hulu, Tengah, Hilir) di zona subur (40% - 80%).
   - **Tantangan 2**: Jaring-jaring makanan sawah & dampak kepunahan predator alami (ular/burung hantu).

---

## 📊 Integrasi Google Spreadsheet & Apps Script (GAS)

Game dapat dijalankan dalam **2 Model**:
1. **Langsung di dalam Google Sheets**:
   - Menu kustom: **`🌾 Petualangan Tani Cilik > 🎮 Mainkan Game`** (Modal Dialog) atau **`📱 Buka Game di Panel Samping`** (Sidebar).
   - Menggunakan RPC native `google.script.run` yang cepat, stabil, dan tanpa kendala CORS.
2. **Sebagai Web App Standalone**:
   - Dideploy via Google Apps Script Web App (`/exec`) dan dapat dibuka langsung lewat peramban HP, Chromebook, atau tablet siswa.
3. **Lokal Vite / React**:
   - Dijalankan via `npm run dev` dan mengirimkan data via webhook URL ke Google Spreadsheet.

### 5 Lembar Kerja Spreadsheet yang Otomatis Terbentuk:
- **`Skor_Game`**: Riwayat nilai tiap sesi (Timestamp, Nama Siswa, NISN, Level, Skor, Bintang, Koin, Status KKM, Lencana).
- **`Data_Siswa`**: Data akumulasi seluruh siswa (Total Skor, Total Bintang, Koin, Gaya Caping, Waktu Terakhir Main).
- **`Leaderboard`**: Peringkat 50 besar siswa teratas dengan gelar kehormatan.
- **`Materi_IPAS`**: Buku panduan ringkasan materi pelajaran yang dapat diedit guru.
- **`Pengaturan`**: Batas nilai KKM kelulusan dan identitas sekolah.

---

## 📜 Rapor & Sertifikat Siswa (`StudentReportModal`)
- Siswa dan guru dapat melihat rekapitulasi capaian belajar dari Level 1 sampai 5.
- Dilengkapi tombol **🖨️ Cetak / Simpan PDF** lengkap dengan verifikasi database spreadsheet dan kolom tanda tangan guru.

---

## 🛠️ Panduan Menjalankan Proyek

### A. Memasang di Google Apps Script (Rekomendasi untuk Sekolah)
Panduan langkah demi langkah lengkap dapat dibaca di:
👉 [gas/PANDUAN_SETUP_LENGKAP.md](file:///c:/Data/Game/TaniKecil/gas/PANDUAN_SETUP_LENGKAP.md)

1. Buat Google Spreadsheet baru.
2. Buka menu **Ekstensi > Apps Script**.
3. Buat file `Code.gs` (salin isi [gas/Code.gs](file:///c:/Data/Game/TaniKecil/gas/Code.gs)).
4. Buat file `Index.html` (salin isi [gas/Index.html](file:///c:/Data/Game/TaniKecil/gas/Index.html)).
5. Simpan dan refresh spreadsheet Anda.
6. Klik menu **🌾 Petualangan Tani Cilik > ⚙️ Siapkan Struktur Sheet Otomatis**.

### B. Menjalankan di Komputer Lokal (Vite + React)
```bash
# Masuk ke folder proyek
cd c:\Data\Game\TaniKecil

# Pasang dependensi
npm install --legacy-peer-deps

# Jalankan server lokal
npm run dev

# Bangun produksi
npm run build
```

---

## 📁 Struktur Berkas Proyek
```text
c:\Data\Game\TaniKecil\
├── gas/                           # Berkas Khusus Google Apps Script
│   ├── Code.gs                    # Backend GAS (doGet, doPost, Menu Sheets, RPC)
│   ├── Index.html                 # Frontend Standalone GAS Web App
│   ├── appsscript.json            # Manifest Apps Script
│   └── PANDUAN_SETUP_LENGKAP.md   # Panduan instalasi dan deployment
├── src/                           # Berkas Sumber React + TypeScript
│   ├── components/                # Komponen Game (Level 1 - 5, Leaderboard, Shop, dll)
│   │   ├── Level1Game.tsx         # Kuis Organ & Bibit Pangan
│   │   ├── Level2Game.tsx         # Simulasi Fotosintesis & Nutrisi Tanah
│   │   ├── Level3Game.tsx         # Arcade Basmi Hama vs Serangga Sahabat
│   │   ├── Level4Game.tsx         # Panen & Berhitung Pasar Tani
│   │   ├── Level5Game.tsx         # Irigasi Subak & Ekosistem Sawah
│   │   ├── StudentReportModal.tsx # Rapor & Cetak Sertifikat Siswa
│   │   ├── LeaderboardScreen.tsx  # Papan Peringkat Sinkronisasi Spreadsheet
│   │   ├── StudyMaterialModal.tsx # Buku Materi Pembelajaran IPAS
│   │   ├── ShopScreen.tsx         # Toko Caping Nusantara
│   │   └── MapScreen.tsx          # Peta Perjalanan Misi
│   ├── services/
│   │   └── googleSheetsService.ts # Service Dual-Mode Google Apps Script & Sheets
│   └── utils/
│       └── audio.ts               # Synthesizer Web Audio API
├── package.json
└── README.md
```

---
Dibuat dengan ❤️ untuk kemajuan pendidikan anak Indonesia dan literasi pertanian berkelanjutan nusantara.
