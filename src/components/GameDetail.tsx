import React from 'react';
import { GAMES } from '../data/gamesData';
import { CoinFlipGame } from './CoinFlipGame';
import { DiceRollerGame } from './DiceRollerGame';
import { ReactionTimeGame } from './ReactionTimeGame';
import type { UserStats } from '../types';
import { ArrowLeft, Play } from './icons';

interface GameDetailProps {
  gameId: any;
  setActiveTab: (tab: string) => void;
  onStatsUpdate: (stats: UserStats) => void;
  stats: UserStats;
}

export const GameDetail: React.FC<GameDetailProps> = ({ gameId, setActiveTab, onStatsUpdate, stats }) => {
  const game = GAMES.find((g) => g.id === gameId);

  if (!game) return <div className="text-white p-10 text-center">Game not found</div>;

  const renderGame = () => {
    switch (game.id) {
      case 'coin-flip': return <CoinFlipGame onStatsUpdate={onStatsUpdate} />;
      case 'dice-roller': return <DiceRollerGame onStatsUpdate={onStatsUpdate} />;
      case 'reaction-time': return <ReactionTimeGame onStatsUpdate={onStatsUpdate} />;
      default: return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-20 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
             <Play className="w-8 h-8 opacity-50" />
          </div>
          <p className="text-gray-400 text-lg">Detailed interface for <span className="text-white font-bold">{game.title}</span> is coming in the next update.</p>
          <button onClick={() => setActiveTab('games')} className="px-6 py-2 bg-purple-600 rounded-xl text-white font-bold">Try Another Game</button>
        </div>
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300 pb-20">
      <button
        onClick={() => setActiveTab('games')}
        className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </button>

      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-start gap-8 shadow-2xl">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center text-cyan-400 shrink-0">
          <Play className="w-10 h-10 fill-current" />
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
             <h1 className="text-4xl font-extrabold text-white leading-none">{game.title}</h1>
             <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-widest">{game.difficulty}</span>
          </div>
          <p className="text-purple-400 font-medium text-lg">{game.subtitle}</p>
          <p className="text-gray-300 leading-relaxed max-w-2xl">{game.description}</p>
        </div>
        <div className="flex flex-col gap-4 min-w-[140px]">
          <div className="text-center px-6 py-4 bg-purple-950/30 rounded-2xl border border-purple-500/20">
            <span className="block text-2xl font-black text-white">{stats.bestStreak}</span>
            <span className="text-[10px] uppercase font-bold text-purple-300">Personal Best</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 px-2">
           <span className="w-2 h-8 bg-purple-600 rounded-full" /> Interactive Arena
        </h2>
        {renderGame()}
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-8">
        <div>
           <h2 className="text-xl font-bold text-white mb-2">How to Play</h2>
           <p className="text-sm text-gray-400">Follow these steps to master the game and understand the underlying logic.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {game.instructions.map((ins: string, i: number) => (
            <div key={i} className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 border-l-purple-500 border-l-4">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-black shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-gray-300 leading-relaxed font-medium">{ins}</p>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5">
           <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">Σ</span> Mathematical Foundation
           </h3>
           <div className="p-6 bg-cyan-950/20 border border-cyan-500/30 rounded-2xl">
              <p className="text-sm text-cyan-100/80 leading-relaxed italic">
                 "{game.mathConcept}"
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
