'use client';

import React from 'react';
import { School, Building2, Landmark, Check, Sparkles, RefreshCw, Bike } from 'lucide-react';
import { PersonaType } from '@/lib/types';

interface PersonaSelectorProps {
  selectedPersona: PersonaType;
  onSelectPersona: (persona: PersonaType) => void;
  onGenerateBrief: () => void;
  isLoading: boolean;
  hasAnalysis: boolean;
}

export function PersonaSelector({
  selectedPersona,
  onSelectPersona,
  onGenerateBrief,
  isLoading,
  hasAnalysis,
}: PersonaSelectorProps) {
  const personas = [
    {
      id: 'principal' as PersonaType,
      title: 'School Principal / Administrator',
      icon: School,
      badge: 'Academic & Child Safety',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300',
      activeColor: 'border-amber-400 bg-amber-500/15 ring-2 ring-amber-500/20',
      description:
        'Focuses on student outdoor restrictions, playground recess modifications, HVAC/HEPA air purifier activation, and alerts to parents of asthmatic children.',
      keyLevers: [
        'Cancel outdoor sports & assemblies',
        'Deploy HEPA filters & seal windows',
        'Shift timetable to low-pollution hours',
        'Vulnerable student health register',
      ],
    },
    {
      id: 'rwa' as PersonaType,
      title: 'Housing Society / RWA Manager',
      icon: Building2,
      badge: 'Residential Community',
      color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-300',
      activeColor: 'border-cyan-400 bg-cyan-500/15 ring-2 ring-cyan-500/20',
      description:
        'Focuses on restricting diesel generator (DG) running times during outages, halting open leaf/garbage burning, mist spraying construction piles, and alerting elderly residents.',
      keyLevers: [
        'DG set usage restrictions & load shedding',
        'Zero open waste / garden leaf burning curbs',
        'Water misting for construction dust',
        'Senior citizen morning walk advisories',
      ],
    },
    {
      id: 'municipal' as PersonaType,
      title: 'Ward / Municipal Environmental Officer',
      icon: Landmark,
      badge: 'Civic & Statutory Enforcement',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-300',
      activeColor: 'border-emerald-400 bg-emerald-500/15 ring-2 ring-emerald-500/20',
      description:
        'Focuses on mobilizing mechanized road sweepers, routing water sprinkler tankers to high-particulate corridors, dispatching industrial boiler inspection units, and anti-smog guns.',
      keyLevers: [
        'Mechanized vacuum sweeping schedules',
        'High-density water sprinkler deployment',
        'Industrial stack / foundry inspections',
        'Heavy diesel truck diversion routes',
      ],
    },
    {
      id: 'gig_dispatch' as PersonaType,
      title: 'Gig Worker & Delivery Fleet Dispatcher',
      icon: Bike,
      badge: 'Labor Welfare & Mobility',
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-300',
      activeColor: 'border-purple-400 bg-purple-500/15 ring-2 ring-purple-500/20',
      description:
        'Manages cumulative particulate exposure budgets for delivery riders, dynamic delivery route diversions avoiding severe smog corridors, and compulsory clean-air rest pauses.',
      keyLevers: [
        'Shift exposure duration caps (max 3h)',
        'Reroute riders away from smog canyons',
        'Mandatory N95 mask replenishment hubs',
        'Algorithmic dispatch slowdown during spikes',
      ],
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400" aria-hidden="true" />
            <h3 className="text-base font-bold text-white">Role-Based Action Intelligence Engine</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tailor high-impact tactical interventions and compliance mandates for your statutory jurisdiction.
          </p>
        </div>

        <button
          onClick={onGenerateBrief}
          disabled={isLoading || !hasAnalysis}
          aria-label="Generate tailored persona action plan using Gemini"
          className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/30 transition hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Generating Tailored Interventions...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span>Generate Persona Action Plan</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" role="radiogroup" aria-label="Select Persona Role">
        {personas.map((p) => {
          const Icon = p.icon;
          const isSelected = selectedPersona === p.id;

          return (
            <div
              key={p.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              aria-label={`Select ${p.title} persona context`}
              onClick={() => onSelectPersona(p.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectPersona(p.id);
                }
              }}
              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-150 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                isSelected
                  ? `${p.activeColor} shadow-lg shadow-cyan-950/40`
                  : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-950'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border ${
                      isSelected ? 'border-cyan-400/50 text-cyan-300' : 'border-slate-800 text-slate-400'
                    }`}
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                      isSelected ? 'bg-cyan-950 text-cyan-300 border-cyan-800' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {p.badge}
                  </span>
                </div>

                <h4 className="mt-3 text-sm font-bold text-white leading-snug">{p.title}</h4>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">{p.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1.5">
                  Core Responsibilities:
                </span>
                <ul className="space-y-1 text-[11px] text-slate-400">
                  {p.keyLevers.map((lever, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <Check className="h-3 w-3 text-cyan-400 shrink-0" aria-hidden="true" />
                      <span className="truncate">{lever}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
