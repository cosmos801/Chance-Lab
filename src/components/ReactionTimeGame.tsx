import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/sound';
import { recordGameResult } from '../utils/storage';
import type { UserStats } from '../types';
import { Zap, Activity, Award } from './icons';

interface ReactionTimeGameProps {
  onStatsUpdate: (stats: UserStats) => void;
}

type GameState = 'idle' | 'waiting' | 'ready' | 'result' | 'early';

export const ReactionTimeGame: React.FC<ReactionTimeGameProps> = ({ onStatsUpdate }) => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [rounds, setRounds] = useState<number[]>([]);
  const [waitTimer, setWaitTimer] = useState<any>(null);

  useEffect(() => {
    return () => {
      if (waitTimer) clearTimeout(waitTimer);
    };
  }, [waitTimer]);

  const startTest = () => {
    setGameState('waiting');
    setReactionTime(null);
    soundManager.playPop();

    const delay = Math.random() * 2000 + 1500; // 1.5s to 3.5s
    const timer = setTimeout(() => {
      setGameState('ready');
      setStartTime(performance.now());
    }, delay);

    setWaitTimer(timer);
  };

  const handleInteraction = () => {
    if (gameState === 'waiting') {
      if (waitTimer) clearTimeout(waitTimer);
      setGameState('early');
      soundManager.playPop();
    } else if (gameState === 'ready') {
      const endTime = performance.now();
      const time = Math.round(endTime - startTime);
      setReactionTime(time);
      setRounds((prev) => [...prev, time]);
      setGameState('result');

      const isFast = time < 250;
      if (isFast) soundManager.playWin();

      const updatedStats = recordGameResult('reaction-time', `${time}ms`, time, true);
      onStatsUpdate(updatedStats);
    } else if (gameState === 'idle' || gameState === 'result' || gameState === 'early') {
      startTest();
    }
  };

  const average = rounds.length > 0 ? Math.round(rounds.reduce((a, b) => a + b, 0) / rounds.length) : null;
  const best = rounds.length > 0 ? Math.min(...rounds) : null;

  const getPerformanceMessage = (time: number) => {
    if (time < 200) return { label: 'Elite Reflexes', color: 'text-cyan-400' };
    if (time < 250) return { label: 'Fast Speed', color: 'text-emerald-400' };
    if (time < 350) return { label: 'Average', color: 'text-gray-300' };
    return { label: 'Needs Practice', color: 'text-orange-400' };
  };

  return (
    <div className="space-y-8">
      {/* Test Area */}
      <div
        onClick={handleInteraction}
        className={`w-full min-h-[400px] rounded-3xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl relative overflow-hidden ${
          gameState === 'idle' ? 'bg-[#0d0d15] border-white/10 hover:border-purple-500/40' :
          gameState === 'waiting' ? 'bg-red-950/40 border-red-500/50' :
          gameState === 'ready' ? 'bg-cyan-900/60 border-cyan-400 shadow-cyan-500/20' :
          gameState === 'early' ? 'bg-orange-950/40 border-orange-500/50' :
          'bg-purple-950/40 border-purple-500/50'
        }`}
      >
        <div className="text-center space-y-6 relative z-10 px-6">
          {gameState === 'idle' && (
            <>
              <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto text-purple-400 animate-pulse">
                <Zap className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white">Reflex Arena</h3>
                <p className="text-gray-400 max-w-sm mx-auto font-medium">Click anywhere to start. Wait for the screen to turn <span className="text-cyan-400 font-bold">Electric Blue</span>, then click as fast as you can!</p>
              </div>
            </>
          )}

          {gameState === 'waiting' && (
            <div className="space-y-4">
              <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin mx-auto" />
              <h3 className="text-4xl font-black text-red-400 uppercase tracking-widest">Wait for it...</h3>
            </div>
          )}

          {gameState === 'ready' && (
             <div className="animate-in fade-in zoom-in duration-150">
               <h3 className="text-7xl font-black text-white uppercase tracking-tighter italic scale-110 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">CLICK!</h3>
             </div>
          )}

          {gameState === 'early' && (
            <div className="space-y-4">
              <h3 className="text-4xl font-black text-orange-400 italic">TOO EARLY!</h3>
              <p className="text-gray-300 font-bold">Click to try again.</p>
            </div>
          )}

          {gameState === 'result' && reactionTime && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
               <div className="space-y-1">
                 <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Your Reaction Time</span>
                 <h3 className="text-7xl font-black text-white tracking-tighter">{reactionTime}ms</h3>
               </div>
               <div className={`text-xl font-black uppercase tracking-widest ${getPerformanceMessage(reactionTime).color}`}>
                 {getPerformanceMessage(reactionTime).label}
               </div>
               <p className="text-gray-400 text-sm font-bold">Click anywhere to go again.</p>
            </div>
          )}
        </div>

        {/* Dynamic Background Glow */}
        <div className={`absolute inset-0 opacity-20 pointer-events-none transition-colors duration-500 ${
          gameState === 'ready' ? 'bg-cyan-400' : 'bg-transparent'
        }`} />
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Avg Response</span>
            <span className="text-2xl font-black text-white">{average ? `${average}ms` : '--'}</span>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Personal Best</span>
            <span className="text-2xl font-black text-white">{best ? `${best}ms` : '--'}</span>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Rounds Played</span>
            <span className="text-2xl font-black text-white">{rounds.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
