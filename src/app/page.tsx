'use client';

import React, { useState, useEffect } from 'react';

interface LogEntry {
  timestamp: string;
  type: 'SYSTEM' | 'AI' | 'SOCIAL' | 'BLOG' | 'ERROR';
  message: string;
}

export default function OpenClawDashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/agent/logs');
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const handleManualRun = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    try {
      const res = await fetch('/api/agent/run', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert("Marketing Cycle Started Successfully!");
      } else {
        alert("Failed to start cycle: " + data.error);
      }
    } catch (err) {
      alert("Error triggering agent");
    } finally {
      setIsRunning(false);
      fetchLogs();
    }
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-red-500/30 font-sans tracking-tight">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black -z-10" />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="flex items-center justify-between border-b border-white/10 pb-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center font-bold text-2xl shadow-[0_0_20px_rgba(220,38,38,0.5)]">
              ⚙
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-300">
                OpenClaw
              </h1>
              <p className="text-sm text-gray-400 font-medium tracking-widest uppercase">Autonomous Gateway</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-green-500 font-medium text-sm">System Online</span>
            </div>
            <p className="text-[10px] text-gray-500 font-mono">Last Update: {lastUpdated}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Worker Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl text-sm md:text-base">
                <span className="text-gray-400 text-sm">Next Scheduled Run</span>
                <span className="text-white font-mono bg-white/10 px-3 py-1 rounded-md">09:00 UTC</span>
              </div>
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl text-sm md:text-base">
                <span className="text-gray-400 text-sm">Brain Model</span>
                <span className="text-red-400 font-mono">Gemini 2.5 Flash</span>
              </div>
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl pb-5">
                 <button 
                  onClick={handleManualRun}
                  disabled={isRunning}
                  className={`w-full ${isRunning ? 'bg-red-900/50 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} transition-all text-white py-3 rounded-lg font-bold shadow-lg shadow-red-900/20`}
                 >
                   {isRunning ? '⌛ Generating Content...' : '▶ Force Manual Run'}
                 </button>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Recent Content Generations</h2>
            <div className="h-[400px] rounded-xl border border-white/10 bg-black/60 overflow-y-auto p-4 font-mono text-sm space-y-3">
               {logs.length === 0 ? (
                 <div className="text-gray-600 italic">No logs found. Waiting for system initialization...</div>
               ) : (
                 logs.map((log, i) => (
                   <div key={i} className={`border-l-2 pl-3 py-1 ${
                     log.type === 'ERROR' ? 'border-red-500 bg-red-500/5' : 
                     log.type === 'AI' ? 'border-purple-500 bg-purple-500/5' :
                     log.type === 'BLOG' ? 'border-blue-500 bg-blue-500/5' :
                     log.type === 'SOCIAL' ? 'border-pink-500 bg-pink-500/5' :
                     'border-green-500 bg-green-500/5'
                   }`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold uppercase ${
                          log.type === 'ERROR' ? 'text-red-400' : 
                          log.type === 'AI' ? 'text-purple-400' :
                          log.type === 'BLOG' ? 'text-blue-400' :
                          log.type === 'SOCIAL' ? 'text-pink-400' :
                          'text-green-400'
                        }`}>[{log.type}]</span>
                        <span className="text-[10px] text-gray-600">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{log.message}</p>
                   </div>
                 ))
               )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
