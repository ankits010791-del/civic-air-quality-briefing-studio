import { NextRequest, NextResponse } from 'next/server';
import { callGemini, extractCleanJson, getGeminiApiKey } from '@/lib/gemini';
import { BriefingAnalysis, CitizenAdvisory } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      analysis,
      language = 'en',
      readingLevel = 'General Public',
      customApiKey,
    }: {
      analysis: BriefingAnalysis;
      language?: string;
      readingLevel?: 'General Public' | 'Simple (5th Grade)' | 'Technical';
      customApiKey?: string;
    } = body;

    if (!analysis) {
      return NextResponse.json(
        { error: 'Invalid input: analysis data is required to construct a citizen advisory.' },
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

    const languageNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिन्दी)',
      es: 'Spanish (Español)',
      mr: 'Marathi (मराठी)',
      bn: 'Bengali (বাংলা)',
      fr: 'French (Français)',
    };

    const allowedReadingLevels = ['General Public', 'Simple (5th Grade)', 'Technical'];
    const sanitizedReadingLevel = allowedReadingLevels.includes(readingLevel) ? readingLevel : 'General Public';
    const sanitizedLanguage = String(language).replace(/[^a-zA-Z-]/g, '').slice(0, 10) || 'en';
    const targetLangName = languageNames[sanitizedLanguage] || sanitizedLanguage;

    const systemInstruction = `You are an elite Public Health Communication Director and Multilingual Citizen Health Advocate.
Your mission is to translate complex atmospheric pollution data into an empathetic, clear, life-saving Citizen Advisory Card.

Language Requirement:
- Output MUST be generated in: ${targetLangName}.
- All titles, callouts, warnings, dos, and donts must be translated accurately and naturally into this language.
- (Only standard keys in the JSON schema remain in English; all string values MUST be in ${targetLangName}).

Reading Level: ${readingLevel}
- If "Simple (5th Grade)": Use simple sentences, direct metaphors, zero academic jargon. Focus on immediate physical actions (wear mask, close windows, drink water).
- If "General Public": Conversational, clear, empathetic civic communication.
- If "Technical": Include health mechanism explanations (fine particulate alveolar penetration, inflammatory response).

Vulnerable Groups Focus:
You must provide distinct, specialized guidance for:
1. Children (developing lungs, school sports, recess)
2. Older Adults (cardiovascular strain, morning walk precautions)
3. Asthmatics & Sensitive Populations (inhalers, peak exposure avoidance)
4. Outdoor Workers (delivery agents, construction workers, street vendors, traffic police - N95 mask usage, hydration)

Output strictly valid JSON with this exact schema:
{
  "headline": "Empathetic, clear alert headline",
  "subheadline": "Brief context on today's air quality",
  "language": "${targetLangName}",
  "languageCode": "${language}",
  "readingLevel": "${readingLevel}",
  "currentAirCondition": {
    "aqiScore": ${analysis.averageAqi},
    "statusBadge": "Category label in ${targetLangName}",
    "colorHex": "#ef4444",
    "plainExplanation": "Clear, jargon-free explanation of what breathing today's air feels like"
  },
  "healthAdvisories": {
    "children": {
      "callout": "Crucial headline warning for parents and teachers",
      "dos": ["Do step 1", "Do step 2"],
      "donts": ["Don't step 1", "Don't step 2"]
    },
    "olderAdults": {
      "callout": "Crucial headline warning for senior citizens",
      "dos": ["Do step 1", "Do step 2"],
      "donts": ["Don't step 1", "Don't step 2"]
    },
    "respiratoryAndHeart": {
      "callout": "Crucial headline for patients with asthma, COPD, or cardiac history",
      "dos": ["Do step 1", "Do step 2"],
      "donts": ["Don't step 1", "Don't step 2"]
    },
    "outdoorWorkers": {
      "callout": "Guidance for couriers, police, and field laborers",
      "dos": ["Do step 1", "Do step 2"],
      "donts": ["Don't step 1", "Don't step 2"]
    }
  },
  "actionableTips": [
    "Tip 1 for homes and individuals",
    "Tip 2",
    "Tip 3"
  ],
  "indoorAirRecommendations": [
    "HEPA filter guidelines",
    "Wet mopping over dry sweeping",
    "Ventilation timing"
  ],
  "schoolAndCommuteNotice": "Advisory for school trips and public transit passengers",
  "emergencyHelplineNotice": "Emergency medical advisory if breathing distress occurs"
}`;

    const prompt = `Convert the following air quality briefing into a citizen advisory in ${targetLangName} at reading level "${readingLevel}":

- Location: ${analysis.locationSummary}
- Average AQI: ${analysis.averageAqi} (${analysis.overallCategory})
- Peak AQI: ${analysis.peakAqi} (Hotspot: ${analysis.peakZone})
- Dominant Pollutant: ${analysis.dominantPollutant}
- Executive Context: ${analysis.executiveSummary}

Ensure the language is empathetic, direct, culturally resonant, and provides urgent protection for vulnerable populations.
Return ONLY valid JSON.`;

    const rawResponse = await callGemini(prompt, apiKey, {
      systemInstruction,
      temperature: 0.3,
    });

    const advisoryData = extractCleanJson<CitizenAdvisory>(rawResponse);

    return NextResponse.json({
      success: true,
      advisory: advisoryData,
    });
  } catch (error: any) {
    console.error('Error in /api/advisory:', error);
    return NextResponse.json(
      {
        error: error.message || 'An error occurred while generating the citizen advisory.',
      },
      { status: 500 }
    );
  }
}
