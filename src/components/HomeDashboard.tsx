import React from 'react';
import { Sparkles, Gamepad2, Sliders, ArrowRight, Play, Trophy, Flame, CheckCircle2 } from './icons';
import type { GameInfo, UserStats, DailyChallenge } from '../types';
import { GAMES } from '../data/gamesData';
import { GameIcon } from './icons';

interface HomeDashboardProps {
  setActiveTab: (tab: string) => void;
  setSelectedGameId: (id: any) => void;
  stats: UserStats;
  challenges: DailyChallenge[];
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  setActiveTab,
  setSelectedGameId,
  stats,
  challenges
}) => {
  const featuredGames = GAMES.slice(0, 3);
  const recentGames = stats.gameHistory.slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/80 via-indigo-950/60 to-[#0a0a0f] border border-purple-500/30 p-8 sm:p-12 shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Interactive Probability & Luck Hub</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Explore the Mathematics of <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Chance</span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Dive into immersive interactive mini-games, run live probability simulations, and discover how laws of large numbers govern randomness. No real-money gambling — pure entertainment and learning.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                setSelectedGameId('coin-flip');
                setActiveTab('game-detail');
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-600/40 hover:shadow-purple-600/60 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Play className="w-5 h-5 fill-white" />
              Play Quantum Coin Flip
            </button>
            <button
              onClick={() => setActiveTab('lab')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
            >
              <Sliders className="w-5 h-5 text-cyan-400" />
              Probability Lab
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">Games Played</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Gamepad2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">{stats.gamesPlayed}</span>
            <span className="text-xs text-gray-400 ml-2">total sessions</span>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">Win Rate</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">
              {stats.gamesPlayed > 0 ? Math.round((stats.totalWins / stats.gamesPlayed) * 100) : 0}%
            </span>
            <span className="text-xs text-gray-400 ml-2">({stats.totalWins} wins)</span>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">Current Streak</span>
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">{stats.currentStreak}</span>
            <span className="text-xs text-orange-400 ml-2">in a row</span>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 relative overflow-hidden group hover:border-purple-500/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-400">Best Streak</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-white">{stats.bestStreak}</span>
            <span className="text-xs text-cyan-400 ml-2">personal record</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Featured Probability Games</h2>
            <p className="text-sm text-gray-400">Hand-picked interactive experiences with real math models</p>
          </div>
          <button
            onClick={() => setActiveTab('games')}
            className="flex items-center gap-1.5 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            View All Games <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredGames.map((game: GameInfo) => (
            <div
              key={game.id}
              onClick={() => {
                setSelectedGameId(game.id);
                setActiveTab('game-detail');
              }}
              className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-purple-500/50 rounded-3xl p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
                {game.difficulty}
              </div>

              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                  <GameIcon name={game.iconName} className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-xs text-purple-400 font-medium mt-1">{game.subtitle}</p>
                </div>

                <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg">
                  {game.category.toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Play Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" /> Daily Probability Quests
              </h2>
              <p className="text-sm text-gray-400">Complete challenges to level up your statistical mastery</p>
            </div>
            <span className="text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-3 py-1 rounded-full font-medium">
              Resets Daily
            </span>
          </div>

          <div className="space-y-4">
            {challenges.map((ch: DailyChallenge) => {
              const percent = Math.min(100, Math.round((ch.currentProgress / ch.targetCount) * 100));
              return (
                <div
                  key={ch.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white">{ch.title}</h4>
                      {ch.completed && (
                        <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-300">{ch.description}</p>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-xs font-semibold text-purple-300">
                      {ch.currentProgress} / {ch.targetCount}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedGameId(ch.targetGame);
                        setActiveTab('game-detail');
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-200 hover:bg-purple-600/40 text-xs font-semibold transition-colors"
                    >
                      Play
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            {recentGames.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No games played yet. Jump into an interactive mini-game above!
              </div>
            ) : (
              <div className="space-y-3">
                {recentGames.map((item: any, idx: number) => {
                  const gameObj = GAMES.find((g) => g.id === item.gameId);
                  return (
                    <div
                      key={idx}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.win ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        <div>
                          <h4 className="text-sm font-semibold text-white">{gameObj?.title || item.gameId}</h4>
                          <span className="text-[10px] text-gray-400">
                            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${item.win ? 'text-emerald-300 bg-emerald-500/10' : 'text-red-300 bg-red-500/10'}`}>
                        {item.result}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border border-purple-500/30 rounded-2xl p-5 space-y-2 mt-6">
            <h4 className="text-sm font-bold text-cyan-300">Probability Insight of the Day</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              "The Law of Large Numbers states that as a sample size grows, its mean gets closer to the average of the whole population."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
