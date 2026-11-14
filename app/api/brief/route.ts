import { NextRequest, NextResponse } from 'next/server';
import { callGemini, extractCleanJson, getGeminiApiKey } from '@/lib/gemini';
import { ActionCard, BriefingAnalysis, InternalBriefingNote, PersonaType } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      analysis,
      persona,
      customApiKey,
    }: { analysis: BriefingAnalysis; persona: PersonaType; customApiKey?: string } = body;

    if (!analysis || !persona) {
      return NextResponse.json(
        { error: 'Invalid input: both analysis data and persona type are required.' },
        { status: 400 }
      );
    }

    const apiKey = getGeminiApiKey(customApiKey || req.headers.get('x-gemini-api-key'));
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'Missing Gemini API Key. Please configure GEMINI_API_KEY in your .env.local file or supply it via the Studio Settings dialog.',
        },
        { status: 401 }
      );
    }

    const personaDescriptions: Record<PersonaType, string> = {
      principal:
        'School Principal / Educational Administrator. Responsibilities: student health safeguards, outdoor athletic/recess cancellations, air filtration/HEPA deployment in classrooms, ventilation management, vulnerable student tracking (asthma/allergies), parent notification.',
      rwa:
        'Housing Society / Resident Welfare Association (RWA) Manager. Responsibilities: diesel generator (DG) set running curbs, leaf/waste open burning prevention, construction dust netting and water misting, vulnerable elderly resident advisories, parking lot and basement ventilation.',
      municipal:
        'Ward / Municipal Environmental Enforcement Officer. Responsibilities: mechanized road sweeping routes, water sprinkler truck dispatch, industrial boiler/smokestack inspection mobilization, dust suppression compliance at civil work sites, commercial diesel vehicle idling enforcement.',
      gig_dispatch:
        'Gig Worker & Delivery Fleet Dispatcher / Outdoor Labor Coordinator. Responsibilities: app-based rider cumulative particulate exposure budgets, dynamic delivery corridor rerouting avoiding severe smog canyons, mandatory 45-minute clean-air rest pauses, N95 respirator replenishment, and algorithmic dispatch slowdowns during peak AQI spikes.',
    };

    const systemInstruction = `You are an elite Civic Emergency Environmental Response Architect.
You translate normalized air quality sensor feeds into rigorous, high-impact, role-based action plans for key civic actors and labor coordinators.

Selected Persona: ${persona.toUpperCase()}
Persona Scope: ${personaDescriptions[persona] || personaDescriptions.municipal}

CRITICAL REQUIREMENT: TRACEABILITY & EVIDENCE MAPPING
Every action recommendation MUST be explicitly grounded in the specific sensor readings from the provided dataset.
You must populate the "traceEvidence" field for each action with:
- "sourceRowIds": array of exact row IDs (e.g. ["ROW-1", "ROW-3"]) that triggered this action.
- "observedMetric": e.g. "PM2.5 concentration reached 214.6 µg/m³ (Severe category)".
- "rawEvidenceSnippets": direct quotation from raw readings.
- "ruleTriggered": civic environmental safety threshold (e.g., "NAAQS 24-hr PM2.5 > 60 µg/m³; Outdoor labor safety cap triggered at AQI > 250").
- "rationale": exact scientific justification connecting the data to the action.

If persona is "gig_dispatch", populate "gigWorkerContext" with:
- "shiftExposureCapHours": recommended max continuous outdoor shift (e.g. 2, 3, or 4 hours).
- "recommendedRestIntervalMinutes": required clean air recovery break (e.g. 30 or 45 mins).
- "safeCorridorGuidance": arterial route recommendations avoiding hotspots.
- "protectiveEquipmentMandate": e.g. "Fit-tested N95/FFP2 respirator with particulate seal".

Also generate the structured "internalBriefingNote" for municipal coordination and technical records.

Output strictly valid JSON with this exact schema:
{
  "actions": [
    {
      "id": "act-1",
      "persona": "${persona}",
      "title": "Short title",
      "priority": "CRITICAL_NOW" | "HIGH_ALERT" | "MEDIUM_ADVISORY" | "ROUTINE_MONITORING",
      "targetDomain": "Domain area",
      "actionHeadline": "Clear, directive headline",
      "detailedProtocol": ["Step 1", "Step 2", "Step 3"],
      "operationalWindow": "e.g. Immediate (0-30 mins) or Next 2-4 hours",
      "resourceRequirements": ["List of resources/gear needed"],
      "expectedImpact": "Quantifiable or qualitative risk reduction",
      "traceEvidence": {
        "sourceRowIds": ["ROW-1"],
        "observedMetric": "Metric summary",
        "rawEvidenceSnippets": ["Raw quote from dataset"],
        "ruleTriggered": "Threshold violated",
        "confidence": 0.95,
        "rationale": "Why this data row demands this specific intervention"
      },
      "gigWorkerContext": {
        "shiftExposureCapHours": 3,
        "recommendedRestIntervalMinutes": 45,
        "safeCorridorGuidance": "Reroute riders via Western Bypass to avoid Sector 7 & Sector 11 industrial spikes",
        "protectiveEquipmentMandate": "Mandatory N95/FFP2 mask distribution at hub checkpoints"
      }
    }
  ],
  "internalBriefingNote": {
    "briefingTitle": "Official Technical Air Quality Directive",
    "issuedFor": "Ward & Sector Administration",
    "classificationLevel": "URGENT - ADMINISTRATIVE ACTION REQUIRED",
    "timestamp": "ISO timestamp",
    "executiveSummary": "Analytical executive summary for decision-makers",
    "meteorologicalSynergyNotes": "Notes on inversion, dispersion, and wind factors",
    "complianceTable": [
      {
        "pollutant": "PM2.5",
        "observed24hAvg": number,
        "whoStandard": 15,
        "nationalStandard": 60,
        "unit": "µg/m³",
        "complianceRatio": number,
        "status": "COMPLIANT" | "BORDERLINE" | "EXCEEDED" | "SEVERELY_EXCEEDED"
      }
    ],
    "spatialHotspots": [
      {
        "sector": "Sector name",
        "aqi": number,
        "primaryContributor": "Pollutant or suspected activity",
        "dispatchDirective": "Specific team to deploy",
        "traceRow": "ROW-X"
      }
    ],
    "departmentalDirectives": [
      {
        "department": "e.g. Directorate of Education / Transport / Solid Waste / Labor Welfare",
        "directive": "Exact administrative order",
        "enforcementAuthority": "Officer role",
        "deadline": "e.g. 10:00 AM Today"
      }
    ],
    "fullTechnicalReportMarkdown": "# Technical Air Quality Briefing\\n\\nComprehensive analysis..."
  }
}`;

    const prompt = `Based on the following normalized air quality analysis, generate prioritized role-based action recommendations for persona "${persona}" and construct the comprehensive internal technical briefing note:

Summary Data:
- Location: ${analysis.locationSummary}
- Overall AQI: ${analysis.averageAqi} (${analysis.overallCategory})
- Peak AQI: ${analysis.peakAqi} at ${analysis.peakZone}
- Dominant Pollutant: ${analysis.dominantPollutant}
- Data Health Score: ${analysis.dataIntegrityAudit.overallDataHealthScore}%

Normalized Sensor Records (use these exact rowIds for traceEvidence):
${JSON.stringify(analysis.normalizedReadings.slice(0, 25), null, 2)}

Data Anomalies & Gaps:
${JSON.stringify(analysis.dataIntegrityAudit.anomalies, null, 2)}

Return ONLY valid JSON.`;

    const rawResponse = await callGemini(prompt, apiKey, {
      systemInstruction,
      temperature: 0.25,
    });

    const parsedData = extractCleanJson<{
      actions: ActionCard[];
      internalBriefingNote: InternalBriefingNote;
    }>(rawResponse);

    return NextResponse.json({
      success: true,
      actions: parsedData.actions,
      internalBriefingNote: parsedData.internalBriefingNote,
    });
  } catch (error: any) {
    console.error('Error in /api/brief:', error);
    return NextResponse.json(
      {
        error: error.message || 'An error occurred while generating role-based action intelligence.',
      },
      { status: 500 }
    );
  }
}
