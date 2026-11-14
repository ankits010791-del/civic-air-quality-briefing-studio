'use client';

import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Building,
  Scale,
  MapPin,
  Clock,
  AlertOctagon,
  ShieldAlert,
} from 'lucide-react';
import { InternalBriefingNote } from '@/lib/types';

interface InternalBriefingViewProps {
  note: InternalBriefingNote | null;
}

export function InternalBriefingView({ note }: InternalBriefingViewProps) {
  const [copied, setCopied] = useState(false);

  if (!note) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-xs text-slate-400">
        Internal briefing note not yet synthesized. Generate a brief in the Persona Engine to populate official technical records.
      </div>
    );
  }

  const handleCopy = () => {
    if (!note) return;
    const fullText = `${note.briefingTitle}\nClassification: ${note.classificationLevel}\nIssued: ${note.timestamp}\n\nExecutive Summary:\n${note.executiveSummary}\n\nMeteorological Notes:\n${note.meteorologicalSynergyNotes}\n\n${note.fullTechnicalReportMarkdown}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const getComplianceStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLIANT':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'BORDERLINE':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'EXCEEDED':
        return 'bg-orange-950 text-orange-300 border-orange-800';
      default:
        return 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse';
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl no-print">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-cyan-400" />
          <div>
            <h3 className="text-sm font-bold text-white">Internal Technical Briefing Document</h3>
            <p className="text-xs text-slate-400">
              Structured for municipal disaster taskforces, environmental engineers, and mayoral councils.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Full Brief'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 rounded-xl bg-cyan-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500 shadow-lg shadow-cyan-600/30"
          >
            <Printer className="h-4 w-4" />
            <span>Print Official Brief</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Canvas */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="font-mono text-[11px] font-bold text-rose-400 uppercase tracking-widest bg-rose-950/60 border border-rose-800 px-2.5 py-0.5 rounded-md self-start">
              {note.classificationLevel}
            </span>
            <span className="text-xs text-slate-400 font-mono">Issued: {note.timestamp}</span>
          </div>

          <h2 className="mt-3 text-xl sm:text-2xl font-black text-white tracking-tight">
            {note.briefingTitle}
          </h2>
          <p className="mt-1 text-xs text-slate-400">Jurisdiction: {note.issuedFor}</p>
        </div>

        {/* Executive Summary */}
        <div className="rounded-xl bg-slate-950 p-4 border border-slate-800">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1.5">
            Executive Directive & Synthesis
          </span>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {note.executiveSummary}
          </p>
        </div>

        {/* Meteorological Synergy */}
        {note.meteorologicalSynergyNotes && (
          <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800/80">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
              Atmospheric Boundary Layer & Meteorological Synergy
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {note.meteorologicalSynergyNotes}
            </p>
          </div>
        )}

        {/* WHO & NAAQS Standard Compliance Table */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Scale className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Statutory Standard Compliance Table (Observed vs WHO & NAAQS 24-Hour Limits)
            </h4>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Pollutant</th>
                  <th className="py-2.5 px-3">Observed Concentration</th>
                  <th className="py-2.5 px-3">WHO 24h Cap</th>
                  <th className="py-2.5 px-3">National Standard (NAAQS)</th>
                  <th className="py-2.5 px-3">Compliance Ratio</th>
                  <th className="py-2.5 px-3">Regulatory Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                {note.complianceTable?.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-3 font-bold text-white">{row.pollutant}</td>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">
                      {row.observed24hAvg} {row.unit}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {row.whoStandard} {row.unit}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {row.nationalStandard} {row.unit}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-amber-400">
                      {row.complianceRatio ? `${row.complianceRatio}x` : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase border ${getComplianceStatusBadge(
                          row.status
                        )}`}
                      >
                        {row.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Spatial Hotspots & Dispatch Directives */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Identified Spatial Hotspots & Field Interventions
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {note.spatialHotspots?.map((hotspot, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{hotspot.sector}</span>
                  <span className="font-mono text-xs font-bold text-rose-400">
                    AQI {hotspot.aqi}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  <span>Primary Contributor: </span>
                  <span className="text-slate-200">{hotspot.primaryContributor}</span>
                </div>
                <div className="mt-2 text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 rounded-lg p-2 font-medium">
                  <span className="text-cyan-400 font-bold">Dispatch: </span>
                  {hotspot.dispatchDirective}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Departmental Directives */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Building className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Statutory Departmental Directives & Deadlines
            </h4>
          </div>

          <div className="space-y-2">
            {note.departmentalDirectives?.map((dir, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3"
              >
                <div>
                  <span className="text-xs font-bold text-white block">{dir.department}</span>
                  <p className="text-xs text-slate-300 mt-0.5">{dir.directive}</p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Enforcement</span>
                  <span className="text-xs font-mono text-rose-300 font-semibold">{dir.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Markdown Report */}
        {note.fullTechnicalReportMarkdown && (
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {note.fullTechnicalReportMarkdown}
          </div>
        )}
      </div>
    </div>
  );
}
