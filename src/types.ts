export type UserRole = 'Guru' | 'Murid';

export interface UserProfile {
  id: string;
  role: UserRole;
  name: string;
  nis: string; // NIS untuk Murid, NIP / Kode Guru untuk Guru
  email?: string;
  nisn?: string;
  school: string;
  grade: string;
  password?: string;
  coins: number;
  stars: number;
  totalScore: number;
  capingStyle: string;
  avatarSeed: string;
  lastLogin?: string;
}

export interface GameScoreRecord {
  id: string;
  timestamp: string;
  studentName: string;
  studentEmail?: string;
  userName?: string;
  userEmail?: string;
  nis?: string;
  nisn?: string;
  school: string;
  grade: string;
  levelNumber: number;
  levelId?: number;
  levelTitle: string;
  score: number;
  kkm: number;
  stars: number;
  coinsEarned: number;
  accuracy?: number | string;
  status: 'Lulus KKM' | 'Coba Lagi';
  badgeUnlocked?: string;
  syncStatus: 'Tersimpan di Google Sheets' | 'Tersimpan Lokal' | 'Sinkronisasi...';
}

export interface TeacherGradebookResponse {
  success: boolean;
  authorizedRole: string;
  totalSesiGame: number;
  totalSiswa: number;
  gradebook: GameScoreRecord[];
  students: {
    id: string;
    nis: string;
    name: string;
    grade: string;
    school: string;
    coins: number;
    stars: number;
    totalScore: number;
    lastActive?: string;
  }[];
  stats?: {
    totalSiswa: number;
    totalSesiGame: number;
    rataRataSkor: number;
    tingkatKelulusanKKM: string;
  };
  message?: string;
}

export interface LevelInfo {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  themeColor: string;
  unlocked: boolean;
  requiredStars: number;
  targetScore: number;
  badgeAwarded: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  dateUnlocked: string;
  isUnlocked: boolean;
  color: string;
  requirement: string;
  xpReward: number;
}

export interface LevelItem {
  id: number;
  title: string;
  description: string;
  starsEarned: number;
  highScore: number;
  isUnlocked: boolean;
  status: 'Aktif' | 'Tuntas' | 'Terkunci' | 'Baru';
  badgeName?: string;
  themeColor: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  badge: string;
  isCurrentUser?: boolean;
  changeToday?: string;
  modulesCompleted?: number;
}
