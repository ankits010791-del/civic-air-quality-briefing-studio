import { NextRequest, NextResponse } from 'next/server';
import { callGemini, extractCleanJson, getGeminiApiKey } from '@/lib/gemini';
import { BriefingAnalysis, ComparisonResult, HistoricalSnapshot } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      currentAnalysis,
      historicalSnapshot,
      customApiKey,
    }: {
      currentAnalysis: BriefingAnalysis;
      historicalSnapshot: HistoricalSnapshot;
      customApiKey?: string;
    } = body;

    if (!currentAnalysis || !historicalSnapshot) {
      return NextResponse.json(
        { error: 'Invalid input: both currentAnalysis and historicalSnapshot are required.' },
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

    const systemInstruction = `You are a Senior Atmospheric Modeler and Longitudinal Trend Analyst.
Your task is to perform an in-depth comparative delta analysis between a current air quality briefing snapshot and a previous historical baseline.

Tasks:
1. Compute overall AQI shift and percentage delta. Note whether air quality is worsening, improving, or stable.
2. Pollutant-level deltas: Calculate average percentage shifts for key pollutants (PM2.5, PM10, NO2, etc.).
3. Hotspot Migration: Identify spatial movement of peak pollution (e.g., if Sector 4 decreased but Sector 7 spiked, explain the spatial shift and potential physical mechanisms like wind drift, construction starts, or industrial night shifts).
4. AI Comparative Brief: Write a sharp, data-driven narrative explaining what changed between the two cycles and what municipal authorities should do differently.
5. Strategic Adjustments: 3-5 concrete policy or operational adjustments necessitated by the observed delta.

Output strictly valid JSON with this exact schema:
{
  "currentSnapshot": {
    "name": "Current Briefing Session",
    "timestamp": "ISO or formatted timestamp",
    "averageAqi": number,
    "peakAqi": number
  },
  "historicalSnapshot": {
    "name": "Historical Baseline Name",
    "timestamp": "Historical timestamp",
    "averageAqi": number,
    "peakAqi": number
  },
  "overallAqiDelta": {
    "difference": number,
    "percentChange": number,
    "trend": "worsening" | "improving" | "stable",
    "summaryNarrative": "Clear summary sentence on the overall trajectory"
  },
  "pollutantDeltas": [
    {
      "pollutant": "PM2.5",
      "previousAvg": number,
      "currentAvg": number,
      "percentChange": number,
      "unit": "µg/m³",
      "status": "SURGE" | "ELEVATED" | "DECLINE" | "STABLE",
      "traceDetails": "Exact delta explanation"
    }
  ],
  "hotspotMigration": [
    {
      "area": "Sector Name",
      "previousAqi": number,
      "currentAqi": number,
      "statusChange": "Worsened / Improved / New Hotspot",
      "shiftAnalysis": "Detailed narrative of why this zone changed"
    }
  ],
  "aiComparativeBrief": "Comprehensive 3-paragraph comparative trend brief...",
  "strategicAdjustments": [
    "Adjustment 1",
    "Adjustment 2",
    "Adjustment 3"
  ]
}`;

    const prompt = `Compare these two air quality monitoring cycles and compute the exact environmental delta trends:

CURRENT SNAPSHOT:
- Time: ${currentAnalysis.generatedAt}
- Location: ${currentAnalysis.locationSummary}
- Overall AQI: ${currentAnalysis.averageAqi} (${currentAnalysis.overallCategory})
- Peak AQI: ${currentAnalysis.peakAqi} (Zone: ${currentAnalysis.peakZone})
- Dominant Pollutant: ${currentAnalysis.dominantPollutant}
- Active Hotspots: ${JSON.stringify(currentAnalysis.hotspots)}
- Sample Readings: ${JSON.stringify(currentAnalysis.normalizedReadings.slice(0, 15))}

HISTORICAL SNAPSHOT:
- Name: ${historicalSnapshot.name}
- Time: ${historicalSnapshot.timestamp}
- Location: ${historicalSnapshot.location}
- Overall AQI: ${historicalSnapshot.averageAqi}
- Peak AQI: ${historicalSnapshot.peakAqi}
- Dominant Pollutant: ${historicalSnapshot.dominantPollutant}
- Historical Hotspots: ${historicalSnapshot.hotspotAreas.join(', ')}
- Baseline Summary: ${historicalSnapshot.summary}

Return ONLY valid JSON.`;

    const rawResponse = await callGemini(prompt, apiKey, {
      systemInstruction,
      temperature: 0.2,
    });

    const comparisonData = extractCleanJson<ComparisonResult>(rawResponse);

    return NextResponse.json({
      success: true,
      comparison: comparisonData,
    });
  } catch (error: any) {
    console.error('Error in /api/compare:', error);
    return NextResponse.json(
      {
        error: error.message || 'An error occurred while computing comparative longitudinal trends.',
      },
      { status: 500 }
    );
  }
}
