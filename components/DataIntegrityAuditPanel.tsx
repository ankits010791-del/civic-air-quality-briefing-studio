'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Radio,
  FileCode,
  Activity,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DataIntegrityAudit, NormalizedReading } from '@/lib/types';

interface DataIntegrityAuditPanelProps {
  audit: DataIntegrityAudit;
  normalizedReadings: NormalizedReading[];
  onSelectTraceRow?: (rowId: string) => void;
}

export function DataIntegrityAuditPanel({
  audit,
  normalizedReadings,
  onSelectTraceRow,
}: DataIntegrityAuditPanelProps) {
  const [showNormalizedTable, setShowNormalizedTable] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredAnomalies =
    filterSeverity === 'all'
      ? audit.anomalies
      : audit.anomalies.filter((a) => a.severity === filterSeverity);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-950/20';
    return 'text-rose-400 border-rose-500/30 bg-rose-950/20';
  };

  const getIssueBadge = (type: string) => {
    switch (type) {
      case 'UNIT_MISMATCH':
        return 'bg-purple-950/60 text-purple-300 border-purple-800';
      case 'CORRUPT_FORMAT':
        return 'bg-rose-950/60 text-rose-300 border-rose-800';
      case 'OUT_OF_BOUNDS':
        return 'bg-orange-950/60 text-orange-300 border-orange-800';
      case 'MISSING_FIELD':
        return 'bg-amber-950/60 text-amber-300 border-amber-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Health Score & Metrics */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Data Integrity & Sensor Audit</h3>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300 border border-slate-700">
                  Automated Gemini Verification
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Detailed verification of malformed timestamps, unit reconciliations, and sensor telemetry health.
              </p>
            </div>
          </div>

          {/* Health Score Pill */}
          <div
            className={`flex items-center space-x-3 rounded-2xl border px-4 py-2.5 ${getHealthColor(
              audit.overallDataHealthScore
            )}`}
          >
            <div>
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
                Feed Health Score
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-black">{audit.overallDataHealthScore}</span>
                <span className="text-xs font-semibold text-slate-400">/ 100</span>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-700/50" />
            <div className="text-xs font-medium">
              {audit.overallDataHealthScore >= 80 ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" /> Reliable Feed
                </span>
              ) : audit.overallDataHealthScore >= 50 ? (
                <span className="flex items-center gap-1 text-amber-400">
                  <AlertTriangle className="h-4 w-4" /> Degraded Quality
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-400">
                  <AlertTriangle className="h-4 w-4" /> Critical Gaps
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 4 Metric Counter Cards */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
              Total Ingested
            </span>
            <span className="text-xl font-bold text-white mt-1 block">
              {audit.totalInputRows} <span className="text-xs font-normal text-slate-400">rows</span>
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
              Successfully Normalized
            </span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">
              {audit.validParsedRows} <span className="text-xs font-normal text-slate-400">clean</span>
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
              Units Reconciled
            </span>
            <span className="text-xl font-bold text-cyan-400 mt-1 block">
              {audit.normalizedUnitCount} <span className="text-xs font-normal text-slate-400">conversions</span>
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
              Flagged Anomalies
            </span>
            <span className="text-xl font-bold text-rose-400 mt-1 block">
              {audit.anomalies?.length || 0} <span className="text-xs font-normal text-slate-400">issues</span>
            </span>
          </div>
        </div>

        {/* Audit Executive Summary */}
        <div className="mt-4 rounded-xl bg-slate-950/60 border border-slate-800/80 p-3.5 text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
            Data Integrity Assessor Narrative
          </span>
          {audit.auditSummary}
        </div>
      </div>

      {/* Flagged Anomalies & Corrupt Records Panel */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">Flagged Data Gaps & Sensor Malfunctions</h4>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-300">
              {filteredAnomalies.length} Records
            </span>
          </div>

          {/* Filter Pill buttons */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-400 mr-1 text-[11px]">Severity:</span>
            {(['all', 'high', 'medium', 'low'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`rounded-lg px-2.5 py-1 font-semibold uppercase text-[10px] transition ${
                  filterSeverity === sev
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {filteredAnomalies && filteredAnomalies.length > 0 ? (
            filteredAnomalies.map((anomaly, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:border-slate-700"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                      {anomaly.rowId}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold border uppercase tracking-wider ${getIssueBadge(
                        anomaly.issueType
                      )}`}
                    >
                      {anomaly.issueType.replace('_', ' ')}
                    </span>
                    {anomaly.sensorId && (
                      <span className="text-xs text-slate-400 font-mono">
                        Sensor: {anomaly.sensorId}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border self-start sm:self-auto ${
                      anomaly.severity === 'high'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                        : anomaly.severity === 'medium'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {anomaly.severity} Severity
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-200 mt-2">
                  {anomaly.description}
                </p>

                {/* Raw snippet quote */}
                {anomaly.rawSnippet && (
                  <div className="mt-2 rounded-lg bg-slate-900 border border-slate-800/80 p-2 font-mono text-[11px] text-amber-200/90 break-all">
                    <span className="text-slate-500 select-none mr-2">Raw Snippet:</span>
                    {anomaly.rawSnippet}
                  </div>
                )}

                <div className="mt-2 flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-2">
                  <span className="font-semibold text-emerald-300">Action Taken:</span>
                  <span>{anomaly.actionTaken}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-xs text-slate-400">
              No anomalies detected for the selected filter.
            </div>
          )}
        </div>
      </div>

      {/* Sensor Coverage Fleet Grid */}
      {audit.sensorCoverage && audit.sensorCoverage.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Radio className="h-4 w-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Sensor Fleet Telemetry Status</h4>
            <span className="text-xs text-slate-400">
              ({audit.sensorCoverage.length} Reporting Stations)
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {audit.sensorCoverage.map((sensor, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">
                      {sensor.sensorId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                        sensor.status === 'ONLINE'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : sensor.status === 'DEGRADED'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}
                    >
                      {sensor.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{sensor.location}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{sensor.readingsCount} readings</span>
                  {sensor.notes && <span className="text-slate-500 truncate max-w-[120px]">{sensor.notes}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Normalized Data Table Toggle */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileCode className="h-4 w-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Standardized Data Table View</h4>
            <span className="text-xs text-slate-400">
              ({normalizedReadings?.length || 0} Standardized Rows)
            </span>
          </div>

          <button
            onClick={() => setShowNormalizedTable(!showNormalizedTable)}
            className="flex items-center space-x-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            <span>{showNormalizedTable ? 'Collapse Table' : 'Expand Full Table'}</span>
            {showNormalizedTable ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {showNormalizedTable && (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Row ID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Location / Zone</th>
                  <th className="py-2.5 px-3">Pollutant</th>
                  <th className="py-2.5 px-3">Raw Value</th>
                  <th className="py-2.5 px-3">Normalized (Std)</th>
                  <th className="py-2.5 px-3">AQI Eq.</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                {normalizedReadings?.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">{row.rowId}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-300">{row.timestamp}</td>
                    <td className="py-2.5 px-3 font-sans text-white font-medium">{row.location}</td>
                    <td className="py-2.5 px-3 text-emerald-300">{row.pollutant}</td>
                    <td className="py-2.5 px-3 text-slate-400">{row.rawValue}</td>
                    <td className="py-2.5 px-3 text-cyan-300 font-bold">
                      {row.normalizedValue} {row.standardUnit}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="font-bold text-white">{row.aqiEquivalent}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase font-sans ${
                          row.category === 'Hazardous' || row.category === 'Severe'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : row.category === 'Unhealthy' || row.category === 'Poor'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {row.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
