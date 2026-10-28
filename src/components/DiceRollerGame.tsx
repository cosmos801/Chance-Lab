import React, { useState } from 'react';
import { RotateCcw } from './icons';
import { soundManager } from '../utils/sound';
import { recordGameResult } from '../utils/storage';
import type { UserStats } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface DiceRollerGameProps {
  onStatsUpdate: (stats: UserStats) => void;
}

export const DiceRollerGame: React.FC<DiceRollerGameProps> = ({ onStatsUpdate }) => {
  const [numDice, setNumDice] = useState<number>(2);
  const [diceValues, setDiceValues] = useState<number[]>([3, 4]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [targetSum, setTargetSum] = useState<number>(7);
  const [, setHistory] = useState<{ id: number; values: number[]; sum: number }[]>([]);
  const [sumFrequencies, setSumFrequencies] = useState<{ [sum: number]: number }>({});
  const [totalRolls, setTotalRolls] = useState<number>(0);

  // Roll single turn
  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    soundManager.playPop();

    setTimeout(() => {
      const newValues: number[] = [];
      let currentSum = 0;
      for (let i = 0; i < numDice; i++) {
        const val = Math.floor(Math.random() * 6) + 1;
        newValues.push(val);
        currentSum += val;
      }

      setDiceValues(newValues);
      setIsRolling(false);
      setTotalRolls((prev) => prev + 1);

      setSumFrequencies((prev) => ({
        ...prev,
        [currentSum]: (prev[currentSum] || 0) + 1
      }));

      setHistory((prev) => [{ id: Date.now(), values: newValues, sum: currentSum }, ...prev]);

      const won = currentSum === targetSum;
      if (won) soundManager.playWin();

      const updatedStats = recordGameResult('dice-roller', `Sum ${currentSum}`, won ? 150 : 20, won);
      onStatsUpdate(updatedStats);
    }, 600);
  };

  // Batch simulation for law of large numbers
  const handleBatchRolls = (count: number) => {
    const newFreqs = { ...sumFrequencies };
    const newHist: { id: number; values: number[]; sum: number }[] = [];

    for (let c = 0; c < count; c++) {
      let currentSum = 0;
      const vals: number[] = [];
      for (let i = 0; i < numDice; i++) {
        const val = Math.floor(Math.random() * 6) + 1;
        vals.push(val);
        currentSum += val;
      }
      newFreqs[currentSum] = (newFreqs[currentSum] || 0) + 1;
      newHist.push({ id: Date.now() + c, values: vals, sum: currentSum });
    }

    setTotalRolls((prev) => prev + count);
    setSumFrequencies(newFreqs);
    setHistory((prev) => [...newHist, ...prev]);

    soundManager.playWin();
    const updatedStats = recordGameResult('dice-roller', `Batch ${count}`, count * 2, true);
    onStatsUpdate(updatedStats);
  };

  const handleReset = () => {
    setDiceValues(Array(numDice).fill(1));
    setHistory([]);
    setSumFrequencies({});
    setTotalRolls(0);
  };

  // Theoretical probability calculations for N dice
  const minSum = numDice;
  const maxSum = numDice * 6;

  const chartData = React.useMemo(() => {
    const data = [];
    for (let s = minSum; s <= maxSum; s++) {
      const count = sumFrequencies[s] || 0;
      const actualPct = totalRolls > 0 ? (count / totalRolls) * 100 : 0;
      data.push({
        sum: s,
        count,
        actualPct: Number(actualPct.toFixed(1))
      });
    }
    return data;
  }, [sumFrequencies, totalRolls, minSum, maxSum]);

  const currentSum = diceValues.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dice Arena */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-between min-h-[420px] shadow-2xl relative">
          <div className="w-full flex items-center justify-between text-xs text-gray-400">
            <span>Dice Count: {numDice}</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    setNumDice(count);
                    setDiceValues(Array(count).fill(1));
                    setSumFrequencies({});
                    setTotalRolls(0);
                  }}
                  className={`px-3 py-1 rounded-full border transition-all ${
                    numDice === count
                      ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/30'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  {count} {count === 1 ? 'Die' : 'Dice'}
                </button>
              ))}
            </div>
          </div>

          {/* Dice Display */}
          <div className="my-8 flex flex-wrap items-center justify-center gap-6">
            {diceValues.map((val, idx) => (
              <div
                key={idx}
                className={`w-24 h-24 rounded-2xl bg-gradient-to-tr from-[#13111c] to-[#1e1b2e] border-2 border-purple-500/40 shadow-xl shadow-purple-500/20 flex flex-col items-center justify-center p-3 relative transition-transform duration-500 ${
                  isRolling ? 'rotate-[360deg] scale-110' : 'hover:scale-105'
                }`}
              >
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-cyan-300">
                  {val}
                </span>
                <span className="text-[10px] text-gray-500 font-bold uppercase mt-1">Die #{idx + 1}</span>
              </div>
            ))}
          </div>

          <div className="text-center mb-4">
            <span className="text-xs uppercase font-bold tracking-widest text-gray-400 block">Total Rolled Sum</span>
            <span className="text-3xl font-extrabold text-cyan-300">{currentSum}</span>
          </div>

          {/* Controls */}
          <div className="w-full space-y-3">
            <button
              onClick={handleRoll}
              disabled={isRolling}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {isRolling ? 'Rolling Dice Matrix...' : `Roll ${numDice} ${numDice === 1 ? 'Die' : 'Dice'}`}
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => handleBatchRolls(20)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200"
              >
                +20 Rolls
              </button>
              <button
                onClick={() => handleBatchRolls(100)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-200"
              >
                +100 Rolls
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300"
                title="Reset Stats"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Prediction & Concept Info */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Target Sum Prediction</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              When rolling multiple dice, combinations for intermediate values (like 7 on 2 dice) are far more frequent than extreme values (2 or 12).
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300 font-medium">Your Target Sum</span>
                <span className="font-extrabold text-cyan-300">{targetSum}</span>
              </div>
              <input
                type="range"
                min={minSum}
                max={maxSum}
                value={targetSum}
                onChange={(e) => setTargetSum(parseInt(e.target.value))}
                className="w-full accent-purple-500 bg-white/10 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                <span>Min: {minSum}</span>
                <span>Peak: {Math.round((minSum + maxSum) / 2)}</span>
                <span>Max: {maxSum}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-gray-400 block">Total Matrix Rolls</span>
              <span className="text-2xl font-black text-white">{totalRolls}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-gray-400 block">Target Hits ({targetSum})</span>
              <span className="text-2xl font-black text-purple-300">
                {sumFrequencies[targetSum] || 0}
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-gray-400 block">Hit Percentage</span>
              <span className="text-lg font-bold text-gray-200">
                {totalRolls > 0 ? (((sumFrequencies[targetSum] || 0) / totalRolls) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-gray-400 block">Sample Status</span>
              <span className="text-sm font-semibold text-emerald-400">
                {totalRolls >= 100 ? 'Gaussian Profile' : 'Gathering Data'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Histogram Chart */}
      {totalRolls > 0 && (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Sum Frequency Distribution</h3>
              <p className="text-xs text-gray-400">
                Observe the emergence of the central limit theorem as frequency peaks at the expected mean.
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="sum" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d0d15', borderColor: '#374151', borderRadius: '12px' }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.sum === targetSum ? '#22d3ee' : '#9333ea'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
