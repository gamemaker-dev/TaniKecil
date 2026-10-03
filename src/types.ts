export interface UserProfile {
  id: string;
  name: string;
  email: string;
  nisn: string;
  school: string;
  grade: string;
  coins: number;
  stars: number;
  totalScore: number;
  capingStyle: string;
  avatarSeed: string;
}

export interface GameScoreRecord {
  id: string;
  timestamp: string;
  studentName: string;
  studentEmail: string;
  userName?: string;
  userEmail?: string;
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
  accuracy?: number;
  status: 'Lulus KKM' | 'Coba Lagi';
  badgeUnlocked?: string;
  syncStatus: 'Tersimpan di Google Sheets' | 'Tersimpan Lokal' | 'Sinkronisasi...';
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
