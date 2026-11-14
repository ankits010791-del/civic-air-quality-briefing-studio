'use client';

import React from 'react';
import { Wind, ShieldAlert, Cpu, Settings, Activity, FileSpreadsheet } from 'lucide-react';

interface NavbarProps {
  onOpenSettings: () => void;
  isAnalyzing?: boolean;
  hasData?: boolean;
}

export function Navbar({ onOpenSettings, isAnalyzing, hasData }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 shadow-lg shadow-cyan-500/20">
            <Wind className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Civic Air Quality Briefing Studio
              </h1>
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                v2.5 Production
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Intelligent Municipal Normalization • Role-Based Action Engine • Multilingual Citizen Advisories
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs text-slate-300">
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>Model:</span>
            <span className="font-semibold text-emerald-400">gemini-2.5-flash</span>
          </div>

          <div className="flex items-center space-x-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isAnalyzing
                    ? 'animate-ping bg-amber-400'
                    : hasData
                    ? 'animate-pulse bg-emerald-400'
                    : 'bg-slate-500'
                }`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  isAnalyzing
                    ? 'bg-amber-500'
                    : hasData
                    ? 'bg-emerald-500'
                    : 'bg-slate-400'
                }`}
              />
            </span>
            <span className="text-slate-300">
              {isAnalyzing ? 'Gemini Active...' : hasData ? 'Feed Live' : 'Awaiting Input'}
            </span>
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
            title="Configure Gemini API Key & Diagnostics"
          >
            <Settings className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
