import React, { useState } from 'react';
import type { GameCategory } from '../types';
import { GAMES } from '../data/gamesData';
import { GameIcon, Search, ArrowRight } from './icons';

interface GamesDirectoryProps {
  setSelectedGameId: (id: any) => void;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const GamesDirectory: React.FC<GamesDirectoryProps> = ({
  setSelectedGameId,
  setActiveTab,
  searchQuery,
  setSearchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');

  const categories: { id: GameCategory; label: string }[] = [
    { id: 'all', label: 'All Games' },
    { id: 'probability', label: 'Probability' },
    { id: 'luck', label: 'Luck & Fortune' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'reflex', label: 'Reflex & Latency' }
  ];

  const filteredGames = GAMES.filter((game) => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.mathConcept.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-purple-500/20 pb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interactive Mini-Games
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Choose a game to experiment with live visual simulations and real statistical models.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or math concept..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/10 rounded-3xl">
          <p className="text-gray-400 text-base">No games matched your query "{searchQuery}".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              onClick={() => {
                setSelectedGameId(game.id);
                setActiveTab('game-detail');
              }}
              className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-purple-500/50 rounded-3xl p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                    <GameIcon name={game.iconName} className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
                    {game.difficulty}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-xs text-purple-400 font-medium mt-1">{game.subtitle}</p>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {game.description}
                </p>

                <div className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-3">
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">Math Concept</span>
                  <p className="text-xs text-gray-200 mt-0.5">{game.mathConcept}</p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-lg">
                  {game.category.toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Game <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
