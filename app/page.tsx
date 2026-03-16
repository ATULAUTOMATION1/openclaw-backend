import React from 'react';

export default function OpenClawDashboard() {
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
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-green-500 font-medium text-sm">System Online</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Panel */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Worker Status</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl">
                <span className="text-gray-400 text-sm">Next Scheduled Run</span>
                <span className="text-white font-mono bg-white/10 px-3 py-1 rounded-md">09:00 UTC</span>
              </div>
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl">
                <span className="text-gray-400 text-sm">Brain Model</span>
                <span className="text-red-400 font-mono">Gemini 2.5 Flash</span>
              </div>
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl pb-5">
                 <button className="w-full bg-white/10 hover:bg-white/20 transition-colors text-white py-3 rounded-lg font-bold">
                   ▶ Force Manual Run
                 </button>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-200">Recent Content Generations</h2>
            <div className="h-64 rounded-xl border border-white/10 bg-black overflow-y-auto p-4 font-mono text-sm space-y-4">
               {/* Placeholder until we connect the DB */}
               <div className="border-l-2 border-green-500 pl-3 py-1 opacity-80">
                  <p className="text-green-400 text-xs mb-1">[SYSTEM]: Awaiting next Cron trigger...</p>
                  <p className="text-gray-300">Listening to Twitter, waiting for 9:00 AM UTC cycle.</p>
               </div>
               <div className="border-l-2 border-blue-500 pl-3 py-1 opacity-40">
                  <p className="text-blue-400 text-xs mb-1">[SYSTEM]: Init Worker</p>
                  <p className="text-gray-300">Successfully connected to Gemini API.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
