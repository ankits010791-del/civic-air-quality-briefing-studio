'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  Users,
  GitCompare,
  FileSpreadsheet,
  HeartHandshake,
  AlertCircle,
  BarChart3,
  Layers,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { SettingsModal } from '@/components/SettingsModal';
import { DataUploader } from '@/components/DataUploader';
import { DataIntegrityAuditPanel } from '@/components/DataIntegrityAuditPanel';
import { PersonaSelector } from '@/components/PersonaSelector';
import { ActionCardsGrid } from '@/components/ActionCardsGrid';
import { TraceabilityModal } from '@/components/TraceabilityModal';
import { ComparisonStudio } from '@/components/ComparisonStudio';
import { InternalBriefingView } from '@/components/InternalBriefingView';
import { CitizenAdvisoryCard } from '@/components/CitizenAdvisoryCard';
import {
  ActionCard,
  BriefingAnalysis,
  CitizenAdvisory,
  ComparisonResult,
  HistoricalSnapshot,
  InternalBriefingNote,
  PersonaType,
  TraceEvidence,
} from '@/lib/types';
import { MESSY_MUNICIPAL_CSV } from '@/lib/sample-data';

export default function CivicBriefingStudio() {
  // Navigation & Settings State
  const [activeTab, setActiveTab] = useState<'ingestion' | 'briefs' | 'compare' | 'dual_output'>('ingestion');
  const [dualOutputSubTab, setDualOutputSubTab] = useState<'internal' | 'citizen'>('internal');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');

  // Core Data States
  const [rawData, setRawData] = useState<string>(MESSY_MUNICIPAL_CSV);
  const [analysis, setAnalysis] = useState<BriefingAnalysis | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('principal');
  const [actionCards, setActionCards] = useState<ActionCard[]>([]);
  const [internalBriefingNote, setInternalBriefingNote] = useState<InternalBriefingNote | null>(null);
  const [citizenAdvisory, setCitizenAdvisory] = useState<CitizenAdvisory | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [savedSnapshots, setSavedSnapshots] = useState<HistoricalSnapshot[]>([]);

  // Traceability Modal State
  const [traceModal, setTraceModal] = useState<{
    isOpen: boolean;
    title: string;
    domain?: string;
    traceEvidence: TraceEvidence | null;
  }>({
    isOpen: false,
    title: '',
    traceEvidence: null,
  });

  // Loading States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [isGeneratingAdvisory, setIsGeneratingAdvisory] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Restore custom API key from localStorage if saved
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('civic_gemini_api_key');
      if (savedKey) setCustomApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.setItem('civic_gemini_api_key', key);
      } else {
        localStorage.removeItem('civic_gemini_api_key');
      }
    }
  };

  // 1. Raw Ingestion & Gemini Normalization
  const handleAnalyzeData = async () => {
    if (!rawData.trim()) return;
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customApiKey ? { 'x-gemini-api-key': customApiKey } : {}),
        },
        body: JSON.stringify({
          rawData,
          customApiKey: customApiKey || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to normalize atmospheric feed.');
      }

      setAnalysis(data.analysis);
      triggerPersonaBriefGeneration(data.analysis, selectedPersona);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with Gemini.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. Role-Based Action Intelligence
  const triggerPersonaBriefGeneration = async (
    currentAnalysis: BriefingAnalysis,
    persona: PersonaType
  ) => {
    setIsGeneratingBrief(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/brief', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customApiKey ? { 'x-gemini-api-key': customApiKey } : {}),
        },
        body: JSON.stringify({
          analysis: currentAnalysis,
          persona,
          customApiKey: customApiKey || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate persona actions.');
      }

      setActionCards(data.actions || []);
      if (data.internalBriefingNote) {
        setInternalBriefingNote(data.internalBriefingNote);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error generating role-based action intelligence.');
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  const handleGenerateBriefForPersona = () => {
    if (!analysis) return;
    triggerPersonaBriefGeneration(analysis, selectedPersona);
  };

  // 3. Longitudinal Delta Comparison
  const handleRunComparison = async (historical: HistoricalSnapshot) => {
    if (!analysis) return;
    setIsComparing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customApiKey ? { 'x-gemini-api-key': customApiKey } : {}),
        },
        body: JSON.stringify({
          currentAnalysis: analysis,
          historicalSnapshot: historical,
          customApiKey: customApiKey || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to run longitudinal comparison.');
      }

      setComparisonResult(data.comparison);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error comparing snapshots.');
    } finally {
      setIsComparing(false);
    }
  };

  const handleSaveCurrentAsSnapshot = (name: string) => {
    if (!analysis) return;
    const newSnapshot: HistoricalSnapshot = {
      id: `snap-${Date.now()}`,
      name,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      location: analysis.locationSummary,
      averageAqi: analysis.averageAqi,
      peakAqi: analysis.peakAqi,
      dominantPollutant: analysis.dominantPollutant,
      totalSensors: analysis.normalizedReadings.length,
      summary: analysis.executiveSummary,
      hotspotAreas: analysis.hotspots.map((h) => h.zone),
    };
    setSavedSnapshots((prev) => [newSnapshot, ...prev]);
  };

  // 4. Multilingual Citizen Advisory Generation
  const handleGenerateAdvisory = async (language: string, readingLevel: string) => {
    if (!analysis) return;
    setIsGeneratingAdvisory(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/advisory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customApiKey ? { 'x-gemini-api-key': customApiKey } : {}),
        },
        body: JSON.stringify({
          analysis,
          language,
          readingLevel,
          customApiKey: customApiKey || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate citizen advisory.');
      }

      setCitizenAdvisory(data.advisory);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error generating advisory.');
    } finally {
      setIsGeneratingAdvisory(false);
    }
  };

  // Open Trace Modal
  const handleOpenTrace = (card: ActionCard) => {
    setTraceModal({
      isOpen: true,
      title: card.actionHeadline,
      domain: card.targetDomain,
      traceEvidence: card.traceEvidence,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        isAnalyzing={isAnalyzing || isGeneratingBrief || isComparing || isGeneratingAdvisory}
        hasData={!!analysis}
      />

      {/* Main Studio Container */}
      <main id="main-content" role="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 space-y-6">
        {/* Global Error Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start justify-between rounded-2xl bg-rose-950/80 border border-rose-700/80 p-4 text-xs text-rose-200 shadow-lg animate-in fade-in"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-400 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-bold text-rose-100">Operation Notice</p>
                <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
                {errorMessage.includes('Missing Gemini API Key') && (
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    aria-label="Open settings to enter Gemini API key"
                    className="mt-2 inline-flex items-center space-x-1 font-bold text-cyan-300 underline hover:text-cyan-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 rounded"
                  >
                    <span>Click here to open Settings and set your Gemini API Key</span>
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              aria-label="Dismiss error notice"
              className="text-rose-400 hover:text-white ml-2 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-rose-400 rounded"
            >
              ✕
            </button>
          </div>
        )}

        {/* Live Ambient Telemetry Banner (If analyzed) */}
        {analysis && (
          <section
            aria-label="Active Telemetry Summary"
            className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 p-4 shadow-xl"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300"
                  aria-hidden="true"
                >
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                      Active Telemetry Horizon
                    </span>
                    <span className="rounded-full bg-cyan-950 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-800">
                      Cycle Active
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {analysis.locationSummary}
                  </h3>
                </div>
              </div>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg AQI</span>
                  <span className="text-base font-black text-cyan-300">{analysis.averageAqi}</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Peak Zone</span>
                  <span className="text-base font-black text-rose-400">{analysis.peakAqi}</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Dominant</span>
                  <span className="text-base font-black text-emerald-400">{analysis.dominantPollutant}</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Data Health</span>
                  <span className="text-base font-black text-cyan-400">
                    {analysis.dataIntegrityAudit?.overallDataHealthScore}%
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab Navigation Menu with full ARIA semantics */}
        <div role="tablist" aria-label="Studio Functional Modules" className="border-b border-slate-800 flex overflow-x-auto no-scrollbar space-x-2">
          <button
            role="tab"
            id="tab-ingestion"
            aria-selected={activeTab === 'ingestion'}
            aria-controls="panel-ingestion"
            onClick={() => setActiveTab('ingestion')}
            className={`flex items-center space-x-2 pb-3 px-3 text-xs sm:text-sm font-semibold transition border-b-2 whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
              activeTab === 'ingestion'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="h-4 w-4" aria-hidden="true" />
            <span>1. Ingestion & Data Audit</span>
            {analysis && (
              <span className="rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 text-[10px]">
                Audited
              </span>
            )}
          </button>

          <button
            role="tab"
            id="tab-briefs"
            aria-selected={activeTab === 'briefs'}
            aria-controls="panel-briefs"
            onClick={() => setActiveTab('briefs')}
            className={`flex items-center space-x-2 pb-3 px-3 text-xs sm:text-sm font-semibold transition border-b-2 whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
              activeTab === 'briefs'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>2. Role-Based Action Intelligence</span>
            {actionCards.length > 0 && (
              <span className="rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 px-1.5 py-0.2 text-[10px]">
                {actionCards.length}
              </span>
            )}
          </button>

          <button
            role="tab"
            id="tab-compare"
            aria-selected={activeTab === 'compare'}
            aria-controls="panel-compare"
            onClick={() => setActiveTab('compare')}
            className={`flex items-center space-x-2 pb-3 px-3 text-xs sm:text-sm font-semibold transition border-b-2 whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
              activeTab === 'compare'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitCompare className="h-4 w-4" aria-hidden="true" />
            <span>3. Longitudinal Comparison</span>
            {comparisonResult && (
              <span className="rounded-full bg-purple-950 text-purple-400 border border-purple-800 px-1.5 py-0.2 text-[10px]">
                Delta
              </span>
            )}
          </button>

          <button
            role="tab"
            id="tab-dual-output"
            aria-selected={activeTab === 'dual_output'}
            aria-controls="panel-dual-output"
            onClick={() => setActiveTab('dual_output')}
            className={`flex items-center space-x-2 pb-3 px-3 text-xs sm:text-sm font-semibold transition border-b-2 whitespace-nowrap focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
              activeTab === 'dual_output'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-4 w-4" aria-hidden="true" />
            <span>4. Dual Output Studio</span>
          </button>
        </div>

        {/* Tab 1: Ingestion & Data Audit */}
        {activeTab === 'ingestion' && (
          <section id="panel-ingestion" role="tabpanel" aria-labelledby="tab-ingestion" className="space-y-6">
            <DataUploader
              rawData={rawData}
              setRawData={setRawData}
              onAnalyze={handleAnalyzeData}
              isLoading={isAnalyzing}
              error={errorMessage}
            />

            {analysis && (
              <DataIntegrityAuditPanel
                audit={analysis.dataIntegrityAudit}
                normalizedReadings={analysis.normalizedReadings}
              />
            )}
          </section>
        )}

        {/* Tab 2: Role-Based Action Intelligence Engine */}
        {activeTab === 'briefs' && (
          <section id="panel-briefs" role="tabpanel" aria-labelledby="tab-briefs" className="space-y-6">
            <PersonaSelector
              selectedPersona={selectedPersona}
              onSelectPersona={(persona) => {
                setSelectedPersona(persona);
                if (analysis) {
                  triggerPersonaBriefGeneration(analysis, persona);
                }
              }}
              onGenerateBrief={handleGenerateBriefForPersona}
              isLoading={isGeneratingBrief}
              hasAnalysis={!!analysis}
            />

            <ActionCardsGrid actions={actionCards} onOpenTrace={handleOpenTrace} />
          </section>
        )}

        {/* Tab 3: Longitudinal Comparison */}
        {activeTab === 'compare' && (
          <section id="panel-compare" role="tabpanel" aria-labelledby="tab-compare" className="space-y-6">
            <ComparisonStudio
              currentAnalysis={analysis}
              comparisonResult={comparisonResult}
              onRunComparison={handleRunComparison}
              onSaveCurrentAsSnapshot={handleSaveCurrentAsSnapshot}
              isLoading={isComparing}
              savedSnapshots={savedSnapshots}
            />
          </section>
        )}

        {/* Tab 4: Dual Output Studio */}
        {activeTab === 'dual_output' && (
          <section id="panel-dual-output" role="tabpanel" aria-labelledby="tab-dual-output" className="space-y-6">
            <div className="flex space-x-2 border-b border-slate-800 pb-2 no-print" role="tablist" aria-label="Dual Output View Selection">
              <button
                role="tab"
                aria-selected={dualOutputSubTab === 'internal'}
                aria-label="View Internal Technical Briefing Note for Municipal Committee"
                onClick={() => setDualOutputSubTab('internal')}
                className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition focus:outline-none focus:ring-1 focus:ring-cyan-500 ${
                  dualOutputSubTab === 'internal'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                <span>Internal Technical Briefing Note (Municipal)</span>
              </button>

              <button
                role="tab"
                aria-selected={dualOutputSubTab === 'citizen'}
                aria-label="View Multilingual Citizen Health Advisory Card"
                onClick={() => setDualOutputSubTab('citizen')}
                className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  dualOutputSubTab === 'citizen'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                <span>Citizen Health Advisory Card (Multilingual)</span>
              </button>
            </div>

            {dualOutputSubTab === 'internal' ? (
              <InternalBriefingView note={internalBriefingNote} />
            ) : (
              <CitizenAdvisoryCard
                advisory={citizenAdvisory}
                onGenerateAdvisory={handleGenerateAdvisory}
                isLoading={isGeneratingAdvisory}
                hasAnalysis={!!analysis}
              />
            )}
          </section>
        )}
      </main>

      {/* Global Traceability Modal */}
      <TraceabilityModal
        isOpen={traceModal.isOpen}
        onClose={() => setTraceModal((prev) => ({ ...prev, isOpen: false }))}
        title={traceModal.title}
        domain={traceModal.domain}
        traceEvidence={traceModal.traceEvidence}
      />

      {/* Studio Settings & API Key Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        customApiKey={customApiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Footer */}
      <footer role="contentinfo" className="border-t border-slate-800 bg-slate-950/80 py-4 text-center text-xs text-slate-500 no-print">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Civic Air Quality Briefing Studio • Hackathon Production Edition</span>
          <span>Powered by Google Gemini 2.5 Flash SDK (`@google/genai`)</span>
        </div>
      </footer>
    </div>
  );
}
