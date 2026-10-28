export type GameId = 'coin-flip' | 'dice-roller' | 'lucky-spinner' | 'memory-match' | 'reaction-time';
export type GameCategory = 'all' | 'probability' | 'luck' | 'strategy' | 'reflex';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface GameInfo {
  id: GameId;
  title: string;
  subtitle: string;
  description: string;
  category: GameCategory;
  difficulty: Difficulty;
  iconName: string;
  popularity: number;
  mathConcept: string;
  instructions: string[];
}

export interface UserStats {
  gamesPlayed: number;
  totalWins: number;
  currentStreak: number;
  bestStreak: number;
  achievements: string[];
  gameHistory: {
    gameId: GameId;
    timestamp: number;
    result: string;
    score: number;
    win: boolean;
  }[];
  soundEnabled: boolean;
  reducedMotion: boolean;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  targetGame: GameId;
  targetCount: number;
  currentProgress: number;
  rewardPoints: number;
  completed: boolean;
  date: string;
}
