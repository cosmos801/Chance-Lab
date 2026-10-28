import React, { useState } from 'react';
import {  RefreshCw, AlertCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export const ProbabilityLab: React.FC = () => {
  const [experiment, setExperiment] = useState<'coin' | 'dice'>('coin');
  const [trials, setTrials] = useState<number>(100);
  const [results, setResults] = useState<{ step: number; ratio: number }[]>([]);

  const runExperiment = () => {
    const data = [];
    let successes = 0;

    for (let i = 1; i <= trials; i++) {
      let success = false;
      if (experiment === 'coin') {
        success = Math.random() < 0.5;
      } else {
        // Roll 2 dice, success if sum is 7
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        success = (d1 + d2) === 7;
      }

      if (success) successes++;
      data.push({ step: i, ratio: (successes / i) * 100 });
    }
    setResults(data);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-4xl font-black text-white mb-2">Probability Lab</h1>
        <p className="text-gray-400">Run large-scale simulations to observe statistical convergence.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 bg-white/[0.03] border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Experiment</label>
            <select
              value={experiment}
              onChange={(e) => setExperiment(e.target.value as any)}
              className="w-full bg-[#0d0d15] border border-white/10 rounded-xl p-3 text-white"
            >
              <option value="coin">Coin Flip (Fair)</option>
              <option value="dice">Dice Sum = 7 (2 Dice)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Number of Trials</label>
            <input
              type="number"
              value={trials}
              onChange={(e) => setTrials(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-[#0d0d15] border border-white/10 rounded-xl p-3 text-white"
            />
          </div>

          <button
            onClick={runExperiment}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Run Simulation
          </button>
        </div>

        <div className="lg:col-span-3 bg-white/[0.03] border border-white/10 rounded-3xl p-8">
          {results.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500 gap-4">
              <AlertCircle className="w-12 h-12 opacity-50" />
              <p>Configure and run an experiment to see results.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={results}>
                <XAxis dataKey="step" stroke="#6b7280" />
                <YAxis domain={[0, 100]} stroke="#6b7280" unit="%" />
                <Tooltip />
                <ReferenceLine y={experiment === 'coin' ? 50 : 16.67} stroke="#22d3ee" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="ratio" stroke="#a855f7" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
