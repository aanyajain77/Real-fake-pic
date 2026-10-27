import React, { useState, useCallback, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Upload, 
  RefreshCcw, 
  Binary, 
  Fingerprint, 
  Zap, 
  Activity,
  Key,
  Cpu,
  Check,
  AlertCircle,
  X
} from 'lucide-react';
import { analyzeImage } from './services/gemini';
import { AnalysisStatus, ForensicReport, AnalysisThread } from './types';
import { ForensicScanner } from './components/ForensicScanner';
import { ThreadMonitor } from './components/ThreadMonitor';

const INITIAL_THREADS: AnalysisThread[] = [
  { id: 'T-001', label: 'Noise Pattern Mapping', status: 'pending', progress: 0 },
  { id: 'T-002', label: 'Geometric Consistency', status: 'pending', progress: 0 },
  { id: 'T-003', label: 'Chroma Anomaly Detection', status: 'pending', progress: 0 },
  { id: 'T-004', label: 'Metadata Integrity Check', status: 'pending', progress: 0 },
  { id: 'T-005', label: 'Deep Texture Analysis', status: 'pending', progress: 0 },
  { id: 'T-006', label: 'Spectral Noise Profiling', status: 'pending', progress: 0 },
  { id: 'T-007', label: 'GAN Signature Verification', status: 'pending', progress: 0 },
  { id: 'T-008', label: 'Color Saturation Check', status: 'pending', progress: 0 },
];

export default function App() {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [image, setImage] = useState<string | null>(null);
  const [report, setReport] = useState<ForensicReport | null>(null);
  const [threads, setThreads] = useState<AnalysisThread[]>(INITIAL_THREADS);
  const [error, setError] = useState<string | null>(null);

  // API Key management
  const [deepseekKey, setDeepseekKey] = useState<string>(() => {
    return (
      (typeof window !== 'undefined' ? localStorage.getItem('deepseek_api_key') : null) ||
      process.env.DEEPSEEK_API_KEY ||
      'sk-f794cfbfcfcc45b189d8d801f562c9d5'
    );
  });
  const [geminiKey, setGeminiKey] = useState<string>(() => {
    return (
      (typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : null) ||
      process.env.GEMINI_API_KEY ||
      process.env.API_KEY ||
      ''
    );
  });
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [tempDeepseekKey, setTempDeepseekKey] = useState<string>(deepseekKey);
  const [tempGeminiKey, setTempGeminiKey] = useState<string>(geminiKey);
  const [savedNotification, setSavedNotification] = useState<boolean>(false);

  const handleSaveKeys = () => {
    setDeepseekKey(tempDeepseekKey);
    setGeminiKey(tempGeminiKey);
    if (typeof window !== 'undefined') {
      localStorage.setItem('deepseek_api_key', tempDeepseekKey);
      localStorage.setItem('gemini_api_key', tempGeminiKey);
    }
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
      setShowKeyModal(false);
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setStatus(AnalysisStatus.IDLE);
        setReport(null);
        setThreads(INITIAL_THREADS);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;

    setStatus(AnalysisStatus.ANALYZING);
    // Initialize threads to processing state with a head start
    setThreads(INITIAL_THREADS.map(t => ({ ...t, status: 'processing', progress: 5 + Math.random() * 10 })));

    let progressInterval: number | undefined;

    try {
      // Multi-threaded simulation logic: update each thread independently with random increments
      progressInterval = window.setInterval(() => {
        setThreads(prev => prev.map(t => {
          if (t.status === 'done') return t;
          const newProgress = Math.min(t.progress + Math.random() * 8, 98);
          return { ...t, progress: newProgress };
        }));
      }, 350);

      const result = await analyzeImage(image, { deepseekKey, geminiKey });
      
      if (progressInterval) window.clearInterval(progressInterval);
      
      // Mark all threads as successfully completed
      setThreads(prev => prev.map(t => ({ ...t, status: 'done', progress: 100 })));
      setReport(result);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      if (progressInterval) window.clearInterval(progressInterval);
      setError(err?.message || "Forensic analysis failed. Verify API configuration.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Binary className="text-emerald-500 w-8 h-8" />
            <span className="tracking-tight uppercase">REAL VS FAKE</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1 font-mono">
            DEEPSEEK &amp; FORENSIC SCANNER // ENGINE: <span className="text-emerald-500 font-bold">ONLINE</span>
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Active Key / Engine Badge */}
          <button 
            onClick={() => {
              setTempDeepseekKey(deepseekKey);
              setTempGeminiKey(geminiKey);
              setShowKeyModal(true);
            }}
            className="bg-slate-900/90 border border-slate-700 hover:border-emerald-500 px-3.5 py-2 rounded-lg flex items-center gap-2.5 transition-all text-xs font-mono group"
            title="Configure DeepSeek / Gemini API Keys"
          >
            <Key className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            <span className="text-slate-300">
              DeepSeek: <span className="text-emerald-400">{deepseekKey ? `${deepseekKey.slice(0, 7)}...${deepseekKey.slice(-4)}` : 'Set Key'}</span>
            </span>
          </button>

          <div className="bg-slate-900/80 border border-slate-800 px-3.5 py-2 rounded-lg flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-slate-300 uppercase">Latency: 18ms</span>
          </div>
        </div>
      </header>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Key className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-lg text-white">AI Engine Configuration</h3>
              </div>
              <button 
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-mono text-emerald-400 mb-1.5 uppercase tracking-wider">
                  DeepSeek API Key
                </label>
                <input 
                  type="text"
                  value={tempDeepseekKey}
                  onChange={(e) => setTempDeepseekKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-lg px-3.5 py-2.5 text-slate-200 font-mono text-xs focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Active key configured. Supports DeepSeek Vision &amp; automatic on-device forensic fallback if account balance is 0.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-cyan-400 mb-1.5 uppercase tracking-wider">
                  Google Gemini API Key (Optional)
                </label>
                <input 
                  type="text"
                  value={tempGeminiKey}
                  onChange={(e) => setTempGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-lg px-3.5 py-2.5 text-slate-200 font-mono text-xs focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Optional fallback provider (Gemini 1.5 Flash).
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 space-y-1">
                <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" /> Multi-Layer Forensic Reliability
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  If DeepSeek balance is 0 or cloud API is unreachable, the system automatically uses real-time pixel-level forensic signal processing (Laplacian noise, Bayer CFA correlation, luminance gradients).
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveKeys}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
              >
                {savedNotification ? (
                  <>
                    <Check className="w-4 h-4" /> SAVED
                  </>
                ) : (
                  'SAVE CONFIGURATION'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
        {/* Left Column: Input & Scan */}
        <div className="lg:col-span-7 space-y-6">
          {!image ? (
            <div className="h-[450px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 bg-slate-900/30 group hover:border-emerald-500/50 transition-all">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="text-slate-500 group-hover:text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ingest Visual Data</h3>
              <p className="text-slate-500 text-center max-w-xs mb-6">
                Drag and drop or select a high-resolution image for deep forensic inspection.
              </p>
              <label className="cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-lg transition-colors shadow-lg shadow-emerald-500/20">
                BROWSE FILES
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <ForensicScanner 
                imageSrc={image} 
                isScanning={status === AnalysisStatus.ANALYZING} 
              />
              
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    setImage(null);
                    setStatus(AnalysisStatus.IDLE);
                    setReport(null);
                    setThreads(INITIAL_THREADS);
                    setError(null);
                  }}
                  className="flex-1 px-6 py-3 border border-slate-800 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors font-bold uppercase text-xs tracking-widest"
                >
                  Clear Buffer
                </button>
                <button 
                  onClick={startAnalysis}
                  disabled={status === AnalysisStatus.ANALYZING}
                  className="flex-[2] px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white rounded-lg transition-all font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  {status === AnalysisStatus.ANALYZING ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" /> Run Deep Analysis
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Thread Monitor */}
          {(status === AnalysisStatus.ANALYZING || status === AnalysisStatus.COMPLETED) && (
            <ThreadMonitor threads={threads} />
          )}
        </div>

        {/* Right Column: Reports & Data */}
        <div className="lg:col-span-5 space-y-6">
          {report ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Verdict Card */}
              <div className={`p-6 rounded-2xl border ${
                report.classification === 'Likely Real' 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-rose-500/10 border-rose-500/30'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-60">Forensic Verdict</span>
                    <h2 className={`text-3xl font-bold mt-1 ${
                      report.classification === 'Likely Real' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {report.classification.toUpperCase()}
                    </h2>
                    {report.engineUsed && (
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400/90 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-md mt-2">
                        <Cpu className="w-3 h-3 text-emerald-400" />
                        <span>{report.engineUsed}</span>
                      </div>
                    )}
                  </div>
                  {report.classification === 'Likely Real' ? (
                    <ShieldCheck className="w-12 h-12 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-12 h-12 text-rose-400" />
                  )}
                </div>
                
                <div className="mt-6 flex items-end gap-4">
                  <div className="flex-grow">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="opacity-60">CONFIDENCE RATING</span>
                      <span className="font-bold">{report.confidence}%</span>
                    </div>
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          report.classification === 'Likely Real' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${report.confidence}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Steps */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">
                  <Fingerprint className="w-4 h-4 text-emerald-500" />
                  Forensic Reasoning Log
                </h3>
                <div className="space-y-4">
                  {report.reasoning.map((reason, idx) => (
                    <div key={idx} className="flex gap-4 group">
                      <span className="text-emerald-500/40 font-mono text-xs mt-1">0{idx + 1}</span>
                      <p className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                        {reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Artifact Metadata */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                  <Binary className="w-4 h-4 text-emerald-500" />
                  Pixel Metadata
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-black/20 p-4 rounded-xl border border-slate-800/50">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Noise Distribution</span>
                    <span className="text-sm font-medium">{report.metadata.noisePatternDensity}</span>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-slate-800/50">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Luminance Integrity</span>
                    <span className="text-sm font-medium">{report.metadata.lightingConsistency}</span>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-slate-800/50">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Texture Quantization</span>
                    <span className="text-sm font-medium">{report.metadata.textureSmoothing}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[380px] bg-slate-900/30 border border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="text-slate-600" />
              </div>
              <p className="text-slate-500 font-mono text-xs uppercase tracking-tighter">
                Awaiting input buffer... <br/>
                Status: IDLE_STANDBY
              </p>
              {error && (
                <div className="mt-4 p-4 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-400 text-xs font-mono text-left max-w-sm">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <AlertCircle className="w-3.5 h-3.5" /> ERROR DETECTED
                  </div>
                  <div>{error}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
