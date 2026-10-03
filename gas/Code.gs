/**
 * ====================================================================
 * PETUALANGAN TANI CILIK - GOOGLE APPS SCRIPT BACKEND (Code.gs)
 * Game Edukasi IPAS Kurikulum Merdeka Fase B & C (SD Kelas 4 - 6)
 * ====================================================================
 * 
 * Fitur:
 * 1. Manajemen Akun & Autentikasi:
 *    - Role User: "Guru" dan "Murid".
 *    - Pendaftaran Murid baru (NIS, Nama, Kelas, Sekolah, PIN).
 *    - Pencocokan data login dengan database Google Spreadsheet.
 * 2. Hak Akses Khusus Guru:
 *    - "Daftar Nilai Siswa" & Rekap Hasil Belajar HANYA BISA DIAKSES GURU.
 *    - Ekspor laporan rekapitulasi penilaian kelas (Kurikulum Merdeka).
 * 3. Integrasi Menu Google Sheets: Mainkan game langsung di Google Sheets
 *    lewat Modal Dialog atau Sidebar (onOpen).
 * 4. Dual API: Native RPC (google.script.run) dan REST API (doGet / doPost).
 * 
 * Pengembang: Tim Tani Cilik Edukasi
 * Lisensi: Open Source / Edukasi
 */

// Konfigurasi Nama Sheet
var SHEET_NAMES = {
  SKOR: "Skor_Game",
  PENGGUNA: "Data_Pengguna",
  LEADERBOARD: "Leaderboard",
  MATERI: "Materi_IPAS",
  PENGATURAN: "Pengaturan"
};

// Nama file Google Spreadsheet di Google Drive Anda
var SPREADSHEET_NAME = "Game IPAS Tani Cilik";

/**
 * Mendapatkan referensi Google Spreadsheet:
 * 1. Jika dibuka dari dalam Spreadsheet (Extensions > Apps Script) -> getActiveSpreadsheet()
 * 2. Jika dijalankan standalone di Apps Script -> otomatis mencari file "Game IPAS Tani Cilik" di Google Drive
 * 3. Jika belum ada -> otomatis membuat file baru "Game IPAS Tani Cilik" di Google Drive
 */
function getGameSpreadsheet() {
  // 1. Coba spreadsheet aktif (jika dibuka dari menu Extensions di dalam Google Sheets)
  try {
    var activeSS = SpreadsheetApp.getActiveSpreadsheet();
    if (activeSS) return activeSS;
  } catch (e) {}

  // 2. Cari file bernama "Game IPAS Tani Cilik" di Google Drive Anda secara otomatis
  try {
    var files = DriveApp.getFilesByName(SPREADSHEET_NAME);
    while (files.hasNext()) {
      var file = files.next();
      if (file.getMimeType() === MimeType.GOOGLE_SHEETS) {
        var foundSS = SpreadsheetApp.open(file);
        if (foundSS) {
          Logger.log("✅ Menemukan spreadsheet di Google Drive: " + foundSS.getName() + " (" + foundSS.getUrl() + ")");
          return foundSS;
        }
      }
    }
  } catch (e) {
    Logger.log("Pencarian DriveApp: " + e.message);
  }

  // 3. Jika belum ditemukan di Drive, buatkan file baru secara otomatis!
  try {
    var newSS = SpreadsheetApp.create(SPREADSHEET_NAME);
    Logger.log("🎉 Berhasil membuat spreadsheet baru otomatis di Drive: " + newSS.getUrl());
    return newSS;
  } catch (e) {
    Logger.log("Gagal membuat spreadsheet otomatis: " + e.message);
  }

  return null;
}

/**
 * Trigger saat Google Spreadsheet dibuka.
 * Menambahkan Menu Khusus di bilah menu Google Sheets.
 */
function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    if (!ui) return;
    ui.createMenu("🌾 Petualangan Tani Cilik")
      .addItem("🎮 Mainkan Game (Dialog Layar Penuh)", "showGameDialog")
      .addItem("📱 Buka Game di Panel Samping (Sidebar)", "showGameSidebar")
      .addSeparator()
      .addItem("📋 Buka Rekap Daftar Nilai (Khusus Guru)", "showGradebookDialog")
      .addSeparator()
      .addItem("⚙️ Siapkan Struktur Sheet Otomatis", "setupSheetsStructure")
      .addItem("🏷️ Ganti Nama File Jadi 'Game IPAS Tani Cilik'", "renameSpreadsheetToGameIPAS")
      .addItem("🔄 Hitung Ulang Papan Peringkat (Leaderboard)", "recalculateLeaderboard")
      .addItem("📊 Buat Lembar Statistik & Grafik Nilai", "generateAnalyticsDashboard")
      .addSeparator()
      .addItem("🌐 Dapatkan URL Web App", "showWebAppUrlDialog")
      .addToUi();
  } catch (e) {
    // getUi() diabaikan jika dijalankan di standalone script
  }
}

/**
 * Menampilkan Game di Modal Dialog Google Sheets.
 */
function showGameDialog() {
  var html = HtmlService.createHtmlOutputFromFile("Index")
    .setWidth(1080)
    .setHeight(720)
    .setTitle("Petualangan Tani Cilik - Game Edukasi IPAS");
  SpreadsheetApp.getUi().showModalDialog(html, "🌾 Petualangan Tani Cilik - Game Edukasi IPAS");
}

/**
 * Menampilkan Game di Sidebar samping Google Sheets.
 */
function showGameSidebar() {
  var html = HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("🌾 Tani Cilik - Sidebar");
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Menampilkan ringkasan daftar nilai langsung di spreadsheet.
 */
function showGradebookDialog() {
  var stats = apiGetStatsSummary();
  var message = "📊 RINGKASAN REKAPITULASI KELAS (KHUSUS GURU)\n\n" +
    "• Total Siswa Terdaftar: " + stats.totalSiswa + " anak\n" +
    "• Total Sesi Permainan: " + stats.totalSesiGame + " kali\n" +
    "• Rata-rata Skor Kelas: " + stats.rataRataSkor + " Poin\n" +
    "• Tingkat Kelulusan KKM: " + stats.tingkatKelulusanKKM + "\n\n" +
    "Silakan buka sheet 'Skor_Game' atau jalankan game dengan Akun Guru untuk melihat tabel nilai interaktif.";
  SpreadsheetApp.getUi().alert("📋 Daftar Nilai Guru", message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Menampilkan dialog info URL Web App.
 */
function showWebAppUrlDialog() {
  var url = ScriptApp.getService().getUrl();
  var message = url 
    ? "Tautan Web App aktif Anda:\n\n" + url + "\n\nBagikan tautan ini kepada siswa untuk bermain secara online!"
    : "Web App belum dideploy.\nSilakan klik 'Deploy' (Terapkan) > 'New deployment' > Pilih 'Web App' dengan akses 'Anyone'.";
  SpreadsheetApp.getUi().alert("🌐 Tautan Web App Petualangan Tani Cilik", message, SpreadsheetApp.getUi().ButtonSet.OK);
}

/**
 * Endpoint HTTP GET:
 * - Menangani permintaan REST API JSON dan penyajian HTML.
 */
function doGet(e) {
  var action = e && e.parameter ? e.parameter.action : "";

  // REST API Endpoints
  if (action === "login") {
    return jsonResponse(apiLoginUser({
      role: e.parameter.role || "Murid",
      nis: e.parameter.nis || e.parameter.nip || "",
      password: e.parameter.password || ""
    }));
  } else if (action === "register") {
    return jsonResponse(apiRegisterUser({
      role: e.parameter.role || "Murid",
      nis: e.parameter.nis || "",
      name: e.parameter.name || "",
      grade: e.parameter.grade || "Kelas 4",
      school: e.parameter.school || "SDN 01 Percontohan",
      password: e.parameter.password || "1234"
    }));
  } else if (action === "getGradebook") {
    return jsonResponse(apiGetTeacherGradebook(e.parameter.role || ""));
  } else if (action === "getLeaderboard") {
    return jsonResponse(apiGetLeaderboard());
  } else if (action === "getProfile") {
    return jsonResponse(apiGetStudentProfile(e.parameter.id || e.parameter.nis || ""));
  } else if (action === "getScores") {
    return jsonResponse(apiGetAllScores());
  } else if (action === "getStats") {
    return jsonResponse(apiGetStatsSummary());
  }

  // Standar: Sajikan Antarmuka Game Web App
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Petualangan Tani Cilik - Game Edukasi IPAS")
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Endpoint HTTP POST:
 * Menerima pengiriman data login, registrasi, atau skor dari aplikasi via fetch.
 */
function doPost(e) {
  try {
    var data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error("Tidak ada data yang diterima.");
    }

    var action = data.action || "";

    if (action === "login") {
      return jsonResponse(apiLoginUser(data));
    } else if (action === "register") {
      return jsonResponse(apiRegisterUser(data));
    } else if (action === "getGradebook") {
      return jsonResponse(apiGetTeacherGradebook(data.role || ""));
    } else {
      // Default: simpan skor
      var result = apiSaveScore(data);
      return jsonResponse(result);
    }
  } catch (error) {
    return jsonResponse({
      status: "error",
      success: false,
      message: error.toString()
    });
  }
}

/**
 * Helper untuk mengembalikan respon JSON dengan header MIME tepat.
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ====================================================================
// AUTENTIKASI: LOGIN & REGISTRASI (GURU & MURID)
// ====================================================================

/**
 * Mencocokkan data login dengan Google Spreadsheet (Sheet Data_Pengguna).
 */
function apiLoginUser(credentials) {
  try {
    var ss = getGameSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.PENGGUNA);
    if (!sheet) {
      setupSheetsStructure();
      sheet = ss.getSheetByName(SHEET_NAMES.PENGGUNA);
    }

    var targetRole = String(credentials.role || "Murid").trim().toLowerCase();
    var targetNis = String(credentials.nis || credentials.nip || "").trim().toLowerCase();
    var targetPass = String(credentials.password || "").trim();

    if (!targetNis) {
      return {
        success: false,
        message: "Silakan masukkan " + (targetRole === "guru" ? "NIP / Kode Guru" : "Nomor Induk Siswa (NIS)") + "."
      };
    }

    var data = sheet.getDataRange().getValues();
    var foundIndex = -1;

    // Baris 1 adalah Header. Mulai baris ke-2 (index 1)
    // Format Kolom:
    // 0: ID_User, 1: Role, 2: NIS_NIP, 3: Nama, 4: Kelas, 5: Sekolah,
    // 6: Password_PIN, 7: Koin, 8: Total_Bintang, 9: Total_Skor, 10: Gaya_Caping, 11: Terakhir_Login
    for (var i = 1; i < data.length; i++) {
      var rowRole = String(data[i][1]).trim().toLowerCase();
      var rowNis = String(data[i][2]).trim().toLowerCase();
      var rowPass = String(data[i][6]).trim();

      if (rowNis === targetNis) {
        // Cek Role
        if (rowRole !== targetRole) {
          return {
            success: false,
            message: "Akun ini terdaftar sebagai " + data[i][1] + ", bukan " + credentials.role + "."
          };
        }

        // Cek Password/PIN jika user mengisi atau akun guru
        if (targetPass && rowPass && targetPass !== rowPass) {
          return {
            success: false,
            message: "Kata sandi / PIN yang Anda masukkan salah!"
          };
        }

        foundIndex = i;
        break;
      }
    }

    if (foundIndex === -1) {
      var nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");

      // Auto-seed akun default jika spreadsheet belum memiliki akun demo
      if (targetRole === "guru" && targetNis === "guru123" && (!targetPass || targetPass === "guru123")) {
        sheet.appendRow([
          "GURU-01", "Guru", "GURU123", "Ibu Pertiwi, S.Pd.", "Guru IPAS SD",
          "SDN 01 Percontohan", "guru123", 999, 15, 3500, "caping_emas", nowStr
        ]);
        return {
          success: true,
          status: "success",
          message: "Selamat datang kembali, Ibu Pertiwi, S.Pd. (Guru)!",
          user: {
            id: "GURU-01", role: "Guru", nis: "GURU123", name: "Ibu Pertiwi, S.Pd.",
            grade: "Guru IPAS SD", school: "SDN 01 Percontohan", coins: 999,
            stars: 15, totalScore: 3500, capingStyle: "caping_emas", lastLogin: nowStr
          }
        };
      }

      if (targetRole === "murid" && targetNis === "1001" && (!targetPass || targetPass === "1234")) {
        sheet.appendRow([
          "SISWA-01", "Murid", "1001", "Budi Santoso", "Kelas 4A",
          "SDN 01 Percontohan", "1234", 250, 7, 780, "caping_bambu", nowStr
        ]);
        return {
          success: true,
          status: "success",
          message: "Selamat datang kembali, Budi Santoso (Murid)!",
          user: {
            id: "SISWA-01", role: "Murid", nis: "1001", name: "Budi Santoso",
            grade: "Kelas 4A", school: "SDN 01 Percontohan", coins: 250,
            stars: 7, totalScore: 780, capingStyle: "caping_bambu", lastLogin: nowStr
          }
        };
      }

      if (targetRole === "murid" && targetNis === "1002" && (!targetPass || targetPass === "1234")) {
        sheet.appendRow([
          "SISWA-02", "Murid", "1002", "Siti Nurhaliza", "Kelas 4A",
          "SDN 01 Percontohan", "1234", 400, 12, 1450, "caping_batik", nowStr
        ]);
        return {
          success: true,
          status: "success",
          message: "Selamat datang kembali, Siti Nurhaliza (Murid)!",
          user: {
            id: "SISWA-02", role: "Murid", nis: "1002", name: "Siti Nurhaliza",
            grade: "Kelas 4A", school: "SDN 01 Percontohan", coins: 400,
            stars: 12, totalScore: 1450, capingStyle: "caping_batik", lastLogin: nowStr
          }
        };
      }

      if (targetRole === "murid" && targetNis === "1003" && (!targetPass || targetPass === "1234")) {
        sheet.appendRow([
          "SISWA-03", "Murid", "1003", "Ahmad Rizki", "Kelas 5B",
          "SDN 01 Percontohan", "1234", 320, 9, 1020, "caping_bambu", nowStr
        ]);
        return {
          success: true,
          status: "success",
          message: "Selamat datang kembali, Ahmad Rizki (Murid)!",
          user: {
            id: "SISWA-03", role: "Murid", nis: "1003", name: "Ahmad Rizki",
            grade: "Kelas 5B", school: "SDN 01 Percontohan", coins: 320,
            stars: 9, totalScore: 1020, capingStyle: "caping_bambu", lastLogin: nowStr
          }
        };
      }

      return {
        success: false,
        message: targetRole === "guru"
          ? "Username / NIP Guru '" + credentials.nis + "' belum terdaftar di spreadsheet! Silakan klik tab 'Daftar Akun Guru' terlebih dahulu."
          : "NIS '" + credentials.nis + "' belum terdaftar. Silakan klik tab 'Daftar Murid Baru' terlebih dahulu."
      };
    }

    // Catat waktu login terakhir
    var nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    sheet.getRange(foundIndex + 1, 12).setValue(nowStr);

    var userProfile = {
      id: data[foundIndex][0],
      role: data[foundIndex][1],
      nis: data[foundIndex][2],
      name: data[foundIndex][3],
      grade: data[foundIndex][4],
      school: data[foundIndex][5],
      coins: Number(data[foundIndex][7] || 0),
      stars: Number(data[foundIndex][8] || 0),
      totalScore: Number(data[foundIndex][9] || 0),
      capingStyle: data[foundIndex][10] || "caping_bambu",
      lastLogin: nowStr
    };

    return {
      success: true,
      status: "success",
      message: "Selamat datang kembali, " + userProfile.name + " (" + userProfile.role + ")!",
      user: userProfile
    };

  } catch (err) {
    return {
      success: false,
      message: "Terjadi kesalahan sistem saat login: " + err.toString()
    };
  }
}

/**
 * Mendaftarkan Pengguna baru (Murid / Guru) ke dalam Google Spreadsheet.
 */
function apiRegisterUser(params) {
  try {
    var ss = getGameSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.PENGGUNA);
    if (!sheet) {
      setupSheetsStructure();
      sheet = ss.getSheetByName(SHEET_NAMES.PENGGUNA);
    }

    var role = params.role || "Murid";
    var nis = String(params.nis || "").trim();
    var name = String(params.name || "").trim();
    var grade = String(params.grade || (role === "Guru" ? "Guru IPAS SD" : "Kelas 4")).trim();
    var school = String(params.school || "SDN 01 Percontohan").trim();
    var pass = String(params.password || (role === "Guru" ? "" : "1234")).trim();

    if (role === "Guru") {
      if (!nis || !name || !pass) {
        return {
          success: false,
          message: "Username / NIP, Nama Lengkap, dan Kata Sandi Guru wajib diisi!"
        };
      }
      if (pass.length < 4) {
        return {
          success: false,
          message: "Kata Sandi Guru minimal 4 karakter!"
        };
      }
    } else {
      if (!nis || !name) {
        return {
          success: false,
          message: "NIS dan Nama Siswa wajib diisi!"
        };
      }
    }

    // Periksa apakah NIS / Username sudah terdaftar di Spreadsheet
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      var existingNis = String(data[i][2]).trim().toLowerCase();
      if (existingNis === nis.toLowerCase()) {
        var label = role === "Guru" ? "Username / NIP Guru" : "NIS";
        return {
          success: false,
          message: label + " '" + nis + "' sudah terdaftar atas nama " + data[i][3] + ". Silakan gunakan menu Masuk!"
        };
      }
    }

    // Tambahkan baris baru ke Sheet Data_Pengguna
    var newId = (role === "Guru" ? "GURU-" : "SISWA-") + (sheet.getLastRow());
    var nowStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    var defaultCoins = role === "Guru" ? 500 : 150; // Bonus pendaftaran

    sheet.appendRow([
      newId,
      role,
      nis,
      name,
      grade,
      school,
      pass,
      defaultCoins,
      0, // stars
      0, // totalScore
      role === "Guru" ? "caping_emas" : "caping_bambu",
      nowStr
    ]);

    var newUser = {
      id: newId,
      role: role,
      nis: nis,
      name: name,
      grade: grade,
      school: school,
      coins: defaultCoins,
      stars: 0,
      totalScore: 0,
      capingStyle: role === "Guru" ? "caping_emas" : "caping_bambu",
      lastLogin: nowStr
    };

    return {
      success: true,
      status: "success",
      message: role === "Guru"
        ? "Akun Guru berhasil didaftarkan ke Google Spreadsheet! Selamat bertugas, " + name + "!"
        : "Pendaftaran siswa berhasil disimpan ke Google Spreadsheet! Selamat datang, " + name + "!",
      user: newUser
    };

  } catch (err) {
    return {
      success: false,
      message: "Gagal menyimpan pendaftaran ke Google Sheets: " + err.toString()
    };
  }
}

// ====================================================================
// FITUR KHUSUS GURU: DAFTAR NILAI & EVALUASI KELAS
// ====================================================================

/**
 * Mengambil rekap daftar nilai seluruh siswa.
 * HANYA BISA DIAKSES JIKA ROLE ADALAH 'GURU'.
 */
function apiGetTeacherGradebook(requestRole) {
  try {
    if (String(requestRole).trim().toLowerCase() !== "guru") {
      return {
        success: false,
        message: "⛔ Akses Ditolak: Fitur Daftar Nilai hanya diperuntukkan bagi Guru / Pendidik."
      };
    }

    var ss = getGameSpreadsheet();
    var sheetSkor = ss.getSheetByName(SHEET_NAMES.SKOR);
    var sheetPengguna = ss.getSheetByName(SHEET_NAMES.PENGGUNA);

    var records = [];
    if (sheetSkor && sheetSkor.getLastRow() > 1) {
      var skorData = sheetSkor.getDataRange().getValues();
      for (var i = 1; i < skorData.length; i++) {
        records.push({
          id: skorData[i][0],
          timestamp: skorData[i][1],
          studentName: skorData[i][2],
          nis: skorData[i][4],
          school: skorData[i][5],
          grade: skorData[i][6],
          levelNumber: Number(skorData[i][7]),
          levelTitle: skorData[i][8],
          score: Number(skorData[i][9]),
          kkm: Number(skorData[i][10]),
          stars: Number(skorData[i][11]),
          coinsEarned: Number(skorData[i][12]),
          accuracy: skorData[i][13],
          status: skorData[i][14],
          badgeUnlocked: skorData[i][15]
        });
      }
    }

    // Rekapitulasi per Siswa
    var studentSummaries = [];
    if (sheetPengguna && sheetPengguna.getLastRow() > 1) {
      var userData = sheetPengguna.getDataRange().getValues();
      for (var j = 1; j < userData.length; j++) {
        if (String(userData[j][1]).toLowerCase() === "murid") {
          studentSummaries.push({
            id: userData[j][0],
            nis: userData[j][2],
            name: userData[j][3],
            grade: userData[j][4],
            school: userData[j][5],
            coins: Number(userData[j][7] || 0),
            stars: Number(userData[j][8] || 0),
            totalScore: Number(userData[j][9] || 0),
            lastActive: userData[j][11]
          });
        }
      }
    }

    return {
      success: true,
      status: "success",
      authorizedRole: "Guru",
      totalSesiGame: records.length,
      totalSiswa: studentSummaries.length,
      gradebook: records,
      students: studentSummaries,
      stats: apiGetStatsSummary()
    };

  } catch (err) {
    return {
      success: false,
      message: "Gagal memuat rekap nilai: " + err.toString()
    };
  }
}

// ====================================================================
// PENCATATAN SKOR & PROFIL REAL-TIME
// ====================================================================

/**
 * Menyimpan data hasil permainan ke Google Sheets.
 */
function apiSaveScore(params) {
  try {
    var ss = getGameSpreadsheet();
    var sheetSkor = ss.getSheetByName(SHEET_NAMES.SKOR);
    if (!sheetSkor) {
      setupSheetsStructure();
      sheetSkor = ss.getSheetByName(SHEET_NAMES.SKOR);
    }

    var timestamp = params.timestamp || Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");
    var studentName = params.studentName || params.userName || "Anonim";
    var studentEmail = params.studentEmail || params.userEmail || "-";
    var nis = params.nis || params.nisn || "-";
    var school = params.school || "SDN 01 Percontohan";
    var grade = params.grade || "Kelas 4";
    var levelNumber = Number(params.levelNumber || params.levelId || 1);
    var levelTitle = params.levelTitle || ("Level " + levelNumber);
    var score = Number(params.score || 0);
    var kkm = Number(params.kkm || 60);
    var stars = Number(params.stars || 1);
    var coinsEarned = Number(params.coinsEarned || 0);
    var accuracy = Number(params.accuracy || 100);
    var status = score >= kkm ? "Lulus KKM" : "Coba Lagi";
    var badgeUnlocked = params.badgeUnlocked || params.badgeEarned || "-";

    var recordId = "REC-" + Date.now();

    // 1. Simpan ke sheet Skor_Game
    sheetSkor.appendRow([
      recordId,
      timestamp,
      studentName,
      studentEmail,
      nis,
      school,
      grade,
      levelNumber,
      levelTitle,
      score,
      kkm,
      stars,
      coinsEarned,
      accuracy + "%",
      status,
      badgeUnlocked
    ]);

    // 2. Perbarui profil di sheet Data_Pengguna
    updateUserProgress({
      nis: nis,
      name: studentName,
      school: school,
      grade: grade,
      score: score,
      stars: stars,
      coins: coinsEarned,
      capingStyle: params.capingStyle,
      timestamp: timestamp
    });

    // 3. Perbarui leaderboard berkala
    recalculateLeaderboard();

    return {
      status: "success",
      success: true,
      message: "Skor berhasil dicatat di Google Sheets!",
      recordId: recordId,
      timestamp: timestamp,
      rowNumber: sheetSkor.getLastRow()
    };
  } catch (err) {
    return {
      status: "error",
      success: false,
      message: err.toString()
    };
  }
}

/**
 * Memperbarui akumulasi progres siswa di sheet Data_Pengguna.
 */
function updateUserProgress(p) {
  var ss = getGameSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAMES.PENGGUNA);
  if (!sheet) return;

  var data = sheet.getDataRange().getValues();
  var rowIndex = -1;

  for (var i = 1; i < data.length; i++) {
    var rowNis = String(data[i][2]).trim().toLowerCase();
    var rowName = String(data[i][3]).trim().toLowerCase();

    if ((p.nis && p.nis !== "-" && rowNis === String(p.nis).trim().toLowerCase()) ||
        (rowName === p.name.toLowerCase())) {
      rowIndex = i + 1; // 1-indexed baris sheet
      break;
    }
  }

  if (rowIndex > 1) {
    var currKoin = Number(data[rowIndex - 1][7] || 0) + Number(p.coins || 0);
    var currStars = Math.max(Number(data[rowIndex - 1][8] || 0), Number(p.stars || 0));
    var currTotalScore = Number(data[rowIndex - 1][9] || 0) + Number(p.score || 0);
    var caping = p.capingStyle || data[rowIndex - 1][10] || "caping_bambu";

    sheet.getRange(rowIndex, 8).setValue(currKoin);
    sheet.getRange(rowIndex, 9).setValue(currStars);
    sheet.getRange(rowIndex, 10).setValue(currTotalScore);
    sheet.getRange(rowIndex, 11).setValue(caping);
    sheet.getRange(rowIndex, 12).setValue(p.timestamp);
  } else {
    // Siswa baru jika belum terdaftar
    var studentId = "SISWA-" + (sheet.getLastRow());
    sheet.appendRow([
      studentId,
      "Murid",
      p.nis || ("NIS-" + sheet.getLastRow()),
      p.name,
      p.grade || "Kelas 4",
      p.school || "SDN 01 Percontohan",
      "1234",
      p.coins || 150,
      p.stars || 0,
      p.score || 0,
      p.capingStyle || "caping_bambu",
      p.timestamp
    ]);
  }
}

/**
 * Mengambil profil siswa berdasarkan NIS atau Nama.
 */
function apiGetStudentProfile(query) {
  try {
    var ss = getGameSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.PENGGUNA);
    if (!sheet) return { success: false, message: "Sheet data pengguna belum ada." };

    var data = sheet.getDataRange().getValues();
    var q = String(query).trim().toLowerCase();

    for (var i = 1; i < data.length; i++) {
      var id = String(data[i][0]).toLowerCase();
      var role = String(data[i][1]);
      var nis = String(data[i][2]).toLowerCase();
      var name = String(data[i][3]).toLowerCase();

      if (q === id || q === nis || q === name) {
        return {
          success: true,
          profile: {
            id: data[i][0],
            role: role,
            nis: data[i][2],
            name: data[i][3],
            grade: data[i][4],
            school: data[i][5],
            coins: Number(data[i][7] || 0),
            stars: Number(data[i][8] || 0),
            totalScore: Number(data[i][9] || 0),
            capingStyle: data[i][10] || "caping_bambu",
            lastLogin: data[i][11]
          }
        };
      }
    }

    return { success: false, message: "Data pengguna tidak ditemukan." };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

/**
 * Mengambil data Papan Peringkat (Leaderboard) teratas.
 */
function apiGetLeaderboard() {
  try {
    var ss = getGameSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAMES.LEADERBOARD);
    if (!sheet) {
      recalculateLeaderboard();
      sheet = ss.getSheetByName(SHEET_NAMES.LEADERBOARD);
    }

    var data = sheet.getDataRange().getValues();
    var leaders = [];

    for (var i = 1; i < data.length; i++) {
      if (data[i][1]) {
        leaders.push({
          rank: Number(data[i][0] || i),
          name: String(data[i][1]),
          school: String(data[i][2] || "-"),
          grade: String(data[i][3] || "-"),
          score: Number(data[i][4] || 0),
          stars: Number(data[i][5] || 0),
          badge: String(data[i][6] || "Petani Teladan"),
          avatar: String(data[i][7] || "🧑‍🌾")
        });
      }
    }

    return {
      status: "success",
      success: true,
      total: leaders.length,
      leaderboard: leaders
    };
  } catch (e) {
    return {
      status: "error",
      success: false,
      message: e.toString(),
      leaderboard: []
    };
  }
}

/**
 * Ringkasan statistik kelas.
 */
function apiGetStatsSummary() {
  try {
    var ss = getGameSpreadsheet();
    var sheetSkor = ss.getSheetByName(SHEET_NAMES.SKOR);
    var sheetPengguna = ss.getSheetByName(SHEET_NAMES.PENGGUNA);

    var totalPermainan = sheetSkor ? Math.max(0, sheetSkor.getLastRow() - 1) : 0;
    var totalSiswa = 0;

    if (sheetPengguna && sheetPengguna.getLastRow() > 1) {
      var users = sheetPengguna.getDataRange().getValues();
      for (var u = 1; u < users.length; u++) {
        if (String(users[u][1]).toLowerCase() === "murid") totalSiswa++;
      }
    }

    var lulusCount = 0;
    var totalNilai = 0;

    if (sheetSkor && totalPermainan > 0) {
      var skorData = sheetSkor.getRange(2, 10, totalPermainan, 6).getValues();
      for (var i = 0; i < skorData.length; i++) {
        var scoreVal = Number(skorData[i][0] || 0);
        var statusVal = String(skorData[i][5] || "");
        totalNilai += scoreVal;
        if (statusVal.toLowerCase().indexOf("lulus") !== -1) {
          lulusCount++;
        }
      }
    }

    var rataRata = totalPermainan > 0 ? Math.round(totalNilai / totalPermainan) : 0;
    var kelulusanPersen = totalPermainan > 0 ? Math.round((lulusCount / totalPermainan) * 100) : 0;

    return {
      success: true,
      totalSiswa: totalSiswa,
      totalSesiGame: totalPermainan,
      rataRataSkor: rataRata,
      tingkatKelulusanKKM: kelulusanPersen + "%"
    };
  } catch (e) {
    return { success: false, message: e.toString() };
  }
}

/**
 * Menghitung ulang Papan Peringkat berdasarkan data murid.
 */
function recalculateLeaderboard() {
  var ss = getGameSpreadsheet();
  var sheetPengguna = ss.getSheetByName(SHEET_NAMES.PENGGUNA);
  var sheetLeader = ss.getSheetByName(SHEET_NAMES.LEADERBOARD);

  if (!sheetPengguna || !sheetLeader) return;

  var data = sheetPengguna.getDataRange().getValues();
  if (data.length <= 1) return;

  var students = [];
  for (var i = 1; i < data.length; i++) {
    // Hanya murid yang masuk leaderboard
    if (String(data[i][1]).toLowerCase() === "murid") {
      students.push({
        name: data[i][3],
        school: data[i][5],
        grade: data[i][4],
        stars: Number(data[i][8] || 0),
        totalScore: Number(data[i][9] || 0)
      });
    }
  }

  students.sort(function(a, b) {
    if (b.stars !== a.stars) return b.stars - a.stars;
    return b.totalScore - a.totalScore;
  });

  if (sheetLeader.getLastRow() > 1) {
    sheetLeader.getRange(2, 1, sheetLeader.getLastRow() - 1, 8).clearContent();
  }

  var badges = ["👑 Petani Legendaris", "🌟 Juara Panen Makmur", "🌾 Pendekar Subak", "🌱 Petani Teladan"];
  var rows = [];

  for (var j = 0; j < Math.min(students.length, 50); j++) {
    var rank = j + 1;
    var s = students[j];
    var badge = j < badges.length ? badges[j] : "🌱 Petani Cilik Unggul";
    var avatar = j === 0 ? "👑" : (j === 1 ? "🥈" : (j === 2 ? "🥉" : "🧑‍🌾"));

    rows.push([
      rank,
      s.name,
      s.school,
      s.grade,
      s.totalScore,
      s.stars,
      badge,
      avatar
    ]);
  }

  if (rows.length > 0) {
    sheetLeader.getRange(2, 1, rows.length, 8).setValues(rows);
    sheetLeader.getRange(2, 1, rows.length, 1).setHorizontalAlignment("center");
    sheetLeader.getRange(2, 5, rows.length, 2).setHorizontalAlignment("center");
  }
}

/**
 * Mengubah nama file Google Spreadsheet menjadi "Game IPAS Tani Cilik".
 */
function renameSpreadsheetToGameIPAS() {
  try {
    var ss = getGameSpreadsheet();
    if (ss) {
      ss.rename("Game IPAS Tani Cilik");
      SpreadsheetApp.getUi().alert(
        "🏷️ Nama Spreadsheet Diperbarui",
        "Nama file Google Spreadsheet telah berhasil diubah menjadi:\n\n'Game IPAS Tani Cilik'",
        SpreadsheetApp.getUi().ButtonSet.OK
      );
    }
  } catch (e) {
    SpreadsheetApp.getUi().alert(
      "Info",
      "Tidak dapat mengubah nama secara otomatis: " + e.message + "\n\nAnda dapat mengganti nama langsung dengan mengklik judul di pojok kiri atas Google Sheets.",
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

/**
 * Menyiapkan struktur sheet otomatis lengkap dengan format warna dan akun percontohan.
 */
function setupSheetsStructure() {
  var ss = getGameSpreadsheet();
  if (!ss) {
    throw new Error("Gagal menemukan atau membuat file 'Game IPAS Tani Cilik'. Pastikan Anda mengizinkan akses Google Drive saat diminta izin.");
  }

  try {
    ss.rename("Game IPAS Tani Cilik");
  } catch (e) {}

  // 1. Sheet: Skor_Game
  var sheetSkor = ss.getSheetByName(SHEET_NAMES.SKOR);
  if (!sheetSkor) sheetSkor = ss.insertSheet(SHEET_NAMES.SKOR);

  var headersSkor = [
    "ID Sesi", "Timestamp (WIB)", "Nama Siswa", "Email Belajar.id", "NIS",
    "Sekolah", "Kelas", "No. Level", "Judul Misi IPAS", "Skor", "KKM",
    "Bintang", "Koin Diperoleh", "Akurasi", "Status Kelulusan", "Lencana Baru"
  ];
  sheetSkor.getRange(1, 1, 1, headersSkor.length).setValues([headersSkor]);
  formatHeaderRow(sheetSkor, headersSkor.length, "#1B5E20");
  sheetSkor.setFrozenRows(1);

  // 2. Sheet: Data_Pengguna (Role Guru & Murid)
  var sheetPengguna = ss.getSheetByName(SHEET_NAMES.PENGGUNA);
  if (!sheetPengguna) sheetPengguna = ss.insertSheet(SHEET_NAMES.PENGGUNA);

  var headersPengguna = [
    "ID User", "Role (Guru/Murid)", "NIS / NIP", "Nama Lengkap", "Kelas",
    "Asal Sekolah", "PIN / Password", "Total Koin", "Total Bintang", "Total Akumulasi Skor", "Gaya Caping", "Terakhir Login"
  ];
  sheetPengguna.getRange(1, 1, 1, headersPengguna.length).setValues([headersPengguna]);
  formatHeaderRow(sheetPengguna, headersPengguna.length, "#004D40");
  sheetPengguna.setFrozenRows(1);

  // 3. Sheet: Leaderboard
  var sheetLeader = ss.getSheetByName(SHEET_NAMES.LEADERBOARD);
  if (!sheetLeader) sheetLeader = ss.insertSheet(SHEET_NAMES.LEADERBOARD);

  var headersLeader = [
    "Peringkat", "Nama Siswa", "Sekolah", "Kelas", "Total Skor", "Bintang", "Gelar / Lencana", "Ikon"
  ];
  sheetLeader.getRange(1, 1, 1, headersLeader.length).setValues([headersLeader]);
  formatHeaderRow(sheetLeader, headersLeader.length, "#E65100");
  sheetLeader.setFrozenRows(1);

  // 4. Sheet: Materi_IPAS
  var sheetMateri = ss.getSheetByName(SHEET_NAMES.MATERI);
  if (!sheetMateri) sheetMateri = ss.insertSheet(SHEET_NAMES.MATERI);

  var headersMateri = ["Misi / Level", "Fase Kurikulum", "Topik IPAS", "Fakta Kunci & Konsep Sains", "Aplikasi Nyata"];
  sheetMateri.getRange(1, 1, 1, headersMateri.length).setValues([headersMateri]);
  formatHeaderRow(sheetMateri, headersMateri.length, "#0D47A1");
  sheetMateri.setFrozenRows(1);

  if (sheetMateri.getLastRow() === 1) {
    sheetMateri.appendRow(["Level 1", "Fase B (Kelas 4)", "Organ Tumbuhan & Bibit Unggul", "Akar menyerap hara; Daun berfotosintesis; Batang xilem & floem.", "Memilih gabah padi bernas di pekarangan."]);
    sheetMateri.appendRow(["Level 2", "Fase B & C (Kelas 4-5)", "Kebutuhan Tumbuhan & Tanah Sehat", "CO2 + Air + Cahaya ➔ Glukosa + O2. Cacing menggemburkan tanah.", "Membuat pupuk kompos dedaunan kering."]);
    sheetMateri.appendRow(["Level 3", "Fase C (Kelas 5)", "Hama & Serangga Sahabat Petani", "Kepik memangsa kutu; Lebah menyerbuki; Wereng merusak batang.", "Pengendalian hama terpadu tanpa racun kimia."]);
    sheetMateri.appendRow(["Level 4", "Fase B & C (Kelas 4-6)", "Panen Raya & Literasi Finansial", "Memetik hasil matang; Menghitung keuntungan bersih pasar tani.", "Ketahanan pangan mandiri nusantara."]);
    sheetMateri.appendRow(["Level 5", "Fase C (Kelas 5-6)", "Irigasi Subak & Rantai Makanan Sawah", "Subak adalah warisan dunia UNESCO. Keseimbangan rantai makanan.", "Gotong royong pembagian air terasering adil."]);
  }

  // 5. Sheet: Pengaturan
  var sheetPengaturan = ss.getSheetByName(SHEET_NAMES.PENGATURAN);
  if (!sheetPengaturan) sheetPengaturan = ss.insertSheet(SHEET_NAMES.PENGATURAN);

  var headersPengaturan = ["Kunci Konfigurasi", "Nilai", "Keterangan"];
  sheetPengaturan.getRange(1, 1, 1, headersPengaturan.length).setValues([headersPengaturan]);
  formatHeaderRow(sheetPengaturan, headersPengaturan.length, "#37474F");
  sheetPengaturan.setFrozenRows(1);

  if (sheetPengaturan.getLastRow() === 1) {
    sheetPengaturan.appendRow(["KKM_STANDAR", "60", "Nilai KKM kelulusan level permainan"]);
    sheetPengaturan.appendRow(["NAMA_SEKOLAH_DEFAULT", "SDN 01 Percontohan", "Nama sekolah untuk data baru"]);
    sheetPengaturan.appendRow(["PIN_DEFAULT_GURU", "guru123", "PIN masuk akun guru standar"]);
    sheetPengaturan.appendRow(["TAHUN_AJARAN", "2026/2027", "Tahun ajaran berjalan"]);
  }

  // Seed Data Akun Guru dan Murid jika masih kosong
  seedUsersIfEmpty(sheetPengguna, sheetSkor);
  recalculateLeaderboard();

  // Hapus Sheet1 bawaan kosong jika ada
  try {
    var sheet1 = ss.getSheetByName("Sheet1");
    if (sheet1 && ss.getSheets().length > 1) {
      ss.deleteSheet(sheet1);
    }
  } catch (e) {}

  Logger.log("🎉 SELESAI! Struktur 5 sheet berhasil disiapkan di:\n" + ss.getUrl());
}

/**
 * Format baris header.
 */
function formatHeaderRow(sheet, colCount, hexColor) {
  var headerRange = sheet.getRange(1, 1, 1, colCount);
  headerRange
    .setBackground(hexColor)
    .setFontColor("#FFFFFF")
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 35);
}

/**
 * Mengisi data awal percontohan untuk Akun Guru & Murid.
 */
function seedUsersIfEmpty(sheetPengguna, sheetSkor) {
  if (sheetPengguna.getLastRow() <= 1) {
    var now = Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss");

    // 1. Akun Guru Utama
    sheetPengguna.appendRow([
      "GURU-01",
      "Guru",
      "GURU123",
      "Ibu Pertiwi, S.Pd.",
      "Guru IPAS SD",
      "SDN 01 Percontohan",
      "guru123",
      999,
      15,
      3500,
      "caping_emas",
      now
    ]);

    // 2. Akun Murid-murid percontohan
    var muridList = [
      { id: "SISWA-01", nis: "1001", name: "Budi Santoso", grade: "Kelas 4A", coins: 250, stars: 7, score: 780 },
      { id: "SISWA-02", nis: "1002", name: "Siti Nurhaliza", grade: "Kelas 4A", coins: 400, stars: 12, score: 1450 },
      { id: "SISWA-03", nis: "1003", name: "Ahmad Rizki", grade: "Kelas 5B", coins: 320, stars: 9, score: 1020 },
      { id: "SISWA-04", nis: "1004", name: "Dewi Ayu", grade: "Kelas 4A", coins: 180, stars: 5, score: 620 }
    ];

    for (var i = 0; i < muridList.length; i++) {
      var m = muridList[i];
      sheetPengguna.appendRow([
        m.id,
        "Murid",
        m.nis,
        m.name,
        m.grade,
        "SDN 01 Percontohan",
        "1234",
        m.coins,
        m.stars,
        m.score,
        "caping_bambu",
        now
      ]);

      // Seed skor nilai
      if (sheetSkor && sheetSkor.getLastRow() <= 1) {
        sheetSkor.appendRow([
          "REC-SEED-" + (i + 1),
          now,
          m.name,
          m.name.toLowerCase().replace(/ /g, ".") + "@belajar.id",
          m.nis,
          "SDN 01 Percontohan",
          m.grade,
          1,
          "Kenali Organ & Bibit",
          m.score > 300 ? 320 : m.score,
          60,
          3,
          45,
          "95%",
          "Lulus KKM",
          "Sahabat Bibit Hijau"
        ]);
      }
    }
  }
}

/**
 * Membuat dasbor analitik grafik.
 */
function generateAnalyticsDashboard() {
  var ss = getGameSpreadsheet();
  var sheetName = "Grafik_Analitik";
  var sheet = ss.getSheetByName(sheetName);
  if (sheet) ss.deleteSheet(sheet);
  sheet = ss.insertSheet(sheetName);

  sheet.getRange("A1").setValue("🌾 DASBOR ANALITIK CAPAIAN BELAJAR IPAS (GURU)").setFontSize(14).setFontWeight("bold");
  sheet.getRange("A2").setValue("Data otomatis tersinkron dari Petualangan Tani Cilik").setFontColor("#555555");

  var stats = apiGetStatsSummary();
  sheet.getRange("A4:B7").setValues([
    ["Metrik Evaluasi", "Nilai Real-Time"],
    ["Total Murid Terdaftar", stats.totalSiswa || 0],
    ["Total Sesi Permainan Selesai", stats.totalSesiGame || 0],
    ["Tingkat Kelulusan KKM", stats.tingkatKelulusanKKM || "0%"]
  ]);

  sheet.getRange("A4:B4").setBackground("#2E7D32").setFontColor("#FFFFFF").setFontWeight("bold");
  sheet.getRange("A4:B7").setBorder(true, true, true, true, true, true);

  var sheetSkor = ss.getSheetByName(SHEET_NAMES.SKOR);
  if (sheetSkor && sheetSkor.getLastRow() > 1) {
    var chart = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sheetSkor.getRange("C1:C" + sheetSkor.getLastRow()))
      .addRange(sheetSkor.getRange("J1:J" + sheetSkor.getLastRow()))
      .setPosition(9, 1, 0, 0)
      .setOption("title", "Distribusi Skor Siswa per Misi Permainan")
      .setOption("hAxis", { title: "Nama Siswa" })
      .setOption("vAxis", { title: "Skor Akhir" })
      .setOption("colors", ["#2E7D32"])
      .build();

    sheet.insertChart(chart);
  }

  SpreadsheetApp.getUi().alert("✅ Lembar 'Grafik_Analitik' berhasil dibuat beserta grafik capaian siswa!");
}
