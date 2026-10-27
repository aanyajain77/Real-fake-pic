
import React from 'react';
import { AnalysisThread } from '../types';

interface ThreadMonitorProps {
  threads: AnalysisThread[];
}

export const ThreadMonitor: React.FC<ThreadMonitorProps> = ({ threads }) => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
      <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        Analysis Pipeline Nodes
      </h3>
      <div className="space-y-4">
        {threads.map((thread) => (
          <div key={thread.id} className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className={thread.status === 'done' ? 'text-emerald-400' : 'text-slate-400'}>
                [{thread.id}] {thread.label}
              </span>
              <span className="text-slate-500 uppercase">{thread.status}</span>
            </div>
            <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  thread.status === 'done' ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
                style={{ width: `${thread.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
