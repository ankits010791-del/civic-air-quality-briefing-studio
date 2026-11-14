'use client';

import React, { useState } from 'react';
import {
  HeartHandshake,
  Languages,
  Printer,
  Sparkles,
  RefreshCw,
  Baby,
  UserCheck,
  Activity,
  HardHat,
  Home,
  CheckCircle,
  XCircle,
  PhoneCall,
  Bus,
  Share2,
} from 'lucide-react';
import { CitizenAdvisory } from '@/lib/types';

interface CitizenAdvisoryCardProps {
  advisory: CitizenAdvisory | null;
  onGenerateAdvisory: (language: string, readingLevel: string) => void;
  isLoading: boolean;
  hasAnalysis: boolean;
}

export function CitizenAdvisoryCard({
  advisory,
  onGenerateAdvisory,
  isLoading,
  hasAnalysis,
}: CitizenAdvisoryCardProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedReadingLevel, setSelectedReadingLevel] = useState('General Public');

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi (हिन्दी)' },
    { code: 'es', label: 'Spanish (Español)' },
    { code: 'mr', label: 'Marathi (मराठी)' },
    { code: 'bn', label: 'Bengali (বাংলা)' },
    { code: 'fr', label: 'French (Français)' },
  ];

  const readingLevels = ['General Public', 'Simple (5th Grade)', 'Technical'] as const;

  const handlePrint = () => {
    window.print();
  };

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return '#10b981'; // Green
    if (aqi <= 100) return '#f59e0b'; // Yellow/Amber
    if (aqi <= 200) return '#f97316'; // Orange
    if (aqi <= 300) return '#ef4444'; // Red
    if (aqi <= 400) return '#8b5cf6'; // Purple
    return '#7f1d1d'; // Maroon / Hazardous
  };

  return (
    <div className="space-y-6">
      {/* Controls & Configuration Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl no-print">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <HeartHandshake className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Multilingual Citizen Health Advisory</h3>
              <span className="rounded-md bg-cyan-950 px-2 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-800">
                Empathetic Public Notice
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Generates life-saving citizen warnings tailored across languages, reading levels, and vulnerable demographics.
            </p>
          </div>

          <button
            onClick={() => onGenerateAdvisory(selectedLanguage, selectedReadingLevel)}
            disabled={isLoading || !hasAnalysis}
            className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-600/30 transition hover:from-cyan-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Generating Citizen Advisory...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Multilingual Card</span>
              </>
            )}
          </button>
        </div>

        {/* Language & Reading Level Selectors */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
              <Languages className="h-3.5 w-3.5 text-cyan-400" />
              Select Target Language:
            </label>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition border ${
                    selectedLanguage === lang.code
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Target Reading Comprehension Level:
            </label>
            <div className="flex flex-wrap gap-2">
              {readingLevels.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedReadingLevel(lvl)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition border ${
                    selectedReadingLevel === lvl
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advisory Presentation Card */}
      {advisory ? (
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Card Top Banner with Print / Share */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="rounded-full bg-cyan-950 px-2.5 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-800">
                  {advisory.language}
                </span>
                <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300 border border-slate-700">
                  {advisory.readingLevel}
                </span>
              </div>
              <h2 className="mt-2 text-xl sm:text-2xl font-black text-white tracking-tight">
                {advisory.headline}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                {advisory.subheadline}
              </p>
            </div>

            <div className="flex items-center space-x-2 no-print shrink-0">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
              >
                <Printer className="h-4 w-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* AQI Status Dial / Indicator */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              <div
                className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl text-white font-black shadow-lg"
                style={{
                  backgroundColor: getAqiColor(advisory.currentAirCondition.aqiScore),
                }}
              >
                <span className="text-2xl leading-none">
                  {advisory.currentAirCondition.aqiScore}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider mt-0.5 opacity-90">
                  AQI
                </span>
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block">
                  Today's Air Quality Status
                </span>
                <h4 className="text-lg font-bold text-white mt-0.5">
                  {advisory.currentAirCondition.statusBadge}
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                  {advisory.currentAirCondition.plainExplanation}
                </p>
              </div>
            </div>
          </div>

          {/* 4 Vulnerable Groups Precautions (CRITICAL REQUIREMENT) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Targeted Safety Callouts for High-Risk Demographics
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Children & Students */}
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-300">
                      <Baby className="h-4 w-4" />
                    </div>
                    <h5 className="text-sm font-bold text-amber-300">Children & Schools</h5>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-200">
                    {advisory.healthAdvisories.children.callout}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs">
                    {advisory.healthAdvisories.children.dos?.map((d, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-emerald-300">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-400" />
                        <span>{d}</span>
                      </div>
                    ))}
                    {advisory.healthAdvisories.children.donts?.map((d, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-rose-300">
                        <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-400" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Older Adults / Seniors */}
              <div className="rounded-2xl border border-rose-500/30 bg-rose-950/15 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <h5 className="text-sm font-bold text-rose-300">Seniors & Older Adults</h5>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-200">
                    {advisory.healthAdvisories.olderAdults.callout}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs">
                    {advisory.healthAdvisories.olderAdults.dos?.map((d, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-emerald-300">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-400" />
                        <span>{d}</span>
                      </div>
                    ))}
                    {advisory.healthAdvisories.olderAdults.donts?.map((d, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-rose-300">
                        <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-400" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Asthmatics & Respiratory */}
              <div className="rounded-2xl border border-purple-500/30 bg-purple-950/15 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
                      <Activity className="h-4 w-4" />
                    </div>
                    <h5 className="text-sm font-bold text-purple-300">Asthmatics & Sensitive Groups</h5>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-200">
                    {advisory.healthAdvisories.respiratoryAndHeart.callout}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs">
                    {advisory.healthAdvisories.respiratoryAndHeart.dos?.map((d, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-emerald-300">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-400" />
                        <span>{d}</span>
                      </div>
                    ))}
                    {advisory.healthAdvisories.respiratoryAndHeart.donts?.map((d, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-rose-300">
                        <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-400" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Outdoor Workers */}
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/15 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300">
                      <HardHat className="h-4 w-4" />
                    </div>
                    <h5 className="text-sm font-bold text-cyan-300">Outdoor Workers & Drivers</h5>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-200">
                    {advisory.healthAdvisories.outdoorWorkers.callout}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs">
                    {advisory.healthAdvisories.outdoorWorkers.dos?.map((d, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-emerald-300">
                        <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-400" />
                        <span>{d}</span>
                      </div>
                    ))}
                    {advisory.healthAdvisories.outdoorWorkers.donts?.map((d, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-rose-300">
                        <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-400" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Tips & Indoor Air Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
                Everyday Actionable Tips for Households
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {advisory.actionableTips?.map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5" /> Indoor Air Quality Protection
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {advisory.indoorAirRecommendations?.map((rec, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Transit Notice & Emergency Helpline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl bg-slate-950 border border-slate-800/80 p-3 flex items-start space-x-2 text-xs text-slate-300">
              <Bus className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">School & Commute Travel:</span>
                <span className="text-slate-400">{advisory.schoolAndCommuteNotice}</span>
              </div>
            </div>

            <div className="rounded-xl bg-rose-950/40 border border-rose-800/50 p-3 flex items-start space-x-2 text-xs text-rose-200">
              <PhoneCall className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-rose-300 block">Emergency Medical Support:</span>
                <span>{advisory.emergencyHelplineNotice}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-xs text-slate-400">
          Select your target language and click "Generate Multilingual Card" to create the citizen advisory.
        </div>
      )}
    </div>
  );
}
