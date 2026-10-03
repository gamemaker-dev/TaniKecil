# 🌾 Panduan Lengkap Instalasi & Pengembangan: Petualangan Tani Cilik di Google Apps Script (GAS) & Google Spreadsheet

Panduan ini menjelaskan langkah demi langkah cara memasang, menghubungkan database, dan mengembangkan game **Petualangan Tani Cilik** (Game Edukasi IPAS SD Kurikulum Merdeka Fase B & C) ke dalam **Google Apps Script** dan **Google Spreadsheet**.

---

## 📑 Daftar Isi
1. [Arsitektur Sistem](#1-arsitektur-sistem)
2. [Langkah 1: Membuat Google Spreadsheet Database](#2-langkah-1-membuat-google-spreadsheet-database)
3. [Langkah 2: Menempelkan Kode di Google Apps Script Editor](#3-langkah-2-menempelkan-kode-di-google-apps-script-editor)
4. [Langkah 3: Menjalankan Setup Otomatis Sheet](#4-langkah-3-menjalankan-setup-otomatis-sheet)
5. [Langkah 4: Memainkan Game Langsung di Google Sheets (Dialog / Sidebar)](#5-langkah-4-memainkan-game-langsung-di-google-sheets)
6. [Langkah 5: Menerapkan (Deploy) Sebagai Web App Mandiri](#6-langkah-5-menerapkan-deploy-sebagai-web-app-mandiri)
7. [Fitur-Fitur Baru yang Dikembangkan](#7-fitur-fitur-baru-yang-dikembangkan)
8. [Struktur Database Spreadsheet](#8-struktur-database-spreadsheet)

---

## 1. Arsitektur Sistem

Game ini dirancang dengan **Dual-Mode Architecture**:
1. **Mode Native Google Apps Script (Internal Sheets / Web App)**:
   - Berjalan langsung di dalam Google Sheets (`showModalDialog` atau `showSidebar`) atau lewat URL `/exec`.
   - Menggunakan RPC native `google.script.run.apiSaveScore()` dan `google.script.run.apiGetLeaderboard()`.
   - **Bebas masalah CORS** dan sangat cepat karena mengeksekusi langsung di server Google.
2. **Mode Eksternal (Vite / React / Web Host Standalone)**:
   - Berjalan di server lokal (`npm run dev`) atau hosting sekolah.
   - Terhubung ke Google Apps Script via Webhook HTTP POST (`fetch(gasUrl)`).
   - Memiliki **Offline LocalStorage Fallback**, sehingga siswa di daerah minim sinyal tetap dapat bermain tanpa macet!

---

## 2. Langkah 1: Membuat Google Spreadsheet Database

1. Buka [Google Drive](https://drive.google.com/) Anda.
2. Klik tombol **+ Baru (+ New)** > **Google Spreadsheet**.
3. Beri nama file spreadsheet Anda di pojok kiri atas:
   ```text
   Game IPAS Tani Cilik
   ```

---

## 3. Langkah 2: Menempelkan Kode di Google Apps Script Editor

1. Di dalam spreadsheet yang baru dibuat, klik menu:
   **Ekstensi (Extensions) > Apps Script**.
2. Anda akan diarahkan ke editor Google Apps Script.
3. **File 1 (`Code.gs`)**:
   - Hapus kode bawaan `myFunction()`.
   - Buka file [gas/Code.gs](file:///c:/Data/Game/TaniKecil/gas/Code.gs).
   - Salin seluruh isinya dan tempelkan (paste) ke editor `Code.gs`.
4. **File 2 (`Index.html`)**:
   - Di panel kiri samping (Files / File), klik tanda **+** > Pilih **HTML**.
   - Beri nama file: `Index` (huruf I besar, tanpa ekstensi `.html`).
   - Buka file [gas/Index.html](file:///c:/Data/Game/TaniKecil/gas/Index.html).
   - Salin seluruh isinya dan tempelkan ke editor `Index.html`.
5. Klik ikon **Simpan (Disket / Ctrl+S)**.

---

## 4. Langkah 3: Menjalankan Setup Otomatis Sheet

1. Kembali ke tab **Google Spreadsheet** Anda.
2. **Muat ulang halaman (Refresh / F5)** browser Anda.
3. Perhatikan bilah menu atas Google Sheets. Dalam beberapa detik akan muncul menu baru berikon padi:
   ```text
   🌾 Petualangan Tani Cilik
   ```
4. Klik menu **🌾 Petualangan Tani Cilik > ⚙️ Siapkan Struktur Sheet Otomatis**.
5. Google akan meminta otorisasi izin pertama kali:
   - Klik **Lanjutkan (Continue)**.
   - Pilih akun Google Anda.
   - Klik **Lanjutan (Advanced)** > Klik **Buka Petualangan Tani Cilik (tidak aman)**.
   - Klik **Izinkan (Allow)**.
6. Tunggu 3 detik. Script akan otomatis membuat dan mewarnai 5 sheet:
   - **`Skor_Game`**: Catatan riwayat skor seluruh siswa setiap kali menyelesaikan level.
   - **`Data_Siswa`**: Profil akumulatif siswa (koin, bintang total, skor total, gaya caping).
   - **`Leaderboard`**: Papan peringkat 50 siswa teratas yang otomatis terurut.
   - **`Materi_IPAS`**: Referensi topik pembelajaran Kurikulum Merdeka Fase B & C.
   - **`Pengaturan`**: Konfigurasi KKM standar dan nama sekolah.

---

## 5. Langkah 4: Memainkan Game Langsung di Google Sheets

Guru atau siswa dapat langsung menjalankan game di dalam Google Sheets tanpa membuka tab lain:
- **Layar Penuh / Dialog Modal**: Klik **🌾 Petualangan Tani Cilik > 🎮 Mainkan Game (Dialog Layar Penuh)**. Jendela game interaktif akan muncul di tengah layar!
- **Panel Samping (Sidebar)**: Klik **🌾 Petualangan Tani Cilik > 📱 Buka Game di Panel Samping (Sidebar)**. Game akan berjalan di samping kanan lembar spreadsheet sambil melihat data masuk!

---

## 6. Langkah 5: Menerapkan (Deploy) Sebagai Web App Mandiri

Agar siswa dapat membuka game lewat tautan web di HP, tablet, atau chromebook:

1. Di editor Apps Script, klik tombol biru **Deploy (Terapkan)** di pojok kanan atas > Pilih **New deployment (Penerapan baru)**.
2. Klik ikon gerigi (Select type) > Pilih **Web app (Aplikasi Web)**.
3. Isi konfigurasi:
   - **Description**: `Rilis Game Petualangan Tani Cilik v1.0`
   - **Execute as**: `Me (email-anda@gmail.com)` *(Sistem dijalankan dengan izin pembuat)*
   - **Who has access**: `Anyone (Siapa saja)` *(Penting! Agar siswa dapat mengakses tanpa izin rumit)*
4. Klik **Deploy**.
5. Salin **Web app URL** yang dihasilkan (berakhiran `/exec`).
   Contoh: `https://script.google.com/macros/s/AKfycb.../exec`
6. Bagikan tautan tersebut kepada seluruh siswa kelas Anda!

---

## 7. Fitur-Fitur Baru yang Dikembangkan

Pada proyek ini, pengembangan yang telah dilakukan mencakup:
1. **Sistem Autentikasi Pengguna & Pembagian Peran (Role Guru & Murid)**:
   - **Portal Murid**:
     - **Pendaftaran Mandiri**: Murid baru mendaftar dengan **NIS (Nomor Induk Siswa)**, **Nama Lengkap**, **Kelas** (e.g. Kelas 4A, 4B, 5A, 5B, 6), dan PIN Keamanan.
     - **Pencocokan Database Real-Time**: Saat siswa masuk (login), sistem langsung mencocokkan NIS ke lembar kerja `Data_Pengguna` di Google Spreadsheet. Jika cocok, data koin, bintang, dan level yang telah diselesaikan akan dimuat kembali.
   - **Portal Guru**:
     - **Pendaftaran Akun Guru Baru**: Pendidik kini dapat mendaftar mandiri dengan **Username / NIP Guru**, **Kata Sandi / Password Guru**, **Nama Lengkap & Gelar**, **Jabatan/Mata Pelajaran**, dan **Asal Sekolah**. Data langsung tersimpan di lembar kerja `Data_Pengguna` dengan peran `Guru`.
     - **Masuk dengan Username & Sandi**: Masuk menggunakan Username/NIP dan Kata Sandi terdaftar (tersedia juga akun demo bawaan: NIP `GURU123` / Sandi `guru123`).
     - **Hak Akses Eksklusif**: Hanya akun Guru yang dapat membuka halaman **Daftar Nilai Siswa (Gradebook)**. Murid tidak dapat melihat daftar nilai kelas.
2. **Daftar Nilai Siswa & Rekapitulasi Asesmen (`TeacherGradebookScreen`)**:
   - Menampilkan seluruh rekapitulasi penilaian kelas dari Misi 1 sampai 5.
   - Filter interaktif berdasarkan **Kelas**, **Nomor Level Misi**, dan **Status KKM (Lulus / Remidial)**.
   - Kotak metrik analitik: Total Murid, Total Sesi Permainan, Rata-rata Skor Kelas, dan Persentase Kelulusan KKM.
   - Tombol **📥 Unduh CSV** (Excel) dan **🖨️ Cetak Rekapitulasi Nilai**.
3. **Level 5: Irigasi Subak & Ekosistem Sawah (Fase C)**:
   - **Misi 1**: Mengatur katup debit air 3 petak sawah terasering bertingkat (Hulu, Tengah, Hilir) agar debit air tetap berada di zona hijau ideal (40% - 80%).
   - **Misi 2**: Kuis sains jaring-jaring makanan sawah & pemahaman dampak jika predator alami (ular/burung hantu) dibasmi.
4. **Rapor & Sertifikat Evaluasi Belajar IPAS (`StudentReportModal`)**:
   - Otomatis menghitung capaian siswa dari Level 1 sampai 5.
   - Tombol **🖨️ Cetak / Simpan PDF** yang rapi dan siap dicetak untuk portofolio asesmen Kurikulum Merdeka.
   - Tanda tangan guru pengampu dan stempel verifikasi database Google Spreadsheet.
5. **Papan Peringkat Real-Time (Live Leaderboard)**:
   - Mengambil data siswa teratas langsung dari Google Sheets.
   - Urutan berdasarkan Total Bintang dan Akumulasi Skor tertinggi.
6. **Toko Caping Nusantara & Audio Synthesis**:
   - Tukarkan koin panen dengan Caping Bambu, Caping Batik, atau Caping Emas Juara.
   - Generator suara Web Audio API hemat memori tanpa beban unduh berkas audio MP3 eksternal.

---

## 8. Struktur Database Spreadsheet

### A. Lembar `Data_Pengguna` (Akun Guru & Murid)
Menyimpan kredensial dan progres akumulatif pengguna:
| Kolom | Nama Kolom | Keterangan |
|---|---|---|
| A | ID User | Kode ID unik (`GURU-...` atau `SISWA-...`) |
| B | Role | Peran pengguna (`Guru` atau `Murid`) |
| C | NIS / NIP | Nomor identitas login utama |
| D | Nama Lengkap | Nama lengkap siswa atau guru |
| E | Kelas | Rombongan belajar (e.g. `Kelas 4A`, `Guru IPAS`) |
| F | Asal Sekolah | Nama instansi sekolah |
| G | PIN / Password | Kata sandi login pengguna |
| H | Total Koin | Akumulasi koin yang dikumpulkan |
| I | Total Bintang | Total bintang tertinggi (maks 15 bintang) |
| J | Total Akumulasi Skor | Akumulasi seluruh perolehan skor game |
| K | Gaya Caping | Caping yang sedang dikenakan (`caping_bambu`, `caping_emas`) |
| L | Terakhir Login | Waktu terakhir aktif |

### B. Lembar `Skor_Game` (Riwayat Sesi Permainan)
| Kolom | Nama Kolom | Keterangan |
|---|---|---|
| A | ID Sesi | Kode unik sesi permainan (`REC-...`) |
| B | Timestamp | Waktu penyelesaian (WIB) |
| C | Nama Siswa | Nama lengkap siswa |
| D | Email Belajar.id | Email akun siswa |
| E | NIS | Nomor Induk Siswa |
| F | Sekolah | Nama sekolah asal |
| G | Kelas | Rombel kelas siswa |
| H | No. Level | Level misi (1 - 5) |
| I | Judul Misi IPAS | Nama materi pembelajaran |
| J | Skor | Nilai yang diperoleh |
| K | KKM | Batas standar kelulusan (default: 60) |
| L | Bintang | Bintang yang diraih (1 - 3) |
| M | Koin Diperoleh | Koin hadiah sesi ini |
| N | Akurasi | Tingkat ketepatan jawaban (%) |
| O | Status Kelulusan | `Lulus KKM` atau `Coba Lagi` |
| P | Lencana Baru | Gelar atau lencana yang terbuka |
