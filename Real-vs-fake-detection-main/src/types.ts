
export enum AnalysisStatus {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface ForensicReport {
  classification: 'Likely Real' | 'Likely AI-Generated';
  confidence: number;
  reasoning: string[];
  artifacts: string[];
  metadata: {
    noisePatternDensity: string;
    lightingConsistency: string;
    textureSmoothing: string;
  };
  engineUsed?: string;
}

export interface AnalysisThread {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'done';
  progress: number;
}
