
import React from 'react';

interface ForensicScannerProps {
  imageSrc: string;
  isScanning: boolean;
}

export const ForensicScanner: React.FC<ForensicScannerProps> = ({ imageSrc, isScanning }) => {
  return (
    <div className="relative w-full aspect-video rounded-xl border border-slate-800 overflow-hidden bg-slate-900 group">
      <img 
        src={imageSrc} 
        alt="Forensic Target" 
        className={`w-full h-full object-contain transition-all duration-700 ${isScanning ? 'brightness-50 grayscale-[0.5]' : ''}`} 
      />
      {isScanning && (
        <>
          <div className="scanline"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-slate-950/80 border border-emerald-500/50 px-6 py-4 rounded-lg backdrop-blur-md flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <span className="font-mono text-emerald-500 text-sm font-bold animate-pulse">
                INITIALIZING MULTI-THREADED ANALYSIS...
              </span>
            </div>
          </div>
          {/* Simulated Artifact Markers */}
          <div className="absolute top-1/4 left-1/3 w-12 h-12 border border-rose-500/50 rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 right-1/4 w-8 h-8 border border-cyan-500/50 rounded-full animate-ping delay-700"></div>
        </>
      )}
      <div className="absolute bottom-4 left-4 font-mono text-xs text-slate-500 opacity-60 group-hover:opacity-100 transition-opacity">
        SYSTEM_ID: VERISIGHT_PIXEL_FORENSICS_V4.2
      </div>
    </div>
  );
};
