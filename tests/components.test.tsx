import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PersonaSelector } from '@/components/PersonaSelector';
import { TraceabilityModal } from '@/components/TraceabilityModal';
import { SettingsModal } from '@/components/SettingsModal';
import { ActionCardsGrid } from '@/components/ActionCardsGrid';
import { ActionCard, TraceEvidence } from '@/lib/types';

describe('UI Accessibility & Interaction Tests', () => {
  it('PersonaSelector should render all 4 personas including Gig Worker and support keyboard navigation', () => {
    const handleSelect = vi.fn();
    const handleGenerate = vi.fn();

    render(
      <PersonaSelector
        selectedPersona="principal"
        onSelectPersona={handleSelect}
        onGenerateBrief={handleGenerate}
        isLoading={false}
        hasAnalysis={true}
      />
    );

    // Check all roles rendered
    expect(screen.getByText(/School Principal/i)).toBeInTheDocument();
    expect(screen.getByText(/Housing Society/i)).toBeInTheDocument();
    expect(screen.getByText(/Municipal/i)).toBeInTheDocument();
    expect(screen.getByText(/Gig Worker & Delivery Fleet Dispatcher/i)).toBeInTheDocument();

    // Verify keyboard navigation on gig worker persona card
    const gigCard = screen.getByRole('radio', { name: /Gig Worker/i });
    expect(gigCard).toHaveAttribute('tabIndex', '0');

    fireEvent.keyDown(gigCard, { key: 'Enter', code: 'Enter' });
    expect(handleSelect).toHaveBeenCalledWith('gig_dispatch');
  });

  it('TraceabilityModal should be accessible with role="dialog" and display verbatim raw snippet', () => {
    const handleClose = vi.fn();
    const mockEvidence: TraceEvidence = {
      sourceRowIds: ['ROW-04', 'ROW-07'],
      observedMetric: 'PM2.5 reached 214.6 µg/m³',
      rawEvidenceSnippets: ['2025-11-14 08:15:00,WRD-04-A,Sector 4 School,PM2.5,214.6,ug/m3'],
      ruleTriggered: 'NAAQS 24h Threshold Surpassed',
      confidence: 0.98,
      rationale: 'Direct violation of particulate standard.',
    };

    render(
      <TraceabilityModal
        isOpen={true}
        onClose={handleClose}
        title="Immediate Outdoor Recess Cancellation"
        domain="Child Safety"
        traceEvidence={mockEvidence}
      />
    );

    // Check ARIA semantics
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('ROW-04')).toBeInTheDocument();
    expect(screen.getByText('ROW-07')).toBeInTheDocument();
    expect(screen.getAllByText(/214.6/i).length).toBeGreaterThan(0);

    // Close button has accessible name
    const closeBtn = screen.getByRole('button', { name: /Close Trace Inspector/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('SettingsModal should render accessible dialog and input controls', () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();

    render(
      <SettingsModal
        isOpen={true}
        onClose={handleClose}
        customApiKey="test-key-12345"
        onSaveApiKey={handleSave}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    const input = screen.getByLabelText(/Google Gemini API Key/i);
    expect(input).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close settings dialog/i });
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });

  it('ActionCardsGrid should render action cards and trigger trace modal with accessible button', () => {
    const handleOpenTrace = vi.fn();
    const mockAction: ActionCard = {
      id: 'act-1',
      persona: 'gig_dispatch',
      title: 'Smog Corridor Delivery Reroute',
      priority: 'CRITICAL_NOW',
      targetDomain: 'Mobility & Labor Welfare',
      actionHeadline: 'Divert Delivery Couriers Away From Sector 7 Industrial Corridor',
      detailedProtocol: ['Broadcast route alert', 'Pause dispatch in Sector 7'],
      operationalWindow: 'Immediate (0-30 mins)',
      resourceRequirements: ['Fleet Telematics API', 'N95 Respirators'],
      expectedImpact: '45% reduction in particulate inhalation for active couriers',
      traceEvidence: {
        sourceRowIds: ['ROW-02'],
        observedMetric: 'PM2.5 exceeded 285 µg/m³',
        rawEvidenceSnippets: ['Sector 7 Industrial Area,PM2.5,0.285,ppm'],
        ruleTriggered: 'Outdoor Labor Limit Exceeded',
        confidence: 0.96,
        rationale: 'Severe particulate spike requires route diversion.',
      },
      gigWorkerContext: {
        shiftExposureCapHours: 3,
        recommendedRestIntervalMinutes: 45,
        safeCorridorGuidance: 'Reroute via Western Ring Road',
        protectiveEquipmentMandate: 'Mandatory N95 mask checkpoint',
      },
    };

    render(<ActionCardsGrid actions={[mockAction]} onOpenTrace={handleOpenTrace} />);

    expect(screen.getByText(/Divert Delivery Couriers/i)).toBeInTheDocument();
    expect(screen.getByText(/3 Hours Max/i)).toBeInTheDocument();
    expect(screen.getByText(/45 Mins Recovery/i)).toBeInTheDocument();

    const traceBtn = screen.getByRole('button', { name: /Trace source data/i });
    expect(traceBtn).toBeInTheDocument();
    fireEvent.click(traceBtn);
    expect(handleOpenTrace).toHaveBeenCalledWith(mockAction);
  });
});
