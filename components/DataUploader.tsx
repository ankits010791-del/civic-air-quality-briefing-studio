'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Sparkles, RefreshCw, AlertCircle, Check, Database, Zap } from 'lucide-react';
import { MESSY_MUNICIPAL_CSV, MESSY_COMMUNITY_JSON } from '@/lib/sample-data';

interface DataUploaderProps {
  rawData: string;
  setRawData: (data: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  error: string | null;
}

export function DataUploader({
  rawData,
  setRawData,
  onAnalyze,
  isLoading,
  error,
}: DataUploaderProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawData(content);
        setActiveTab('text');
      }
    };
    reader.readAsText(file);
  };

  const lineCount = rawData.trim() ? rawData.trim().split('\n').length : 0;
  const byteSize = new Blob([rawData]).size;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Raw Atmospheric Feed Ingestion</h2>
            <span className="rounded-md bg-cyan-950 px-2 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-800">
              Multi-Format Normalizer
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Accepts inconsistent sensor feeds mixing units (µg/m³, ppm), erratic timestamps, and missing fields.
          </p>
        </div>

        {/* Quick Sample Data Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Zap className="h-3.5 w-3.5 text-amber-400" /> Presets:
          </span>
          <button
            type="button"
            onClick={() => setRawData(MESSY_MUNICIPAL_CSV)}
            className="rounded-lg border border-slate-700 bg-slate-800/90 px-2.5 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-cyan-300"
          >
            Messy Municipal CSV
          </button>
          <button
            type="button"
            onClick={() => setRawData(MESSY_COMMUNITY_JSON)}
            className="rounded-lg border border-slate-700 bg-slate-800/90 px-2.5 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-cyan-300"
          >
            IoT Sensor JSON
          </button>
        </div>
      </div>

      <div className="mt-4">
        {/* Input format tabs */}
        <div className="flex space-x-3 mb-3 border-b border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center space-x-1.5 pb-1 text-xs font-semibold transition border-b-2 ${
              activeTab === 'text'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Paste CSV / JSON / TSV</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex items-center space-x-1.5 pb-1 text-xs font-semibold transition border-b-2 ${
              activeTab === 'file'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload File (.csv, .json, .txt)</span>
          </button>
        </div>

        {activeTab === 'text' ? (
          <div className="relative">
            <textarea
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
              placeholder="Paste raw CSV, JSON or table here... (Or click 'Messy Municipal CSV' above to test instant normalization)"
              rows={9}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-xs text-slate-200 placeholder-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 leading-relaxed"
            />
            {rawData && (
              <div className="absolute bottom-3 right-3 flex items-center space-x-2 rounded-md bg-slate-900/90 border border-slate-800 px-2.5 py-1 text-[11px] text-slate-400">
                <span>{lineCount} rows</span>
                <span>•</span>
                <span>{(byteSize / 1024).toFixed(1)} KB</span>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-800 bg-slate-950/60 p-8 text-center transition hover:border-cyan-500/50 hover:bg-slate-950 cursor-pointer"
          >
            <Upload className="h-8 w-8 text-cyan-400 mb-2" />
            <p className="text-sm font-semibold text-white">Click or drag file here to ingest</p>
            <p className="text-xs text-slate-400 mt-1">Supports raw telemetry CSV, JSON dumps, log exports</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.json,.txt,.tsv"
              className="hidden"
            />
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-start space-x-2 rounded-xl bg-rose-950/50 border border-rose-800/80 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold">Analysis Error: </span>
              {error}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center space-x-2">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-400" />
            <span>Normalization Engine: Gemini 2.5 Flash active</span>
          </div>

          <button
            type="button"
            onClick={onAnalyze}
            disabled={isLoading || !rawData.trim()}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/30 transition hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Normalizing & Auditing Data...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Normalize & Run Integrity Audit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
