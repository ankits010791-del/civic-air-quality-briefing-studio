import { NextRequest, NextResponse } from 'next/server';
import { callGemini, extractCleanJson, getGeminiApiKey } from '@/lib/gemini';
import { BriefingAnalysis } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60s timeout for comprehensive analysis

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawData, customApiKey } = body;

    if (!rawData || typeof rawData !== 'string' || rawData.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid input: rawData string is required and cannot be empty.' },
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

    const systemInstruction = `You are an elite Senior Atmospheric Environmental Scientist and Data Architect for the Civic Air Quality Briefing Studio.
Your mission is to parse raw, messy, inconsistent municipal and IoT air quality sensor feeds (which may mix units like ppm and µg/m³, carry malformed timestamps, negative error codes like -999, missing columns, or uncalibrated readings) into a strictly validated, normalized JSON structure.

Rules for normalization:
1. Timestamp: Parse inconsistent formats (ISO, DD/MM/YYYY, MM-DD-YYYY, 12h/24h) into standard ISO strings (YYYY-MM-DDTHH:mm:ssZ) or coherent readable time. If completely missing, note in anomalies and provide estimated chronological sequence.
2. Units & Values:
   - PM2.5 and PM10 should be normalized to µg/m³. If PM2.5 is provided in ppm (e.g., 0.285 ppm), convert using the standard ambient aerosol approximation (1 ppm ~ 1000 µg/m³ or accurate gas/particulate equivalent ~ 700-1000 µg/m³) and explicitly flag the conversion.
   - Detect sensor malfunction codes (e.g. -999, 9999, 0 flatline) and flag as corrupt/out-of-bounds.
3. Traceability:
   - Every single reading MUST retain a unique rowId ("ROW-1", "ROW-2", etc.) and the exact raw snippet ("rawSnippet") from the original text so decision-makers can audit the exact source.
4. AQI Equivalents & Categories:
   - Categorize AQI:
     - 0-50: "Good"
     - 51-100: "Moderate"
     - 101-200: "Poor"
     - 201-300: "Unhealthy"
     - 301-400: "Severe"
     - 401+: "Hazardous"
5. Data Integrity Audit:
   - Provide a granular audit of all data gaps, unit mismatches, corrupt rows, and sensor coverage states (ONLINE, DEGRADED, OFFLINE).
   - Score overall data health from 0 to 100.

Output MUST be strictly valid JSON matching this schema without any markdown formatting or commentary:
{
  "briefingId": "brief-xxxx",
  "generatedAt": "ISO timestamp",
  "locationSummary": "Summary of wards and zones represented",
  "averageAqi": number,
  "peakAqi": number,
  "peakZone": "Zone name",
  "dominantPollutant": "PM2.5" | "PM10" | "NO2" | "SO2" | "CO" | "O3",
  "overallCategory": "Good" | "Moderate" | "Poor" | "Unhealthy" | "Severe" | "Hazardous",
  "executiveSummary": "2-3 sentence high-level executive scientific overview",
  "hotspots": [
    {
      "zone": "Sector/Ward Name",
      "aqi": number,
      "dominantPollutant": string,
      "threatLevel": "Moderate" | "High" | "Severe" | "Critical",
      "traceRowId": "ROW-X"
    }
  ],
  "dataIntegrityAudit": {
    "totalInputRows": number,
    "validParsedRows": number,
    "corruptRowsCount": number,
    "normalizedUnitCount": number,
    "interpolatedFieldsCount": number,
    "overallDataHealthScore": number,
    "auditSummary": "Clear assessment of feed quality, gaps, and sensor reliability",
    "anomalies": [
      {
        "id": "anomaly-1",
        "rowId": "ROW-X",
        "sensorId": "string",
        "issueType": "UNIT_MISMATCH" | "CORRUPT_FORMAT" | "OUT_OF_BOUNDS" | "MISSING_FIELD" | "INCONSISTENT_TIMESTAMP" | "SENSOR_FLATLINE",
        "description": "string",
        "rawSnippet": "exact raw text",
        "actionTaken": "string describing whether value was converted, discarded, or flagged",
        "severity": "low" | "medium" | "high"
      }
    ],
    "sensorCoverage": [
      {
        "sensorId": "string",
        "location": "string",
        "status": "ONLINE" | "DEGRADED" | "OFFLINE",
        "readingsCount": number,
        "lastReadingTime": "string",
        "notes": "string"
      }
    ]
  },
  "normalizedReadings": [
    {
      "rowId": "ROW-1",
      "rawSnippet": "exact original line or json chunk",
      "timestamp": "standardized timestamp",
      "originalTimestamp": "original text timestamp",
      "location": "Sector or Station",
      "pollutant": "PM2.5" | "PM10" | "NO2" | "SO2" | "CO" | "O3" | "AQI",
      "rawValue": "original value",
      "normalizedValue": number,
      "standardUnit": "µg/m³" | "ppm" | "AQI",
      "aqiEquivalent": number,
      "category": "Good" | "Moderate" | "Poor" | "Unhealthy" | "Severe" | "Hazardous",
      "anomaliesFlagged": ["string describing any correction or flag"],
      "reliabilityScore": number
    }
  ]
}`;

    const prompt = `Analyze and normalize the following messy atmospheric monitoring raw dataset. Parse every row, identify every corrupt record or unit discrepancy, and provide full traceability links back to the source data rows:

\`\`\`
${rawData.slice(0, 15000)}
\`\`\`

Return ONLY the raw JSON object.`;

    const rawResponse = await callGemini(prompt, apiKey, {
      systemInstruction,
      temperature: 0.2, // low temperature for precise factual extraction
    });

    const parsedData = extractCleanJson<BriefingAnalysis>(rawResponse);

    return NextResponse.json({
      success: true,
      analysis: parsedData,
    });
  } catch (error: any) {
    console.error('Error in /api/analyze:', error);
    return NextResponse.json(
      {
        error: error.message || 'An error occurred while analyzing the raw data with Gemini.',
      },
      { status: 500 }
    );
  }
}
