'use client';

import React from 'react';
import {
  Clock,
  SearchCheck,
  CheckCircle2,
  Wrench,
  Bike,
  ShieldAlert,
  Navigation,
} from 'lucide-react';
import { ActionCard } from '@/lib/types';

interface ActionCardsGridProps {
  actions: ActionCard[];
  onOpenTrace: (card: ActionCard) => void;
}

export function ActionCardsGrid({ actions, onOpenTrace }: ActionCardsGridProps) {
  if (!actions || actions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <p className="text-sm text-slate-400">
          No role-based action cards generated yet. Select a persona above and click "Generate Persona Action Plan".
        </p>
      </div>
    );
  }

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'CRITICAL_NOW':
        return {
          pill: 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse',
          border: 'border-rose-500/40 hover:border-rose-500/70',
          accent: 'text-rose-400',
        };
      case 'HIGH_ALERT':
        return {
          pill: 'bg-amber-950 text-amber-300 border-amber-800',
          border: 'border-amber-500/40 hover:border-amber-500/70',
          accent: 'text-amber-400',
        };
      case 'MEDIUM_ADVISORY':
        return {
          pill: 'bg-cyan-950 text-cyan-300 border-cyan-800',
          border: 'border-cyan-500/40 hover:border-cyan-500/70',
          accent: 'text-cyan-400',
        };
      default:
        return {
          pill: 'bg-slate-800 text-slate-300 border-slate-700',
          border: 'border-slate-800 hover:border-slate-700',
          accent: 'text-slate-400',
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Prioritized Tactical Interventions</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational directives grounded in verified sensor telemetry with direct evidence trace links.
          </p>
        </div>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-300 border border-slate-700">
          {actions.length} Action Directives
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((act) => {
          const style = getPriorityStyle(act.priority);
          return (
            <div
              key={act.id}
              className={`flex flex-col justify-between rounded-2xl border bg-slate-900/90 p-5 shadow-xl transition-all duration-200 ${style.border}`}
            >
              <div>
                {/* Header row with Priority & Domain */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${style.pill}`}
                  >
                    {act.priority.replace('_', ' ')}
                  </span>
                  <span className="rounded-lg bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-300 border border-slate-700">
                    {act.targetDomain}
                  </span>
                </div>

                {/* Headline */}
                <h4 className="mt-3 text-base font-bold text-white leading-snug">
                  {act.actionHeadline}
                </h4>

                {/* Operational Window */}
                <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-300">
                  <Clock className="h-3.5 w-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
                  <span className="font-semibold text-slate-400">Execution Window:</span>
                  <span className="font-mono text-cyan-300">{act.operationalWindow}</span>
                </div>

                {/* Detailed Protocol Steps */}
                <div className="mt-3 space-y-1.5">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
                    Operational Protocol:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {act.detailedProtocol?.map((step, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gig Worker Context / Proactive Adaptive Assistance */}
                {act.gigWorkerContext && (
                  <div className="mt-3 rounded-xl border border-purple-500/30 bg-purple-950/20 p-3 space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-bold text-purple-300">
                      <Bike className="h-4 w-4" aria-hidden="true" />
                      <span>Adaptive Dispatcher & Rider Safeguards</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="rounded-lg bg-slate-950 p-2 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Shift Exposure Cap:</span>
                        <span className="font-bold text-rose-300">
                          {act.gigWorkerContext.shiftExposureCapHours} Hours Max
                        </span>
                      </div>
                      <div className="rounded-lg bg-slate-950 p-2 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Mandatory Rest Break:</span>
                        <span className="font-bold text-cyan-300">
                          {act.gigWorkerContext.recommendedRestIntervalMinutes} Mins Recovery
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 flex items-start space-x-1.5">
                      <Navigation className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{act.gigWorkerContext.safeCorridorGuidance}</span>
                    </div>

                    <div className="text-xs text-slate-300 flex items-start space-x-1.5">
                      <ShieldAlert className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{act.gigWorkerContext.protectiveEquipmentMandate}</span>
                    </div>
                  </div>
                )}

                {/* Resource Requirements */}
                {act.resourceRequirements && act.resourceRequirements.length > 0 && (
                  <div className="mt-3 rounded-xl bg-slate-950 p-2.5 border border-slate-800">
                    <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                      <Wrench className="h-3 w-3 text-cyan-400" aria-hidden="true" />
                      <span>Required Equipment & Resources:</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {act.resourceRequirements.map((res, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-slate-900 px-2 py-0.5 text-[11px] text-slate-300 border border-slate-800"
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer with Expected Impact & Trace Source Button */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                <div className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Impact: </span>
                  <span className="text-emerald-400">{act.expectedImpact}</span>
                </div>

                {/* TRACE SOURCE BUTTON with accessible label */}
                <button
                  type="button"
                  onClick={() => onOpenTrace(act)}
                  aria-label={`Trace source data and telemetry for action: ${act.actionHeadline}`}
                  className="flex items-center justify-center space-x-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/60 px-3 py-1.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-900/80 hover:text-cyan-100 hover:border-cyan-400 shadow-sm shrink-0 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  title="Click to view exact source rows, raw telemetry snippets, and scientific rationale"
                >
                  <SearchCheck className="h-3.5 w-3.5 text-cyan-400" aria-hidden="true" />
                  <span>Trace Source Data</span>
                  <span className="rounded bg-cyan-900 px-1.5 py-0.2 text-[10px] font-mono text-cyan-200">
                    {act.traceEvidence?.sourceRowIds?.join(', ') || 'ROW-SRC'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
