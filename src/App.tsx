import React, { useState, useEffect } from 'react';
import { UserProfile, GameScoreRecord } from './types';
import { sheetsDB } from './services/googleSheetsService';
import { sound } from './utils/audio';

import { Navbar } from './components/Navbar';
import { SplashScreen } from './components/SplashScreen';
import { MapScreen, LEVELS } from './components/MapScreen';
import { Level1Game } from './components/Level1Game';
import { Level2Game } from './components/Level2Game';
import { Level3Game } from './components/Level3Game';
import { Level4Game } from './components/Level4Game';
import { Level5Game } from './components/Level5Game';
import { ResultModal } from './components/ResultModal';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { StudyMaterialModal } from './components/StudyMaterialModal';
import { ShopScreen } from './components/ShopScreen';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { StudentReportModal } from './components/StudentReportModal';
import { TeacherGradebookScreen } from './components/TeacherGradebookScreen';

const STORAGE_KEY_USER = 'tani_cilik_user_profile';
const STORAGE_KEY_PROGRESS = 'tani_cilik_level_scores';

const DEFAULT_USER: UserProfile = {
  id: 'SISWA-01',
  role: 'Murid',
  nis: '1001',
  name: 'Budi Santoso',
  email: 'budi.santoso@guru.sd.belajar.id',
  nisn: '0129482910',
  school: 'SDN Nusantara 01 Pagi',
  grade: 'Kelas 4A',
  coins: 180,
  stars: 4,
  totalScore: 780,
  capingStyle: 'caping_bambu',
  avatarSeed: 'budi_farmer',
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return DEFAULT_USER;
  });

  const [levelScores, setLevelScores] = useState<Record<number, { stars: number; highScore: number }>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return {
      1: { stars: 3, highScore: 420 },
      2: { stars: 1, highScore: 360 },
      3: { stars: 0, highScore: 0 },
      4: { stars: 0, highScore: 0 },
      5: { stars: 0, highScore: 0 },
    };
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentScreen, setCurrentScreen] = useState<string>('splash');
  const [isGoogleSheetsOpen, setIsGoogleSheetsOpen] = useState(false);
  const [isStudyMaterialOpen, setIsStudyMaterialOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Result dialog state
  const [resultData, setResultData] = useState<{
    isOpen: boolean;
    levelId: number;
    levelTitle: string;
    score: number;
    stars: number;
    coinsEarned: number;
    accuracy: number;
    badgeName?: string;
    syncResult: { success: boolean; message: string; record?: GameScoreRecord };
  }>({
    isOpen: false,
    levelId: 1,
    levelTitle: '',
    score: 0,
    stars: 0,
    coinsEarned: 0,
    accuracy: 100,
    syncResult: { success: true, message: '' },
  });

  // Save user profile whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  // Save level progress whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(levelScores));
  }, [levelScores]);

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setCurrentScreen('map');
  };

  const handleSelectLevel = (levelId: number) => {
    setCurrentScreen(`level-${levelId}`);
  };

  // Called when any level completes
  const handleLevelComplete = async (
    levelId: number,
    score: number,
    stars: number,
    coinsEarned: number,
    accuracy: number
  ) => {
    const levelInfo = LEVELS.find((l) => l.id === levelId);
    const title = levelInfo?.title || `Level ${levelId}`;

    // Update level scores
    const existing = levelScores[levelId] || { stars: 0, highScore: 0 };
    const newStars = Math.max(existing.stars, stars);
    const newHighScore = Math.max(existing.highScore, score);

    setLevelScores((prev) => ({
      ...prev,
      [levelId]: { stars: newStars, highScore: newHighScore },
    }));

    // Update user profile coins & stars
    const updatedCoins = currentUser.coins + coinsEarned;
    const allStars = Object.values({
      ...levelScores,
      [levelId]: { stars: newStars, highScore: newHighScore },
    }).reduce((acc, curr) => acc + curr.stars, 0);

    const updatedUser: UserProfile = {
      ...currentUser,
      coins: updatedCoins,
      stars: allStars,
      totalScore: currentUser.totalScore + score,
    };
    setCurrentUser(updatedUser);

    // AUTOMATIC SYNC TO GOOGLE APPS SCRIPT & GOOGLE SHEETS
    const syncRes = await sheetsDB.recordGameScore({
      userName: currentUser.name,
      userEmail: currentUser.email || '',
      nis: currentUser.nis || '1001',
      school: currentUser.school,
      grade: currentUser.grade,
      levelId,
      levelTitle: title,
      score,
      stars,
      coinsEarned,
      accuracy,
      badgeEarned: stars === 3 ? levelInfo?.badgeAwarded : undefined,
    });

    // Show result celebration modal
    setResultData({
      isOpen: true,
      levelId,
      levelTitle: title,
      score,
      stars,
      coinsEarned,
      accuracy,
      badgeName: stars === 3 ? levelInfo?.badgeAwarded : undefined,
      syncResult: syncRes,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY_USER);
    setIsLoggedIn(false);
    setCurrentScreen('splash');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F2] flex flex-col font-sans">
      {/* Top App Navbar */}
      <Navbar
        currentUser={currentUser}
        currentScreen={currentScreen}
        isLoggedIn={isLoggedIn}
        onNavigate={(screen) => {
          if (!isLoggedIn) {
            setCurrentScreen('splash');
            return;
          }
          sound.playClick();
          setCurrentScreen(screen);
        }}
        onOpenGoogleSheets={() => {
          sound.playClick();
          setIsGoogleSheetsOpen(true);
        }}
        onOpenTeacherGradebook={() => {
          sound.playClick();
          setCurrentScreen('teacher-gradebook');
        }}
        onOpenStudyMaterial={() => {
          sound.playClick();
          setIsStudyMaterialOpen(true);
        }}
        onOpenShop={() => {
          sound.playClick();
          setCurrentScreen('shop');
        }}
        onLogout={handleLogout}
      />

      {/* Screen Router */}
      <main className="flex-1">
        {currentScreen === 'splash' && (
          <SplashScreen onLogin={handleLogin} currentUser={currentUser} />
        )}

        {currentScreen === 'map' && (
          <MapScreen
            currentUser={currentUser}
            onSelectLevel={handleSelectLevel}
            onOpenLeaderboard={() => {
              sound.playClick();
              setCurrentScreen('leaderboard');
            }}
            onOpenStudyMaterial={() => {
              sound.playClick();
              setIsStudyMaterialOpen(true);
            }}
            onOpenShop={() => {
              sound.playClick();
              setCurrentScreen('shop');
            }}
            onOpenGoogleSheets={() => {
              sound.playClick();
              setIsGoogleSheetsOpen(true);
            }}
            onOpenReport={() => {
              sound.playClick();
              setIsReportOpen(true);
            }}
            levelScores={levelScores}
          />
        )}

        {currentScreen === 'level-1' && (
          <Level1Game
            onComplete={(score, stars, coins, acc) =>
              handleLevelComplete(1, score, stars, coins, acc)
            }
            onExit={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'level-2' && (
          <Level2Game
            onComplete={(score, stars, coins, acc) =>
              handleLevelComplete(2, score, stars, coins, acc)
            }
            onExit={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'level-3' && (
          <Level3Game
            onComplete={(score, stars, coins, acc) =>
              handleLevelComplete(3, score, stars, coins, acc)
            }
            onExit={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'level-4' && (
          <Level4Game
            onComplete={(score, stars, coins, acc) =>
              handleLevelComplete(4, score, stars, coins, acc)
            }
            onExit={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'level-5' && (
          <Level5Game
            onComplete={(score, stars, coins, acc) =>
              handleLevelComplete(5, score, stars, coins, acc)
            }
            onExit={() => setCurrentScreen('map')}
          />
        )}

        {currentScreen === 'leaderboard' && (
          <LeaderboardScreen
            currentUser={currentUser}
            onBack={() => setCurrentScreen('map')}
            onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
          />
        )}

        {currentScreen === 'teacher-gradebook' && (
          <TeacherGradebookScreen
            currentUser={currentUser}
            onBack={() => setCurrentScreen('map')}
            onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
          />
        )}

        {currentScreen === 'shop' && (
          <ShopScreen
            currentUser={currentUser}
            onUpdateUser={setCurrentUser}
            onBack={() => setCurrentScreen('map')}
          />
        )}
      </main>

      {/* Level Completion Result Modal with Auto Google Sheets Sync */}
      {resultData.isOpen && (
        <ResultModal
          score={resultData.score}
          stars={resultData.stars}
          coinsEarned={resultData.coinsEarned}
          accuracy={resultData.accuracy}
          levelId={resultData.levelId}
          levelTitle={resultData.levelTitle}
          badgeName={resultData.badgeName}
          currentUser={currentUser}
          syncResult={resultData.syncResult}
          onRetry={() => {
            setResultData((prev) => ({ ...prev, isOpen: false }));
            setCurrentScreen(`level-${resultData.levelId}`);
          }}
          onContinue={() => {
            setResultData((prev) => ({ ...prev, isOpen: false }));
            setCurrentScreen('map');
          }}
          onOpenGoogleSheets={() => {
            setIsGoogleSheetsOpen(true);
          }}
        />
      )}

      {/* Google Sheets Database Viewer and Apps Script Manager Modal */}
      <GoogleSheetsModal
        isOpen={isGoogleSheetsOpen}
        onClose={() => setIsGoogleSheetsOpen(false)}
        currentUser={currentUser}
      />

      {/* Study Material Handbook Modal */}
      {isStudyMaterialOpen && (
        <StudyMaterialModal onClose={() => setIsStudyMaterialOpen(false)} />
      )}

      {/* Student Achievement Report & Certificate Modal */}
      {isReportOpen && (
        <StudentReportModal
          currentUser={currentUser}
          levelScores={levelScores}
          onClose={() => setIsReportOpen(false)}
        />
      )}
    </div>
  );
}
