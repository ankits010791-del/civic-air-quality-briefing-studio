'use client';

import React, { useState } from 'react';
import {
  GitCompare,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  RefreshCw,
  BookmarkPlus,
  ArrowRight,
  MapPin,
  Clock,
  Layers,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import {
  BriefingAnalysis,
  ComparisonResult,
  HistoricalSnapshot,
} from '@/lib/types';
import { HISTORICAL_SNAPSHOTS } from '@/lib/sample-data';

interface ComparisonStudioProps {
  currentAnalysis: BriefingAnalysis | null;
  comparisonResult: ComparisonResult | null;
  onRunComparison: (historical: HistoricalSnapshot) => void;
  onSaveCurrentAsSnapshot: (name: string) => void;
  isLoading: boolean;
  savedSnapshots: HistoricalSnapshot[];
}

export function ComparisonStudio({
  currentAnalysis,
  comparisonResult,
  onRunComparison,
  onSaveCurrentAsSnapshot,
  isLoading,
  savedSnapshots,
}: ComparisonStudioProps) {
  const allSnapshots = [...HISTORICAL_SNAPSHOTS, ...savedSnapshots];
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string>(allSnapshots[0]?.id || '');
  const [snapshotNameInput, setSnapshotNameInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const selectedSnapshot = allSnapshots.find((s) => s.id === selectedSnapshotId) || allSnapshots[0];

  const handleSave = () => {
    if (!snapshotNameInput.trim() || !currentAnalysis) return;
    onSaveCurrentAsSnapshot(snapshotNameInput.trim());
    setSnapshotNameInput('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const getDeltaBadge = (trend?: string) => {
    switch (trend) {
      case 'worsening':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-rose-950 px-2.5 py-0.5 text-xs font-bold text-rose-300 border border-rose-800">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Worsening Trajectory</span>
          </span>
        );
      case 'improving':
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-800">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Improving Trajectory</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-300 border border-slate-700">
            <Minus className="h-3.5 w-3.5" />
            <span>Stable Baseline</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration & Snapshot Selector Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <GitCompare className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Longitudinal Snapshot Comparison</h3>
              <span className="rounded-md bg-cyan-950 px-2 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-800">
                Delta Intelligence Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Compare current telemetry against historical municipal snapshots to compute pollutant deltas and hotspot shifts.
            </p>
          </div>

          <button
            onClick={() => selectedSnapshot && onRunComparison(selectedSnapshot)}
            disabled={isLoading || !currentAnalysis || !selectedSnapshot}
            className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/30 transition hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Computing Environmental Deltas...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Compare Cycles with Gemini</span>
              </>
            )}
          </button>
        </div>

        {/* Snapshot Selection Row */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Select Historical Snapshot for Baseline:
            </label>
            <select
              value={selectedSnapshotId}
              onChange={(e) => setSelectedSnapshotId(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              {allSnapshots.map((snap) => (
                <option key={snap.id} value={snap.id}>
                  {snap.name} — (Avg AQI: {snap.averageAqi}, {snap.dominantPollutant})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Save Current Brief as New Historical Snapshot:
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g. Cycle T-0 Post-Sweeping Sweep"
                value={snapshotNameInput}
                onChange={(e) => setSnapshotNameInput(e.target.value)}
                disabled={!currentAnalysis}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={!snapshotNameInput.trim() || !currentAnalysis}
                className="flex items-center space-x-1 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white disabled:opacity-50"
              >
                <BookmarkPlus className="h-4 w-4 text-cyan-400" />
                <span>Save</span>
              </button>
            </div>
            {saveSuccess && (
              <p className="mt-1 text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> Snapshot saved to memory!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Side-by-Side Snapshot Card Overviews */}
      {selectedSnapshot && currentAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Baseline Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-300">
                Baseline Cycle (Historical)
              </span>
              <span className="text-xs text-slate-400">{selectedSnapshot.timestamp}</span>
            </div>
            <h4 className="mt-3 text-base font-bold text-white">{selectedSnapshot.name}</h4>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Avg AQI</span>
                <span className="text-lg font-bold text-white">{selectedSnapshot.averageAqi}</span>
              </div>
              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Peak AQI</span>
                <span className="text-lg font-bold text-amber-400">{selectedSnapshot.peakAqi}</span>
              </div>
              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Dominant</span>
                <span className="text-lg font-bold text-cyan-400">{selectedSnapshot.dominantPollutant}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400 leading-relaxed">{selectedSnapshot.summary}</p>
          </div>

          {/* Current Cycle Card */}
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-5 shadow-lg shadow-cyan-950/30">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="rounded-md bg-cyan-950 px-2 py-0.5 text-xs font-semibold text-cyan-300 border border-cyan-800">
                Current Briefing Cycle (T-0)
              </span>
              <span className="text-xs text-slate-400">{currentAnalysis.generatedAt}</span>
            </div>
            <h4 className="mt-3 text-base font-bold text-white">{currentAnalysis.locationSummary}</h4>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Avg AQI</span>
                <span className="text-lg font-bold text-cyan-300">{currentAnalysis.averageAqi}</span>
              </div>
              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Peak AQI</span>
                <span className="text-lg font-bold text-rose-400">{currentAnalysis.peakAqi}</span>
              </div>
              <div className="rounded-xl bg-slate-950 p-2.5 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Dominant</span>
                <span className="text-lg font-bold text-emerald-400">{currentAnalysis.dominantPollutant}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-300 leading-relaxed">{currentAnalysis.executiveSummary}</p>
          </div>
        </div>
      )}

      {/* Comparison Results Section */}
      {comparisonResult ? (
        <div className="space-y-6">
          {/* Delta Highlights Banner */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Environmental Delta Assessment
                </span>
                <h4 className="text-lg font-bold text-white mt-0.5">
                  Trajectory: {comparisonResult.overallAqiDelta.summaryNarrative}
                </h4>
              </div>

              {getDeltaBadge(comparisonResult.overallAqiDelta.trend)}
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block">AQI Difference</span>
                <span
                  className={`text-xl font-bold mt-1 block ${
                    comparisonResult.overallAqiDelta.difference > 0
                      ? 'text-rose-400'
                      : comparisonResult.overallAqiDelta.difference < 0
                      ? 'text-emerald-400'
                      : 'text-slate-200'
                  }`}
                >
                  {comparisonResult.overallAqiDelta.difference > 0 ? '+' : ''}
                  {comparisonResult.overallAqiDelta.difference} pts
                </span>
              </div>

              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block">Percentage Shift</span>
                <span
                  className={`text-xl font-bold mt-1 block ${
                    comparisonResult.overallAqiDelta.percentChange > 0
                      ? 'text-rose-400'
                      : comparisonResult.overallAqiDelta.percentChange < 0
                      ? 'text-emerald-400'
                      : 'text-slate-200'
                  }`}
                >
                  {comparisonResult.overallAqiDelta.percentChange > 0 ? '+' : ''}
                  {comparisonResult.overallAqiDelta.percentChange}%
                </span>
              </div>

              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block">Baseline AQI</span>
                <span className="text-xl font-bold text-white mt-1 block">
                  {comparisonResult.historicalSnapshot.averageAqi}
                </span>
              </div>

              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block">Current AQI</span>
                <span className="text-xl font-bold text-cyan-300 mt-1 block">
                  {comparisonResult.currentSnapshot.averageAqi}
                </span>
              </div>
            </div>
          </div>

          {/* Pollutant-Level Delta Breakdown Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
              Pollutant Concentration Delta Breakdown
            </h4>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Pollutant</th>
                    <th className="py-2.5 px-3">Baseline Avg</th>
                    <th className="py-2.5 px-3">Current Avg</th>
                    <th className="py-2.5 px-3">Delta (%)</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Analytical Grounding</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {comparisonResult.pollutantDeltas?.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/40">
                      <td className="py-2.5 px-3 font-bold text-white">{p.pollutant}</td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {p.previousAvg} {p.unit}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-cyan-300">
                        {p.currentAvg} {p.unit}
                      </td>
                      <td
                        className={`py-2.5 px-3 font-bold ${
                          p.percentChange > 0 ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {p.percentChange > 0 ? '+' : ''}
                        {p.percentChange}%
                      </td>
                      <td className="py-2.5 px-3 font-sans">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                            p.status === 'SURGE'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : p.status === 'ELEVATED'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans text-xs text-slate-400">{p.traceDetails}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hotspot Migration & Spatial Shift */}
          {comparisonResult.hotspotMigration && comparisonResult.hotspotMigration.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <MapPin className="h-4 w-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Hotspot Spatial Shift & Dispersion Analysis</h4>
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {comparisonResult.hotspotMigration.map((shift, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{shift.area}</span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 border border-slate-700">
                        {shift.statusChange}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center space-x-3 text-xs text-slate-400 font-mono">
                      <span>Baseline: {shift.previousAqi} AQI</span>
                      <ArrowRight className="h-3 w-3 text-cyan-400" />
                      <span className="text-white font-bold">Current: {shift.currentAqi} AQI</span>
                    </div>

                    <p className="mt-2 text-xs text-slate-300 leading-relaxed font-sans">
                      {shift.shiftAnalysis}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Executive Comparative Narrative */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Gemini Atmospheric Trend Synthesis</span>
            </h4>
            <div className="mt-3 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
              {comparisonResult.aiComparativeBrief}
            </div>

            {/* Strategic Policy Adjustments */}
            {comparisonResult.strategicAdjustments && (
              <div className="mt-4 pt-3 border-t border-slate-800">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide block mb-2">
                  Actionable Policy Adjustments Warranted by Delta:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {comparisonResult.strategicAdjustments.map((adj, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{adj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-xs text-slate-400">
          Click "Compare Cycles with Gemini" above to compute the full longitudinal delta analysis.
        </div>
      )}
    </div>
  );
}
