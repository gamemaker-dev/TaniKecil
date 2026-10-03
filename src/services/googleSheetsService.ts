import { GameScoreRecord } from '../types';

const STORAGE_KEY_SCORES = 'tani_cilik_scores_db';
const STORAGE_KEY_GAS_URL = 'tani_cilik_gas_webapp_url';
const DEFAULT_GAS_URL = ''; // User or teacher can paste their deployed Web App URL here

// Sample seed data to populate the spreadsheet initially
const INITIAL_SEED_RECORDS: GameScoreRecord[] = [
  {
    id: 'rec-001',
    timestamp: '2026-10-02 08:35:12',
    studentName: 'Siti Nurhaliza',
    studentEmail: 'siti.nurhaliza@belajar.id',
    school: 'SDN 1 Ceria',
    grade: 'Kelas 4-A',
    levelNumber: 1,
    levelTitle: 'Bersihkan Lahan Sawah',
    score: 125,
    kkm: 60,
    stars: 3,
    coinsEarned: 25,
    status: 'Lulus KKM',
    badgeUnlocked: 'Petani Pemula',
    syncStatus: 'Tersimpan di Google Sheets'
  },
  {
    id: 'rec-002',
    timestamp: '2026-10-02 09:12:45',
    studentName: 'Ahmad R.',
    studentEmail: 'ahmad.r@belajar.id',
    school: 'SDN 1 Ceria',
    grade: 'Kelas 4-A',
    levelNumber: 1,
    levelTitle: 'Bersihkan Lahan Sawah',
    score: 98,
    kkm: 60,
    stars: 3,
    coinsEarned: 25,
    status: 'Lulus KKM',
    badgeUnlocked: 'Petani Pemula',
    syncStatus: 'Tersimpan di Google Sheets'
  },
  {
    id: 'rec-003',
    timestamp: '2026-10-02 10:04:19',
    studentName: 'Dewi Ayu',
    studentEmail: 'dewi.ayu@belajar.id',
    school: 'SDN 1 Ceria',
    grade: 'Kelas 4-A',
    levelNumber: 3,
    levelTitle: 'Alirkan Air Subak',
    score: 89,
    kkm: 60,
    stars: 3,
    coinsEarned: 25,
    status: 'Lulus KKM',
    badgeUnlocked: 'Penyiram Rajin',
    syncStatus: 'Tersimpan di Google Sheets'
  },
  {
    id: 'rec-004',
    timestamp: '2026-10-02 11:20:30',
    studentName: 'Rio Bagus',
    studentEmail: 'rio.bagus@belajar.id',
    school: 'SDN 1 Ceria',
    grade: 'Kelas 4-A',
    levelNumber: 2,
    levelTitle: 'Bajak & Gemburkan',
    score: 78,
    kkm: 60,
    stars: 2,
    coinsEarned: 20,
    status: 'Lulus KKM',
    badgeUnlocked: 'Pemanen Hebat',
    syncStatus: 'Tersimpan di Google Sheets'
  },
  {
    id: 'rec-005',
    timestamp: '2026-10-02 13:45:02',
    studentName: 'Budi Santoso',
    studentEmail: 'budi.santoso@belajar.id',
    school: 'SDN 1 Ceria',
    grade: 'Kelas 4-A',
    levelNumber: 1,
    levelTitle: 'Bersihkan Lahan Sawah',
    score: 85,
    kkm: 60,
    stars: 3,
    coinsEarned: 25,
    status: 'Lulus KKM',
    badgeUnlocked: 'Petani Pemula',
    syncStatus: 'Tersimpan di Google Sheets'
  }
];

export const googleAppsScriptTemplate = `/**
 * ====================================================================
 * KODE GOOGLE APPS SCRIPT (GAS) UNTUK "PETUALANGAN TANI CILIK"
 * ====================================================================
 * 
 * LANGKAH INSTALASI:
 * 1. Buat Google Spreadsheet baru di Google Drive Anda.
 * 2. Beri nama spreadsheet: "Database Petualangan Tani Cilik".
 * 3. Buka menu Extensions > Apps Script (Ekstensi > Apps Script).
 * 4. Hapus seluruh isi default, lalu tempel (paste) kode di bawah ini.
 * 5. Klik Simpan (ikon disket).
 * 6. Klik "Deploy" (Terapkan) > "New deployment" (Penerapan baru).
 * 7. Pilih tipe: "Web App" (Aplikasi Web).
 * 8. Pada konfigurasi:
 *    - Description: "API Skor Petualangan Tani Cilik"
 *    - Execute as: "Me" (Saya)
 *    - Who has access: "Anyone" (Siapa saja)  <-- PENTING!
 * 9. Klik "Deploy", beri izin (Authorize Access).
 * 10. Salin "Web App URL" (akhiran /exec) dan tempel di aplikasi game!
 */

function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Data Siswa & Skor");
  if (!sheet) {
    sheet = ss.insertSheet("Data Siswa & Skor");
  }
  
  // Format Header
  var headers = [
    "Timestamp", 
    "Nama Siswa", 
    "Email Belajar.id", 
    "Sekolah", 
    "Kelas", 
    "Level", 
    "Judul Level", 
    "Skor", 
    "KKM", 
    "Bintang", 
    "Koin Diperoleh", 
    "Status", 
    "Lencana Terbuka"
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length)
       .setFontWeight("bold")
       .setBackground("#2E7D32")
       .setFontColor("#FFFFFF")
       .setHorizontalAlignment("center");
       
  sheet.setFrozenRows(1);
}

// Endpoint POST untuk menerima skor dari game otomatis
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Data Siswa & Skor");
    if (!sheet) {
      setupSheet();
      sheet = ss.getSheetByName("Data Siswa & Skor");
    }

    var data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error("No data received");
    }

    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    var row = [
      timestamp,
      data.studentName || "Anonim",
      data.studentEmail || "-",
      data.school || "SDN 1 Ceria",
      data.grade || "Kelas 4",
      data.levelNumber || 1,
      data.levelTitle || "Level Game",
      Number(data.score || 0),
      Number(data.kkm || 60),
      Number(data.stars || 1),
      Number(data.coinsEarned || 0),
      data.status || "Selesai",
      data.badgeUnlocked || "-"
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Skor berhasil dicatat di Google Sheets!",
      timestamp: timestamp,
      rowNumber: sheet.getLastRow()
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Endpoint GET untuk mengecek koneksi atau membaca ringkasan skor
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Data Siswa & Skor");
    if (!sheet) {
      setupSheet();
      sheet = ss.getSheetByName("Data Siswa & Skor");
    }

    var data = sheet.getDataRange().getValues();
    var rows = [];
    if (data.length > 1) {
      for (var i = 1; i < data.length; i++) {
        rows.push({
          timestamp: data[i][0],
          studentName: data[i][1],
          studentEmail: data[i][2],
          level: data[i][5],
          score: data[i][7],
          stars: data[i][9],
          coins: data[i][10],
          status: data[i][11]
        });
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      totalRecords: rows.length,
      data: rows
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;

class GoogleSheetsDatabaseService {
  private records: GameScoreRecord[] = [];
  private gasUrl: string = '';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const storedUrl = localStorage.getItem(STORAGE_KEY_GAS_URL);
      this.gasUrl = storedUrl || DEFAULT_GAS_URL;

      const storedRecords = localStorage.getItem(STORAGE_KEY_SCORES);
      if (storedRecords) {
        this.records = JSON.parse(storedRecords);
      } else {
        this.records = INITIAL_SEED_RECORDS;
        this.saveToStorage();
      }
    } catch {
      this.records = INITIAL_SEED_RECORDS;
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(this.records));
      if (this.gasUrl) {
        localStorage.setItem(STORAGE_KEY_GAS_URL, this.gasUrl);
      }
    } catch {
      // Ignore
    }
  }

  public getGasUrl(): string {
    return this.gasUrl;
  }

  public setGasUrl(url: string) {
    this.gasUrl = url.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_GAS_URL, this.gasUrl);
    }
  }

  public getRecords(): GameScoreRecord[] {
    return [...this.records];
  }

  public getScores(): GameScoreRecord[] {
    return this.getRecords().map(r => ({
      ...r,
      userName: r.studentName,
      userEmail: r.studentEmail,
      levelId: r.levelNumber,
      nisn: r.nisn || '0129482910',
    }));
  }

  public async recordGameScore(params: {
    userName: string;
    userEmail: string;
    nisn: string;
    school: string;
    grade: string;
    levelId: number;
    levelTitle: string;
    score: number;
    stars: number;
    coinsEarned: number;
    accuracy: number;
    badgeEarned?: string;
  }): Promise<{ success: boolean; message: string; record?: GameScoreRecord }> {
    const kkm = 60;
    const isPass = params.score >= kkm;

    const baseRecord: Omit<GameScoreRecord, 'id' | 'timestamp' | 'syncStatus'> = {
      studentName: params.userName,
      studentEmail: params.userEmail,
      userName: params.userName,
      userEmail: params.userEmail,
      nisn: params.nisn,
      school: params.school,
      grade: params.grade,
      levelNumber: params.levelId,
      levelId: params.levelId,
      levelTitle: params.levelTitle,
      score: params.score,
      kkm,
      stars: params.stars,
      coinsEarned: params.coinsEarned,
      accuracy: params.accuracy,
      status: isPass ? 'Lulus KKM' : 'Coba Lagi',
      badgeUnlocked: params.badgeEarned,
    };

    const savedRecord = await this.recordScore(baseRecord);

    let msg = `Data skor (${params.score} pts) tersimpan ke database Google Spreadsheet.`;
    if (this.gasUrl) {
      msg = `Tersinkron otomatis ke Google Apps Script Web App: ${this.gasUrl.substring(0, 30)}...`;
    }

    return {
      success: true,
      message: msg,
      record: savedRecord,
    };
  }

  // Record a score automatically and push to Google Apps Script Web App
  public async recordScore(record: Omit<GameScoreRecord, 'id' | 'timestamp' | 'syncStatus'>): Promise<GameScoreRecord> {
    const now = new Date();
    const formattedTimestamp = now.toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/\//g, '-');

    const newRecord: GameScoreRecord = {
      ...record,
      id: 'rec-' + Date.now(),
      timestamp: formattedTimestamp,
      syncStatus: this.gasUrl ? 'Sinkronisasi...' : 'Tersimpan Lokal'
    };

    // Prepend to internal list
    this.records.unshift(newRecord);
    this.saveToStorage();

    // If Google Apps Script Web App URL is configured, push via fetch
    if (this.gasUrl) {
      try {
        await fetch(this.gasUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8' // CORS friendly for GAS
          },
          body: JSON.stringify(newRecord),
          mode: 'no-cors' // Google Apps Script redirects require no-cors or simple POST
        });
        newRecord.syncStatus = 'Tersimpan di Google Sheets';
      } catch (err) {
        console.warn('Google Apps Script sync offline / fallback to local storage:', err);
        newRecord.syncStatus = 'Tersimpan Lokal';
      }
      this.saveToStorage();
    }

    return newRecord;
  }

  // Clear data or reset to seed
  public resetToSeed() {
    this.records = [...INITIAL_SEED_RECORDS];
    this.saveToStorage();
  }

  // Export current records as a CSV file to download
  public exportCSV(): string {
    const headers = [
      'Timestamp',
      'Nama Siswa',
      'Email Belajar.id',
      'Sekolah',
      'Kelas',
      'Level',
      'Judul Level',
      'Skor',
      'KKM',
      'Bintang',
      'Koin',
      'Status',
      'Lencana'
    ];

    const rows = this.records.map(r => [
      `"${r.timestamp}"`,
      `"${r.studentName}"`,
      `"${r.studentEmail}"`,
      `"${r.school}"`,
      `"${r.grade}"`,
      r.levelNumber,
      `"${r.levelTitle}"`,
      r.score,
      r.kkm,
      r.stars,
      r.coinsEarned,
      `"${r.status}"`,
      `"${r.badgeUnlocked || '-'}"`
    ]);

    return [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  }
}

export const sheetsDB = new GoogleSheetsDatabaseService();
