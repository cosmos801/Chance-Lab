import type { GameInfo, UserStats, DailyChallenge } from '../types';

export const GAMES: GameInfo[] = [
  {
    id: 'coin-flip',
    title: 'Quantum Coin Flip',
    subtitle: 'Classic Bernoulli Trials & Law of Large Numbers',
    description: 'Test your luck with a fair coin or configure weighted probabilities to observe the Law of Large Numbers in action.',
    category: 'probability',
    difficulty: 'Easy',
    iconName: 'Coins',
    popularity: 95,
    mathConcept: 'Binomial Distribution & Expected Value E[X] = p',
    instructions: [
      'Choose Heads or Tails before flipping.',
      'Use "Auto Flip" to run batch trials (10, 50, 100 flips) and watch empirical probability converge to 50%.',
      'Experiment with the Bias slider to see how unfair odds skew the long-term results.'
    ]
  },
  {
    id: 'dice-roller',
    title: 'Cyber Dice Matrix',
    subtitle: 'Probability Distributions & Combinatorics',
    description: 'Roll single or multiple polyhedral dice. Analyze sum distributions and discover why certain totals appear much more frequently than others.',
    category: 'probability',
    difficulty: 'Medium',
    iconName: 'Dice5',
    popularity: 92,
    mathConcept: 'Discrete Probability Distributions & Combinatorial sums',
    instructions: [
      'Select 1, 2, or 3 dice to roll simultaneously.',
      'Examine the sum frequency distribution chart as you roll repeatedly.',
      'Notice how two dice create a symmetrical bell-like distribution centered around 7.'
    ]
  },
  {
    id: 'lucky-spinner',
    title: 'Neon Wheel of Fortune',
    subtitle: 'Discrete Uniform Distribution & Expected Return',
    description: 'Spin the customizable color & multiplier wheel. Test your fortune across sectors with different probabilities and reward weights.',
    category: 'luck',
    difficulty: 'Easy',
    iconName: 'Disc',
    popularity: 98,
    mathConcept: 'Uniform Probability & Weighted Expected Value',
    instructions: [
      'Click Spin to set the wheel in motion with physics-based easing.',
      'Land on multiplier sectors to build your score streak.',
      'Inspect sector odds in the info panel to calculate risk vs reward.'
    ]
  },
  {
    id: 'memory-match',
    title: 'Neural Matrix Memory',
    subtitle: 'Combinatorics, Permutations & Pattern Recognition',
    description: 'Test your cognitive recall and probability estimation. Flip glowing cards to match cybernetic symbols before time runs out.',
    category: 'strategy',
    difficulty: 'Medium',
    iconName: 'Brain',
    popularity: 88,
    mathConcept: 'Combinatorics & Hypergeometric Probability',
    instructions: [
      'Click any card to reveal its cyber symbol.',
      'Find matching pairs in the fewest moves possible.',
      'Difficulty levels adjust grid size and memory timing constraints.'
    ]
  },
  {
    id: 'reaction-time',
    title: 'Synapse Reflex Lab',
    subtitle: 'Statistical Variance, Reaction Times & Percentiles',
    description: 'Measure your neural latency in milliseconds when visual cues trigger. Analyze your average reflex speed and standard deviation.',
    category: 'reflex',
    difficulty: 'Hard',
    iconName: 'Zap',
    popularity: 90,
    mathConcept: 'Normal Distribution, Mean (mu), and Standard Deviation (sigma)',
    instructions: [
      'Click the waiting arena to start the test.',
      'Wait for the signal to turn Electric Blue, then click as fast as possible.',
      'Complete 5 rounds to generate your personalized reflex statistical profile.'
    ]
  }
];

export const INITIAL_STATS: UserStats = {
  gamesPlayed: 0,
  totalWins: 0,
  currentStreak: 0,
  bestStreak: 0,
  achievements: [],
  gameHistory: [],
  soundEnabled: true,
  reducedMotion: false
};

export const INITIAL_CHALLENGES: DailyChallenge[] = [
  {
    id: 'ch-1',
    title: 'Coin Master',
    description: 'Complete 15 flips in Quantum Coin Flip',
    targetGame: 'coin-flip',
    targetCount: 15,
    currentProgress: 0,
    rewardPoints: 100,
    completed: false,
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'ch-2',
    title: 'High Roller',
    description: 'Roll a total of 12 with two dice',
    targetGame: 'dice-roller',
    targetCount: 3,
    currentProgress: 0,
    rewardPoints: 150,
    completed: false,
    date: new Date().toISOString().split('T')[0]
  },
  {
    id: 'ch-3',
    title: 'Neon Spinner',
    description: 'Spin the Neon Wheel 5 times',
    targetGame: 'lucky-spinner',
    targetCount: 5,
    currentProgress: 0,
    rewardPoints: 120,
    completed: false,
    date: new Date().toISOString().split('T')[0]
  }
];
