import React, { useState } from 'react';
import { RotateCcw } from './icons';
import { soundManager } from '../utils/sound';
import { recordGameResult } from '../utils/storage';
import type { UserStats } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface CoinFlipGameProps {
  onStatsUpdate: (stats: UserStats) => void;
}

export const CoinFlipGame: React.FC<CoinFlipGameProps> = ({ onStatsUpdate }) => {
  const [prediction, setPrediction] = useState<'heads' | 'tails'>('heads');
  const [bias, setBias] = useState<number>(0.5); // 0.5 = 50% chance of Heads
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [coinResult, setCoinResult] = useState<'heads' | 'tails' | null>(null);
  const [history, setHistory] = useState<{ id: number; result: 'heads' | 'tails' }[]>([]);
  const [totalFlips, setTotalFlips] = useState<number>(0);
  const [headsCount, setHeadsCount] = useState<number>(0);

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    soundManager.playPop();

    setTimeout(() => {
      const isHeads = Math.random() < bias;
      const result = isHeads ? 'heads' : 'tails';

      setCoinResult(result);
      setIsFlipping(false);
      setTotalFlips((prev) => prev + 1);
      if (isHeads) setHeadsCount((prev) => prev + 1);

      setHistory((prev) => [{ id: Date.now(), result }, ...prev]);

      const won = result === prediction;
      if (won) soundManager.playWin();

      const updatedStats = recordGameResult('coin-flip', result.toUpperCase(), won ? 100 : 0, won);
      onStatsUpdate(updatedStats);
    }, 700);
  };

  const handleBatchTrials = (count: number) => {
    let newHeads = 0;
    const newHistoryItems: { id: number; result: 'heads' | 'tails' }[] = [];

    for (let i = 0; i < count; i++) {
      const isHeads = Math.random() < bias;
      if (isHeads) newHeads++;
      newHistoryItems.push({ id: Date.now() + i, result: isHeads ? 'heads' : 'tails' });
    }

    setTotalFlips((prev) => prev + count);
    setHeadsCount((prev) => prev + newHeads);
    setHistory((prev) => [...newHistoryItems, ...prev]);

    soundManager.playWin();
    const updatedStats = recordGameResult('coin-flip', `Batch ${count}`, count, true);
    onStatsUpdate(updatedStats);
  };

  const handleReset = () => {
    setTotalFlips(0);
    setHeadsCount(0);
    setHistory([]);
    setCoinResult(null);
  };

  const actualHeadsPercentage = totalFlips > 0 ? (headsCount / totalFlips) * 100 : 0;
  const theoreticalPercentage = bias * 100;

  const chartData = React.useMemo(() => {
    let currentHeads = 0;
    const reversedHistory = [...history].reverse();
    return reversedHistory.map((item, idx) => {
      if (item.result === 'heads') currentHeads++;
      const step = idx + 1;
      return {
        step,
        ratio: Number(((currentHeads / step) * 100).toFixed(1)),
        theoretical: Number(theoreticalPercentage.toFixed(1))
      };
    });
  }, [history, bias, theoreticalPercentage]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-between min-h-[420px] shadow-2xl relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs text-gray-400">
            <span>Prediction Mode</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPrediction('heads')}
                className={`px-3 py-1 rounded-full border transition-all ${
                  prediction === 'heads'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/30'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                Heads
              </button>
              <button
                onClick={() => setPrediction('tails')}
                className={`px-3 py-1 rounded-full border transition-all ${
                  prediction === 'tails'
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/30'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                Tails
              </button>
            </div>
          </div>

          <div className="my-8 relative flex items-center justify-center">
            <div
              className={`w-36 h-36 rounded-full bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-1 shadow-2xl shadow-purple-500/40 transition-transform duration-700 ${
                isFlipping ? 'animate-bounce scale-110 rotate-[720deg]' : 'hover:scale-105'
              }`}
            >
              <div className="w-full h-full bg-[#0d0d15] rounded-full flex flex-col items-center justify-center text-center p-2 border border-white/20">
                {coinResult === null ? (
                  <span className="text-xl font-black text-cyan-300 tracking-widest">FLIP ME</span>
                ) : (
                  <>
                    <span className="text-3xl font-black uppercase tracking-wider text-white">
                      {coinResult}
                    </span>
                    <span
                      className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full ${
                        coinResult === prediction
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}
                    >
                      {coinResult === prediction ? 'Match!' : 'Miss'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={handleFlip}
              disabled={isFlipping}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isFlipping ? 'Flipping...' : `Flip Coin (${prediction.toUpperCase()})`}
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => handleBatchTrials(10)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition-colors"
              >
                +10 Batch
              </button>
              <button
                onClick={() => handleBatchTrials(50)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition-colors"
              >
                +50 Batch
              </button>
              <button
                onClick={() => handleBatchTrials(100)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200 transition-colors"
              >
                +100 Batch
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 transition-colors"
                title="Reset Stats"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Probability Controls</h3>
            <p className="text-xs text-gray-400 mt-1">
              Adjust coin bias to test fair vs. unfair probabilistic distributions.
            </p>

            <div className="mt-6 space-y-3 bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300 font-medium">Heads Probability Bias</span>
                <span className="font-extrabold text-cyan-300">{Math.round(bias * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={bias}
                onChange={(e) => setBias(parseFloat(e.target.value))}
                className="w-full accent-purple-500 bg-white/10 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>10% Heavy Tails</span>
                <span>50% Fair Coin</span>
                <span>90% Heavy Heads</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-gray-400 block">Total Flips</span>
              <span className="text-2xl font-black text-white">{totalFlips}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-gray-400 block">Actual Heads Ratio</span>
              <span className="text-2xl font-black text-purple-300">
                {actualHeadsPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-gray-400 block">Heads / Tails</span>
              <span className="text-lg font-bold text-gray-200">
                {headsCount} / {totalFlips - headsCount}
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-gray-400 block">Target Bias</span>
              <span className="text-lg font-bold text-cyan-300">
                {(bias * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {history.length > 0 && (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">
                Law of Large Numbers Convergence
              </h3>
              <p className="text-xs text-gray-400">
                Observing the ratio of Heads approach the theoretical probability as $N$ grows
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" /> Actual Ratio
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block" /> Theoretical ({theoreticalPercentage}%)
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="step" stroke="#6b7280" fontSize={12} />
                <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={12} unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d0d15', borderColor: '#374151', borderRadius: '12px' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <ReferenceLine y={theoreticalPercentage} stroke="#22d3ee" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="ratio"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
