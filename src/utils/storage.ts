import confetti from 'canvas-confetti';
import type { UserStats, GameId } from '../types';
import { INITIAL_STATS, INITIAL_CHALLENGES } from '../data/gamesData';

const STATS_KEY = 'chancelab_user_stats_v1';
const CHALLENGES_KEY = 'chancelab_daily_challenges_v1';

export const loadUserStats = (): UserStats => {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (data) {
      return { ...INITIAL_STATS, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to load stats', e);
  }
  return INITIAL_STATS;
};

export const saveUserStats = (stats: UserStats) => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats', e);
  }
};

export const recordGameResult = (
  gameId: GameId,
  result: string,
  score: number,
  win: boolean
): UserStats => {
  const stats = loadUserStats();

  const newGamesPlayed = stats.gamesPlayed + 1;
  const newTotalWins = win ? stats.totalWins + 1 : stats.totalWins;
  const newCurrentStreak = win ? stats.currentStreak + 1 : 0;
  const newBestStreak = Math.max(stats.bestStreak, newCurrentStreak);

  const historyItem = {
    gameId,
    timestamp: Date.now(),
    result,
    score,
    win
  };

  const newHistory = [historyItem, ...stats.gameHistory].slice(0, 50);

  const newAchievements = [...stats.achievements];
  if (newGamesPlayed === 1 && !newAchievements.includes('first_game')) {
    newAchievements.push('first_game');
    triggerConfetti();
  }
  if (newBestStreak >= 3 && !newAchievements.includes('streak_3')) {
    newAchievements.push('streak_3');
    triggerConfetti();
  }
  if (newBestStreak >= 5 && !newAchievements.includes('streak_5')) {
    newAchievements.push('streak_5');
    triggerConfetti();
  }
  if (newGamesPlayed >= 10 && !newAchievements.includes('dedicated_player')) {
    newAchievements.push('dedicated_player');
    triggerConfetti();
  }

  const updated: UserStats = {
    ...stats,
    gamesPlayed: newGamesPlayed,
    totalWins: newTotalWins,
    currentStreak: newCurrentStreak,
    bestStreak: newBestStreak,
    achievements: newAchievements,
    gameHistory: newHistory
  };

  saveUserStats(updated);
  updateDailyChallengeProgress(gameId);
  return updated;
};

export const loadDailyChallenges = () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const data = localStorage.getItem(CHALLENGES_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.date === today && Array.isArray(parsed.challenges)) {
        return parsed.challenges;
      }
    }
  } catch (e) {
    console.error('Failed to load challenges', e);
  }
  saveDailyChallenges(INITIAL_CHALLENGES);
  return INITIAL_CHALLENGES;
};

export const saveDailyChallenges = (challenges: any[]) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify({ date: today, challenges }));
  } catch (e) {
    console.error('Failed to save challenges', e);
  }
};

export const updateDailyChallengeProgress = (gameId: GameId) => {
  const challenges = loadDailyChallenges();
  let updated = false;

  const newChallenges = challenges.map((ch: any) => {
    if (ch.targetGame === gameId && !ch.completed) {
      const newProg = Math.min(ch.targetCount, ch.currentProgress + 1);
      if (newProg >= ch.targetCount) {
        updated = true;
        triggerConfetti();
        return { ...ch, currentProgress: newProg, completed: true };
      }
      return { ...ch, currentProgress: newProg };
    }
    return ch;
  });

  if (updated || newChallenges.some((c: any, i: number) => c.currentProgress !== challenges[i].currentProgress)) {
    saveDailyChallenges(newChallenges);
  }
};

export const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981', '#f59e0b']
    });
  } catch {
    // Ignore
  }
};
