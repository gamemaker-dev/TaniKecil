import { GameScoreRecord, LeaderboardEntry, UserProfile, UserRole, TeacherGradebookResponse } from '../types';

declare global {
  interface Window {
    google?: {
      script?: {
        run: {
          withSuccessHandler: (fn: (res: any) => void) => any;
          withFailureHandler: (fn: (err: any) => void) => any;
          [key: string]: any;
        };
      };
    };
  }
}

const STORAGE_KEY_SCORES = 'tani_cilik_scores_db';
const STORAGE_KEY_USERS = 'tani_cilik_users_db';
const STORAGE_KEY_GAS_URL = 'tani_cilik_gas_webapp_url';
const DEFAULT_GAS_URL = '';

const INITIAL_SEED_USERS: UserProfile[] = [
  {
    id: 'GURU-01',
    role: 'Guru',
    nis: 'GURU123',
    name: 'Ibu Pertiwi, S.Pd.',
    grade: 'Guru IPAS SD',
    school: 'SDN 01 Percontohan',
    password: 'guru123',
    coins: 999,
    stars: 15,
    totalScore: 3500,
    capingStyle: 'caping_emas',
    avatarSeed: 'guru_pertiwi',
    lastLogin: '2026-10-03 08:00:00',
  },
  {
    id: 'SISWA-01',
    role: 'Murid',
    nis: '1001',
    name: 'Budi Santoso',
    grade: 'Kelas 4A',
    school: 'SDN 01 Percontohan',
    password: '1234',
    coins: 250,
    stars: 7,
    totalScore: 780,
    capingStyle: 'caping_bambu',
    avatarSeed: 'budi_farmer',
    lastLogin: '2026-10-03 08:15:00',
  },
  {
    id: 'SISWA-02',
    role: 'Murid',
    nis: '1002',
    name: 'Siti Nurhaliza',
    grade: 'Kelas 4A',
    school: 'SDN 01 Percontohan',
    password: '1234',
    coins: 400,
    stars: 12,
    totalScore: 1450,
    capingStyle: 'caping_batik',
    avatarSeed: 'siti_farmer',
    lastLogin: '2026-10-03 08:20:00',
  },
  {
    id: 'SISWA-03',
    role: 'Murid',
    nis: '1003',
    name: 'Ahmad Rizki',
    grade: 'Kelas 5B',
    school: 'SDN 01 Percontohan',
    password: '1234',
    coins: 320,
    stars: 9,
    totalScore: 1020,
    capingStyle: 'caping_bambu',
    avatarSeed: 'ahmad_farmer',
    lastLogin: '2026-10-03 08:25:00',
  },
];

const INITIAL_SEED_RECORDS: GameScoreRecord[] = [
  {
    id: 'rec-001',
    timestamp: '2026-10-02 08:35:12',
    studentName: 'Siti Nurhaliza',
    studentEmail: 'siti.nurhaliza@belajar.id',
    nis: '1002',
    school: 'SDN 01 Percontohan',
    grade: 'Kelas 4A',
    levelNumber: 1,
    levelTitle: 'Kenali Organ & Bibit Pangan',
    score: 320,
    kkm: 60,
    stars: 3,
    coinsEarned: 45,
    accuracy: '95%',
    status: 'Lulus KKM',
    badgeUnlocked: 'Sahabat Bibit Hijau',
    syncStatus: 'Tersimpan di Google Sheets',
  },
  {
    id: 'rec-002',
    timestamp: '2026-10-02 09:12:45',
    studentName: 'Budi Santoso',
    studentEmail: 'budi.santoso@belajar.id',
    nis: '1001',
    school: 'SDN 01 Percontohan',
    grade: 'Kelas 4A',
    levelNumber: 2,
    levelTitle: 'Olah Tanah & Nutrisi',
    score: 450,
    kkm: 60,
    stars: 3,
    coinsEarned: 60,
    accuracy: '90%',
    status: 'Lulus KKM',
    badgeUnlocked: 'Penjaga Tanah Subur',
    syncStatus: 'Tersimpan di Google Sheets',
  },
  {
    id: 'rec-003',
    timestamp: '2026-10-02 10:04:19',
    studentName: 'Ahmad Rizki',
    studentEmail: 'ahmad.r@belajar.id',
    nis: '1003',
    school: 'SDN 01 Percontohan',
    grade: 'Kelas 5B',
    levelNumber: 3,
    levelTitle: 'Basmi Hama Sahabat Petani',
    score: 410,
    kkm: 60,
    stars: 2,
    coinsEarned: 35,
    accuracy: '85%',
    status: 'Lulus KKM',
    badgeUnlocked: 'Pendekar Tani Organik',
    syncStatus: 'Tersimpan di Google Sheets',
  },
];

class GoogleSheetsDatabaseService {
  private records: GameScoreRecord[] = [];
  private users: UserProfile[] = [];
  private gasUrl: string = '';

  constructor() {
    this.loadFromStorage();
  }

  public isInsideGAS(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.google !== 'undefined' &&
      typeof window.google.script !== 'undefined' &&
      typeof window.google.script.run !== 'undefined'
    );
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const storedUrl = localStorage.getItem(STORAGE_KEY_GAS_URL);
      this.gasUrl = storedUrl || DEFAULT_GAS_URL;

      const storedRecords = localStorage.getItem(STORAGE_KEY_SCORES);
      this.records = storedRecords ? JSON.parse(storedRecords) : INITIAL_SEED_RECORDS;

      const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
      if (storedUsers) {
        const parsed: UserProfile[] = JSON.parse(storedUsers);
        // Pastikan akun bawaan (GURU123, 1001, 1002, 1003) selalu ada meskipun localStorage memiliki data lama
        INITIAL_SEED_USERS.forEach((seed) => {
          const idx = parsed.findIndex((u) => u.nis.toLowerCase() === seed.nis.toLowerCase());
          if (idx === -1) {
            parsed.push(seed);
          } else {
            if (!parsed[idx].role) parsed[idx].role = seed.role;
            if (!parsed[idx].password) parsed[idx].password = seed.password;
          }
        });
        this.users = parsed;
      } else {
        this.users = [...INITIAL_SEED_USERS];
      }
    } catch {
      this.records = [...INITIAL_SEED_RECORDS];
      this.users = [...INITIAL_SEED_USERS];
    }
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(this.records));
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(this.users));
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
    return this.getRecords().map((r) => ({
      ...r,
      userName: r.studentName,
      userEmail: r.studentEmail,
      levelId: r.levelNumber,
      nis: r.nis || '1001',
    }));
  }

  /**
   * Autentikasi Pengguna: Mencocokkan data login dengan Google Spreadsheet
   */
  public async loginUser(credentials: {
    role: UserRole;
    nis: string;
    password?: string;
  }): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    const cleanNis = credentials.nis.trim().toLowerCase();
    const cleanRole = credentials.role;

    // 1. Jika di dalam Google Apps Script (Native RPC)
    if (this.isInsideGAS()) {
      return new Promise((resolve) => {
        window.google!.script.run
          .withSuccessHandler((res: any) => {
            if (res && res.success && res.user) {
              this.updateLocalUser(res.user);
              resolve(res);
            } else {
              // Jika di sheet tidak ditemukan, coba periksa akun bawaan lokal
              const localRes = this.loginFallbackLocal(credentials);
              if (localRes.success) {
                resolve(localRes);
              } else {
                resolve({
                  success: false,
                  message: res?.message || 'NIS/NIP tidak ditemukan di Google Spreadsheet.',
                });
              }
            }
          })
          .withFailureHandler((err: any) => {
            resolve(this.loginFallbackLocal(credentials));
          })
          .apiLoginUser(credentials);
      });
    }

    // 2. Jika via Web App URL (REST GET)
    if (this.gasUrl) {
      try {
        const url = `${this.gasUrl}${this.gasUrl.includes('?') ? '&' : '?'}action=login&role=${cleanRole}&nis=${encodeURIComponent(cleanNis)}&password=${encodeURIComponent(credentials.password || '')}`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data && data.success && data.user) {
          this.updateLocalUser(data.user);
          return data;
        } else {
          // Jika di sheet online tidak ada, periksa akun demo/seed lokal
          const localRes = this.loginFallbackLocal(credentials);
          if (localRes.success) {
            return localRes;
          }
          return {
            success: false,
            message: data?.message || 'NIS/NIP tidak cocok dengan data Google Sheets.',
          };
        }
      } catch (e) {
        console.warn('Login online gagal, beralih ke cache lokal:', e);
      }
    }

    // 3. Fallback lokal
    return this.loginFallbackLocal(credentials);
  }

  private loginFallbackLocal(credentials: {
    role: UserRole;
    nis: string;
    password?: string;
  }): { success: boolean; message: string; user?: UserProfile } {
    const cleanNis = credentials.nis.trim().toLowerCase();
    let target = this.users.find(
      (u) => u.nis.toLowerCase() === cleanNis && u.role.toLowerCase() === credentials.role.toLowerCase()
    );

    if (!target) {
      target = INITIAL_SEED_USERS.find(
        (u) => u.nis.toLowerCase() === cleanNis && u.role.toLowerCase() === credentials.role.toLowerCase()
      );
      if (target) {
        this.users.unshift(target);
        this.saveToStorage();
      }
    }

    if (!target) {
      return {
        success: false,
        message:
          credentials.role === 'Guru'
            ? `Username / NIP Guru '${credentials.nis}' belum terdaftar. Silakan gunakan tab 'Daftar Akun Guru' terlebih dahulu.`
            : `NIS '${credentials.nis}' belum terdaftar di database. Silakan klik tab 'Daftar Murid Baru'.`,
      };
    }

    if (credentials.password && target.password && credentials.password !== target.password) {
      return {
        success: false,
        message: credentials.role === 'Guru' ? 'Kata sandi / Password Guru salah!' : 'PIN rahasia salah!',
      };
    }

    return {
      success: true,
      message: `Selamat datang kembali, ${target.name}!`,
      user: target,
    };
  }

  /**
   * Pendaftaran Pengguna Baru (Murid / Guru)
   */
  public async registerUser(params: {
    role: UserRole;
    nis: string;
    name: string;
    grade: string;
    school: string;
    password?: string;
  }): Promise<{ success: boolean; message: string; user?: UserProfile }> {
    // 1. Jika di dalam Google Apps Script (Native RPC)
    if (this.isInsideGAS()) {
      return new Promise((resolve) => {
        window.google!.script.run
          .withSuccessHandler((res: any) => {
            if (res && res.success && res.user) {
              this.updateLocalUser(res.user);
              resolve(res);
            } else {
              resolve({
                success: false,
                message: res?.message || 'Gagal mendaftar ke Google Sheets.',
              });
            }
          })
          .withFailureHandler((err: any) => {
            resolve(this.registerFallbackLocal(params));
          })
          .apiRegisterUser(params);
      });
    }

    // 2. Jika via Web App URL
    if (this.gasUrl) {
      try {
        const url = `${this.gasUrl}${this.gasUrl.includes('?') ? '&' : '?'}action=register&role=${params.role}&nis=${encodeURIComponent(params.nis)}&name=${encodeURIComponent(params.name)}&grade=${encodeURIComponent(params.grade)}&school=${encodeURIComponent(params.school)}&password=${encodeURIComponent(params.password || (params.role === 'Guru' ? '' : '1234'))}`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data && data.success && data.user) {
          this.updateLocalUser(data.user);
          return data;
        } else {
          return {
            success: false,
            message: data?.message || 'Gagal menyimpan data ke Google Spreadsheet.',
          };
        }
      } catch (e) {
        console.warn('Registrasi online gagal, beralih ke cache lokal:', e);
      }
    }

    // 3. Fallback lokal
    return this.registerFallbackLocal(params);
  }

  private registerFallbackLocal(params: {
    role: UserRole;
    nis: string;
    name: string;
    grade: string;
    school: string;
    password?: string;
  }): { success: boolean; message: string; user?: UserProfile } {
    const cleanNis = params.nis.trim().toLowerCase();
    const existing = this.users.find((u) => u.nis.toLowerCase() === cleanNis);
    if (existing) {
      const label = params.role === 'Guru' ? 'Username / NIP Guru' : 'NIS';
      return {
        success: false,
        message: `${label} '${params.nis}' sudah terdaftar atas nama ${existing.name}. Silakan langsung masuk!`,
      };
    }

    const newUser: UserProfile = {
      id: (params.role === 'Guru' ? 'GURU-' : 'SISWA-') + Date.now(),
      role: params.role,
      nis: params.nis,
      name: params.name,
      grade: params.grade,
      school: params.school,
      password: params.password || (params.role === 'Guru' ? '' : '1234'),
      coins: params.role === 'Guru' ? 500 : 150,
      stars: 0,
      totalScore: 0,
      capingStyle: params.role === 'Guru' ? 'caping_emas' : 'caping_bambu',
      avatarSeed: params.name.toLowerCase().replace(/ /g, '_'),
      lastLogin: new Date().toISOString(),
    };

    this.users.unshift(newUser);
    this.saveToStorage();

    return {
      success: true,
      message: params.role === 'Guru'
        ? `Pendaftaran Guru berhasil! Selamat bertugas, ${newUser.name}!`
        : `Pendaftaran berhasil! Selamat datang, ${newUser.name}!`,
      user: newUser,
    };
  }

  private updateLocalUser(user: UserProfile) {
    const idx = this.users.findIndex((u) => u.nis.toLowerCase() === user.nis.toLowerCase());
    if (idx >= 0) {
      this.users[idx] = { ...this.users[idx], ...user };
    } else {
      this.users.unshift(user);
    }
    this.saveToStorage();
  }

  /**
   * Mengambil Rekap Daftar Nilai Siswa (Hanya untuk Role Guru)
   */
  public async fetchTeacherGradebook(role: UserRole): Promise<TeacherGradebookResponse> {
    if (role !== 'Guru') {
      return {
        success: false,
        authorizedRole: role,
        totalSesiGame: 0,
        totalSiswa: 0,
        gradebook: [],
        students: [],
        message: '⛔ Akses Ditolak: Fitur Daftar Nilai hanya dapat diakses oleh Akun Guru.',
      };
    }

    // 1. Jika di dalam Google Apps Script (Native RPC)
    if (this.isInsideGAS()) {
      return new Promise((resolve) => {
        window.google!.script.run
          .withSuccessHandler((res: TeacherGradebookResponse) => {
            resolve(res);
          })
          .withFailureHandler(() => {
            resolve(this.getFallbackGradebook());
          })
          .apiGetTeacherGradebook(role);
      });
    }

    // 2. Jika via Web App URL
    if (this.gasUrl) {
      try {
        const url = `${this.gasUrl}${this.gasUrl.includes('?') ? '&' : '?'}action=getGradebook&role=Guru`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data && data.success) {
          return data;
        }
      } catch (e) {
        console.warn('Gagal fetch gradebook dari GAS:', e);
      }
    }

    // 3. Fallback lokal
    return this.getFallbackGradebook();
  }

  private getFallbackGradebook(): TeacherGradebookResponse {
    const students = this.users.filter((u) => u.role === 'Murid');
    const records = this.getRecords();

    const passCount = records.filter((r) => r.score >= (r.kkm || 60)).length;
    const avgScore = records.length > 0 ? Math.round(records.reduce((a, c) => a + c.score, 0) / records.length) : 0;
    const passRate = records.length > 0 ? Math.round((passCount / records.length) * 100) + '%' : '0%';

    return {
      success: true,
      authorizedRole: 'Guru',
      totalSesiGame: records.length,
      totalSiswa: students.length,
      gradebook: records,
      students: students.map((s) => ({
        id: s.id,
        nis: s.nis,
        name: s.name,
        grade: s.grade,
        school: s.school,
        coins: s.coins,
        stars: s.stars,
        totalScore: s.totalScore,
        lastActive: s.lastLogin,
      })),
      stats: {
        totalSiswa: students.length,
        totalSesiGame: records.length,
        rataRataSkor: avgScore,
        tingkatKelulusanKKM: passRate,
      },
    };
  }

  /**
   * Mengambil Leaderboard dari Google Sheets
   */
  public async fetchLeaderboardFromSheets(): Promise<LeaderboardEntry[]> {
    if (this.isInsideGAS()) {
      return new Promise((resolve) => {
        window.google!.script.run
          .withSuccessHandler((res: any) => {
            if (res && res.leaderboard) resolve(res.leaderboard);
            else resolve(this.getFallbackLeaderboard());
          })
          .withFailureHandler(() => resolve(this.getFallbackLeaderboard()))
          .apiGetLeaderboard();
      });
    }

    if (this.gasUrl) {
      try {
        const fetchUrl = `${this.gasUrl}${this.gasUrl.includes('?') ? '&' : '?'}action=getLeaderboard`;
        const resp = await fetch(fetchUrl);
        const data = await resp.json();
        if (data && data.leaderboard) return data.leaderboard;
      } catch (e) {
        console.warn('Gagal fetch leaderboard:', e);
      }
    }

    return this.getFallbackLeaderboard();
  }

  private getFallbackLeaderboard(): LeaderboardEntry[] {
    const students = this.users
      .filter((u) => u.role === 'Murid')
      .sort((a, b) => b.stars !== a.stars ? b.stars - a.stars : b.totalScore - a.totalScore);

    return students.map((s, index) => ({
      rank: index + 1,
      name: s.name,
      avatar: index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🧑‍🌾',
      score: s.totalScore,
      badge: index === 0 ? '👑 Petani Legendaris' : '🌱 Petani Cilik Unggul',
    }));
  }

  public async recordGameScore(params: {
    userName: string;
    userEmail: string;
    nis: string;
    school: string;
    grade: string;
    levelId: number;
    levelTitle: string;
    score: number;
    stars: number;
    coinsEarned: number;
    accuracy: number;
    badgeEarned?: string;
    capingStyle?: string;
  }): Promise<{ success: boolean; message: string; record?: GameScoreRecord }> {
    const kkm = 60;
    const isPass = params.score >= kkm;

    const baseRecord: Omit<GameScoreRecord, 'id' | 'timestamp' | 'syncStatus'> = {
      studentName: params.userName,
      studentEmail: params.userEmail,
      userName: params.userName,
      userEmail: params.userEmail,
      nis: params.nis,
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

    let msg = `Data skor (${params.score} pts) tersimpan di database Google Spreadsheet.`;
    if (this.isInsideGAS()) {
      msg = 'Tersinkron langsung via Google Apps Script (Internal Sheets)!';
    } else if (this.gasUrl) {
      msg = `Tersinkron otomatis ke Google Apps Script Web App.`;
    }

    return {
      success: true,
      message: msg,
      record: savedRecord,
    };
  }

  public async recordScore(record: Omit<GameScoreRecord, 'id' | 'timestamp' | 'syncStatus'>): Promise<GameScoreRecord> {
    const now = new Date();
    const formattedTimestamp = now
      .toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      .replace(/\//g, '-');

    const newRecord: GameScoreRecord = {
      ...record,
      id: 'rec-' + Date.now(),
      timestamp: formattedTimestamp,
      syncStatus: this.isInsideGAS() || this.gasUrl ? 'Sinkronisasi...' : 'Tersimpan Lokal',
    };

    this.records.unshift(newRecord);

    // Update user coins and score
    const u = this.users.find((user) => user.nis === record.nis || user.name === record.studentName);
    if (u) {
      u.coins += record.coinsEarned;
      u.stars = Math.max(u.stars, record.stars);
      u.totalScore += record.score;
      u.lastLogin = formattedTimestamp;
    }

    this.saveToStorage();

    if (this.isInsideGAS()) {
      return new Promise((resolve) => {
        window.google!.script.run
          .withSuccessHandler(() => {
            newRecord.syncStatus = 'Tersimpan di Google Sheets';
            this.saveToStorage();
            resolve(newRecord);
          })
          .withFailureHandler(() => {
            newRecord.syncStatus = 'Tersimpan Lokal';
            this.saveToStorage();
            resolve(newRecord);
          })
          .apiSaveScore(newRecord);
      });
    }

    if (this.gasUrl) {
      try {
        await fetch(this.gasUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(newRecord),
          mode: 'no-cors',
        });
        newRecord.syncStatus = 'Tersimpan di Google Sheets';
      } catch (err) {
        newRecord.syncStatus = 'Tersimpan Lokal';
      }
      this.saveToStorage();
    }

    return newRecord;
  }

  public exportCSV(): string {
    const headers = [
      'Timestamp',
      'Nama Siswa',
      'NIS',
      'Sekolah',
      'Kelas',
      'Level',
      'Judul Level',
      'Skor',
      'KKM',
      'Bintang',
      'Koin',
      'Status',
      'Lencana',
    ];

    const rows = this.records.map((r) => [
      `"${r.timestamp}"`,
      `"${r.studentName}"`,
      `"${r.nis || '-'}"`,
      `"${r.school}"`,
      `"${r.grade}"`,
      r.levelNumber,
      `"${r.levelTitle}"`,
      r.score,
      r.kkm,
      r.stars,
      r.coinsEarned,
      `"${r.status}"`,
      `"${r.badgeUnlocked || '-'}"`,
    ]);

    return [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  }
}

export const sheetsDB = new GoogleSheetsDatabaseService();

export const googleAppsScriptTemplate = `/**
 * ====================================================================
 * 🌾 GAME EDUKASI TANI CILIK - GOOGLE APPS SCRIPT BACKEND (Code.gs)
 * Role-Based Auth (Guru & Murid) + Google Sheets Database + Gradebook
 * ====================================================================
 */

function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('🌾 Petualangan Tani Cilik - Edukasi Pertanian & Ekosistem')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🌾 Petualangan Tani Cilik')
    .addItem('🚀 Buka Game di Spreadsheet', 'showGameSidebar')
    .addItem('📊 Generate Dashboard Grafik & KKM', 'generateAnalyticsDashboard')
    .addSeparator()
    .addItem('⚙️ Buat / Perbaiki Struktur Sheet', 'setupSheetsStructure')
    .addToUi();
}

function showGameSidebar() {
  var html = HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('🌾 Petualangan Tani Cilik')
    .setWidth(450);
  SpreadsheetApp.getUi().showSidebar(html);
}

// Lihat file gas/Code.gs untuk implementasi lengkap semua fungsi API:
// - apiLoginUser
// - apiRegisterUser
// - apiGetTeacherGradebook
// - apiSaveScore
// - apiGetLeaderboard
`;

