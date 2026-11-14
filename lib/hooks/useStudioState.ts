'use client';

/**
 * useStudioState — Custom React hook that centralises all studio state and
 * async Gemini operations, keeping the main page component lean and focused
 * purely on rendering. Each operation returns a Promise so callers can await
 * or chain if needed.
 */

import { useState, useEffect, useCallback } from 'react';
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

// ─── Tab types ────────────────────────────────────────────────────────────────

export type MainTab = 'ingestion' | 'briefs' | 'compare' | 'dual_output';
export type DualOutputSubTab = 'internal' | 'citizen';

export interface TraceModalState {
  isOpen: boolean;
  title: string;
  domain?: string;
  traceEvidence: TraceEvidence | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useStudioState() {
  // ── Navigation & UI ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<MainTab>('ingestion');
  const [dualOutputSubTab, setDualOutputSubTab] = useState<DualOutputSubTab>('internal');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');

  // ── Core Data ────────────────────────────────────────────────────────────
  const [rawData, setRawData] = useState<string>(MESSY_MUNICIPAL_CSV);
  const [analysis, setAnalysis] = useState<BriefingAnalysis | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('principal');
  const [actionCards, setActionCards] = useState<ActionCard[]>([]);
  const [internalBriefingNote, setInternalBriefingNote] = useState<InternalBriefingNote | null>(null);
  const [citizenAdvisory, setCitizenAdvisory] = useState<CitizenAdvisory | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [savedSnapshots, setSavedSnapshots] = useState<HistoricalSnapshot[]>([]);

  // ── Traceability Modal ───────────────────────────────────────────────────
  const [traceModal, setTraceModal] = useState<TraceModalState>({
    isOpen: false,
    title: '',
    traceEvidence: null,
  });

  // ── Loading & Error ──────────────────────────────────────────────────────
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [isGeneratingAdvisory, setIsGeneratingAdvisory] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── Persist API key in localStorage ─────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('civic_gemini_api_key');
      if (savedKey) setCustomApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = useCallback((key: string) => {
    setCustomApiKey(key);
    if (typeof window !== 'undefined') {
      key
        ? localStorage.setItem('civic_gemini_api_key', key)
        : localStorage.removeItem('civic_gemini_api_key');
    }
  }, []);

  // ── Helper: build common auth headers ───────────────────────────────────
  const authHeaders = useCallback(
    (): Record<string, string> => (customApiKey ? { 'x-gemini-api-key': customApiKey } : {}),
    [customApiKey]
  );

  // ── 1. Data Normalisation ────────────────────────────────────────────────
  const handleAnalyzeData = useCallback(async () => {
    if (!rawData.trim()) return;
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ rawData, customApiKey: customApiKey || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to normalize atmospheric feed.');

      setAnalysis(data.analysis);
      await triggerPersonaBriefGeneration(data.analysis, selectedPersona);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with Gemini.');
    } finally {
      setIsAnalyzing(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData, customApiKey, selectedPersona]);

  // ── 2. Role-Based Action Intelligence ───────────────────────────────────
  const triggerPersonaBriefGeneration = useCallback(
    async (currentAnalysis: BriefingAnalysis, persona: PersonaType) => {
      setIsGeneratingBrief(true);
      setErrorMessage(null);

      try {
        const res = await fetch('/api/brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({
            analysis: currentAnalysis,
            persona,
            customApiKey: customApiKey || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to generate persona actions.');

        setActionCards(data.actions || []);
        if (data.internalBriefingNote) setInternalBriefingNote(data.internalBriefingNote);
      } catch (err: any) {
        setErrorMessage(err.message || 'Error generating role-based action intelligence.');
      } finally {
        setIsGeneratingBrief(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customApiKey]
  );

  const handleGenerateBriefForPersona = useCallback(() => {
    if (analysis) triggerPersonaBriefGeneration(analysis, selectedPersona);
  }, [analysis, selectedPersona, triggerPersonaBriefGeneration]);

  // ── 3. Longitudinal Delta Comparison ────────────────────────────────────
  const handleRunComparison = useCallback(
    async (historical: HistoricalSnapshot) => {
      if (!analysis) return;
      setIsComparing(true);
      setErrorMessage(null);

      try {
        const res = await fetch('/api/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({
            currentAnalysis: analysis,
            historicalSnapshot: historical,
            customApiKey: customApiKey || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to run longitudinal comparison.');
        setComparisonResult(data.comparison);
      } catch (err: any) {
        setErrorMessage(err.message || 'Error comparing snapshots.');
      } finally {
        setIsComparing(false);
      }
    },
    [analysis, customApiKey, authHeaders]
  );

  const handleSaveCurrentAsSnapshot = useCallback(
    (name: string) => {
      if (!analysis) return;
      const snap: HistoricalSnapshot = {
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
      setSavedSnapshots((prev) => [snap, ...prev]);
    },
    [analysis]
  );

  // ── 4. Multilingual Citizen Advisory ────────────────────────────────────
  const handleGenerateAdvisory = useCallback(
    async (language: string, readingLevel: string) => {
      if (!analysis) return;
      setIsGeneratingAdvisory(true);
      setErrorMessage(null);

      try {
        const res = await fetch('/api/advisory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
          body: JSON.stringify({
            analysis,
            language,
            readingLevel,
            customApiKey: customApiKey || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to generate citizen advisory.');
        setCitizenAdvisory(data.advisory);
      } catch (err: any) {
        setErrorMessage(err.message || 'Error generating advisory.');
      } finally {
        setIsGeneratingAdvisory(false);
      }
    },
    [analysis, customApiKey, authHeaders]
  );

  // ── Traceability helpers ─────────────────────────────────────────────────
  const openTraceModal = useCallback(
    (title: string, evidence: TraceEvidence, domain?: string) => {
      setTraceModal({ isOpen: true, title, domain, traceEvidence: evidence });
    },
    []
  );

  const closeTraceModal = useCallback(() => {
    setTraceModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    // UI / navigation
    activeTab,
    setActiveTab,
    dualOutputSubTab,
    setDualOutputSubTab,
    isSettingsOpen,
    setIsSettingsOpen,
    customApiKey,
    handleSaveApiKey,

    // Core data
    rawData,
    setRawData,
    analysis,
    selectedPersona,
    setSelectedPersona,
    actionCards,
    internalBriefingNote,
    citizenAdvisory,
    comparisonResult,
    savedSnapshots,

    // Traceability
    traceModal,
    openTraceModal,
    closeTraceModal,

    // Loading & errors
    isAnalyzing,
    isGeneratingBrief,
    isComparing,
    isGeneratingAdvisory,
    errorMessage,
    setErrorMessage,

    // Actions
    handleAnalyzeData,
    handleGenerateBriefForPersona,
    triggerPersonaBriefGeneration,
    handleRunComparison,
    handleSaveCurrentAsSnapshot,
    handleGenerateAdvisory,
  };
}
