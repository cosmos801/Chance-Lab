import React, { useState } from 'react';
import {
  Home,
  Gamepad2,
  Sliders,
  BarChart3,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  Flame,
  Search
} from './icons';
import type { UserStats } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: UserStats;
  onToggleSound: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  onToggleSound,
  searchQuery,
  setSearchQuery
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'games', label: 'Mini-Games', icon: Gamepad2 },
    { id: 'probability-lab', label: 'Probability Lab', icon: Sliders },
    { id: 'stats', label: 'Statistics', icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300">
            <div className="w-full h-full bg-[#0a0a0f] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-cyan-400 bg-clip-text text-transparent">
              Chance<span className="text-purple-500">Lab</span>
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-purple-400 font-semibold">
              Probability & Luck Hub
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id === 'lab' ? 'probability-lab' : item.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300' : 'text-gray-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'games') setActiveTab('games');
              }}
              className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors w-48 focus:w-64"
            />
          </div>

          <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
            <span className="text-xs font-bold text-purple-200">
              {stats.currentStreak} Streak
            </span>
          </div>

          <button
            onClick={onToggleSound}
            aria-label={stats.soundEnabled ? "Disable sound effects" : "Enable sound effects"}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            {stats.soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={onToggleSound}
            aria-label={stats.soundEnabled ? "Disable sound effects" : "Enable sound effects"}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300"
          >
            {stats.soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0f] border-b border-purple-500/20 px-4 pt-2 pb-6 space-y-3">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveTab('games');
              }}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-gray-400"
            />
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id === 'lab' ? 'probability-lab' : item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
          <div className="flex items-center justify-between px-4 py-3 bg-purple-950/30 rounded-xl border border-purple-500/20">
            <span className="text-sm text-purple-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" /> Current Streak
            </span>
            <span className="font-bold text-white">{stats.currentStreak} wins</span>
          </div>
        </div>
      )}
    </header>
  );
};
