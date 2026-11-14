'use client';

import React from 'react';
import { X, SearchCheck, FileText, CheckCircle, Database, AlertTriangle, ArrowRight } from 'lucide-react';
import { TraceEvidence } from '@/lib/types';

interface TraceabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  domain?: string;
  traceEvidence: TraceEvidence | null;
}

export function TraceabilityModal({
  isOpen,
  onClose,
  title,
  domain,
  traceEvidence,
}: TraceabilityModalProps) {
  if (!isOpen || !traceEvidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-cyan-500/30 bg-slate-900 p-6 shadow-2xl shadow-cyan-950/50 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <SearchCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="rounded-md bg-cyan-950 px-2 py-0.5 text-[11px] font-semibold text-cyan-300 border border-cyan-800">
                  {domain || 'Traceability Engine'}
                </span>
                <span className="text-xs text-slate-400">
                  Confidence: {Math.round((traceEvidence.confidence || 0.95) * 100)}%
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1 leading-snug">
                {title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Linked Source Rows */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              Direct Data Source Grounding (Row / Sensor IDs)
            </label>
            <div className="flex flex-wrap gap-2">
              {traceEvidence.sourceRowIds && traceEvidence.sourceRowIds.length > 0 ? (
                traceEvidence.sourceRowIds.map((rowId, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center space-x-1 rounded-lg bg-cyan-500/15 border border-cyan-500/40 px-3 py-1 font-mono text-xs font-bold text-cyan-300"
                  >
                    <span>{rowId}</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">Aggregated Municipal Feed</span>
              )}
            </div>
          </div>

          {/* Observed Metric */}
          <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Observed Atmospheric Signal
            </span>
            <p className="text-sm font-medium text-emerald-400">
              {traceEvidence.observedMetric}
            </p>
          </div>

          {/* Verbatim Raw Evidence Snippet */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1.5">
              <FileText className="h-3.5 w-3.5 text-amber-400" />
              Verbatim Raw Data Snippet (Un-normalized Ingestion Row)
            </label>
            <div className="space-y-2">
              {traceEvidence.rawEvidenceSnippets && traceEvidence.rawEvidenceSnippets.length > 0 ? (
                traceEvidence.rawEvidenceSnippets.map((snippet, idx) => (
                  <pre
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-amber-200/90 whitespace-pre-wrap break-all overflow-x-auto leading-relaxed"
                  >
                    {snippet}
                  </pre>
                ))
              ) : (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-400">
                  Direct telemetry cluster calculation.
                </div>
              )}
            </div>
          </div>

          {/* Triggered Rule & Threshold */}
          <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-400 uppercase tracking-wider">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Civic Standard / Safety Threshold Triggered</span>
            </div>
            <p className="text-xs text-slate-200 font-mono">
              {traceEvidence.ruleTriggered || 'NAAQS / WHO 24h Threshold Surpassed'}
            </p>
          </div>

          {/* Scientific Rationale */}
          <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Derivation Rationale & Causal Link
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {traceEvidence.rationale}
            </p>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-800">
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
            >
              Close Trace Inspector
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
