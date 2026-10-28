import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { GamesDirectory } from './components/GamesDirectory';
import { GameDetail } from './components/GameDetail';
import { ProbabilityLab } from './components/ProbabilityLab';
import type { UserStats, DailyChallenge } from './types';
import { loadUserStats, loadDailyChallenges, saveUserStats } from './utils/storage';
import { soundManager } from './utils/sound';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedGameId, setSelectedGameId] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stats, setStats] = useState<UserStats>(loadUserStats());
  const [challenges, setChallenges] = useState<DailyChallenge[]>(loadDailyChallenges());

  useEffect(() => {
    soundManager.setEnabled(stats.soundEnabled);
  }, [stats.soundEnabled]);

  const handleStatsUpdate = (newStats: UserStats) => {
    setStats(newStats);
    setChallenges(loadDailyChallenges());
  };

  const toggleSound = () => {
    const updated = { ...stats, soundEnabled: !stats.soundEnabled };
    setStats(updated);
    saveUserStats(updated);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'probability-lab':
        return <ProbabilityLab />;
      case 'home':
        return (
          <HomeDashboard
            setActiveTab={setActiveTab}
            setSelectedGameId={setSelectedGameId}
            stats={stats}
            challenges={challenges}
          />
        );
      case 'games':
        return (
          <GamesDirectory
            setActiveTab={setActiveTab}
            setSelectedGameId={setSelectedGameId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        );
      case 'game-detail':
        return (
          <GameDetail
            gameId={selectedGameId}
            setActiveTab={setActiveTab}
            onStatsUpdate={handleStatsUpdate}
            stats={stats}
          />
        );
      case 'lab':
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <h1 className="text-4xl font-black text-white">Probability Lab</h1>
            <p className="text-gray-400 max-w-md">Detailed simulations and analytical tools for large scale trials are active in mini-games and expanding.</p>
            <button onClick={() => setActiveTab('home')} className="px-6 py-2 bg-purple-600 rounded-xl text-white font-bold">Return Home</button>
          </div>
        );
      case 'stats':
        return (
          <div className="space-y-8">
             <h1 className="text-4xl font-black text-white">Your Career Stats</h1>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                   <span className="text-5xl font-black text-purple-400">{stats.gamesPlayed}</span>
                   <p className="text-gray-400 mt-2 font-bold uppercase tracking-widest text-xs">Total Games</p>
                </div>
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                   <span className="text-5xl font-black text-cyan-400">{stats.totalWins}</span>
                   <p className="text-gray-400 mt-2 font-bold uppercase tracking-widest text-xs">Total Wins</p>
                </div>
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
                   <span className="text-5xl font-black text-orange-400">{stats.bestStreak}</span>
                   <p className="text-gray-400 mt-2 font-bold uppercase tracking-widest text-xs">Best Streak</p>
                </div>
             </div>
          </div>
        );
      default:
        return <HomeDashboard setActiveTab={setActiveTab} setSelectedGameId={setSelectedGameId} stats={stats} challenges={challenges} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-gray-100 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      <Navbar
        activeTab={activeTab === 'game-detail' ? 'games' : activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onToggleSound={toggleSound}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {renderContent()}
      </main>

      <footer className="border-t border-white/5 bg-[#0a0a0f] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-xl font-black text-white">Chance<span className="text-purple-500">Lab</span></span>
            <p className="text-xs text-gray-500">Premium gaming hub for probability & luck exploration.</p>
          </div>
          <div className="flex gap-8 text-sm font-medium text-gray-400">
            <button onClick={() => setActiveTab('home')} className="hover:text-purple-400 transition-colors">Dashboard</button>
            <button onClick={() => setActiveTab('games')} className="hover:text-purple-400 transition-colors">Games</button>
            <button onClick={() => setActiveTab('probability-lab')} className="hover:text-purple-400 transition-colors">Probability Lab</button>
            <button onClick={() => setActiveTab('stats')} className="hover:text-purple-400 transition-colors">Stats</button>
          </div>
          <div className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
            &copy; 2026 CHANCELAB STUDIOS. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
