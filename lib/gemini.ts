import { GoogleGenAI } from '@google/genai';

/**
 * Retrieves the active Gemini API key from environment variables or custom request headers.
 */
export function getGeminiApiKey(customHeaderKey?: string | null): string | null {
  if (customHeaderKey && customHeaderKey.trim().length > 10) {
    return customHeaderKey.trim();
  }
  return process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;
}

/**
 * Extracts clean JSON from model output that might include markdown codeblocks or prefix text.
 */
export function extractCleanJson<T = any>(rawText: string): T {
  let cleaned = rawText.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '');
    cleaned = cleaned.replace(/\s*```$/i, '');
  }

  // Find the first '{' or '[' and the last '}' or ']'
  const firstCurly = cleaned.indexOf('{');
  const firstSquare = cleaned.indexOf('[');
  let startIdx = -1;
  let endIdx = -1;

  if (firstCurly !== -1 && (firstSquare === -1 || firstCurly < firstSquare)) {
    startIdx = firstCurly;
    endIdx = cleaned.lastIndexOf('}');
  } else if (firstSquare !== -1) {
    startIdx = firstSquare;
    endIdx = cleaned.lastIndexOf(']');
  }

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    cleaned = cleaned.substring(startIdx, endIdx + 1);
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (err: any) {
    // Attempt subtle repair for unescaped newlines or trailing commas
    try {
      const relaxed = cleaned
        .replace(/,\s*([}\]])/g, '$1') // remove trailing commas
        .replace(/[\u0000-\u0019]+/g, ' '); // remove weird control characters
      return JSON.parse(relaxed) as T;
    } catch {
      throw new Error(
        `Failed to parse JSON response from Gemini: ${err.message}. Raw excerpt: ${cleaned.slice(0, 300)}...`
      );
    }
  }
}

/**
 * Generates content using the official Google Generative AI SDK (@google/genai)
 * with the required gemini-3.8-flash model (with graceful fallback to gemini-2.5-flash if needed).
 */
export async function callGemini(
  prompt: string,
  apiKey: string,
  options?: {
    systemInstruction?: string;
    temperature?: number;
    model?: string;
  }
): Promise<string> {
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please set GEMINI_API_KEY in your environment or provide it in the Studio Settings.'
    );
  }

  const modelName = options?.model || 'gemini-3.8-flash';
  // Use v1beta so developer instruction (systemInstruction) and latest models are supported
  const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });

  try {
    const config: any = {};
    if (options?.systemInstruction) {
      config.systemInstruction = options.systemInstruction;
    }
    if (typeof options?.temperature === 'number') {
      config.temperature = options.temperature;
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: Object.keys(config).length > 0 ? config : undefined,
    });

    const text = response.text;
    if (!text) {
      throw new Error('Received an empty response from Gemini model.');
    }
    return text;
  } catch (error: any) {
    // If systemInstruction causes an issue on any edge endpoint, fallback to prepending it to prompt
    if (error?.message?.includes('Developer instruction is not enabled') && options?.systemInstruction) {
      const combinedPrompt = `[SYSTEM INSTRUCTION]\n${options.systemInstruction}\n\n[USER TASK]\n${prompt}`;
      const fallbackAi = new GoogleGenAI({ apiKey });
      const response = await fallbackAi.models.generateContent({
        model: modelName,
        contents: combinedPrompt,
      });
      const text = response.text;
      if (!text) throw new Error('Received empty response from fallback model.');
      return text;
    }

    // High-availability fallback if model encounters temporary 503 high demand, 429 rate limit, or model availability change
    if (
      (error?.message?.includes('503') ||
        error?.message?.includes('high demand') ||
        error?.message?.includes('429') ||
        error?.message?.includes('404') ||
        error?.message?.includes('not found') ||
        error?.message?.includes('no longer available') ||
        error?.message?.includes('RESOURCE_EXHAUSTED')) &&
      modelName !== 'gemini-2.5-flash'
    ) {
      console.warn(`[Gemini Fallback] ${modelName} encountered (${error.message}). Gracefully falling back to gemini-2.5-flash...`);
      try {
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: options?.systemInstruction ? { systemInstruction: options.systemInstruction } : undefined,
        });
        const text = fallbackResponse.text;
        if (!text) throw new Error('Received empty response from fallback model.');
        return text;
      } catch (fallbackErr: any) {
        console.warn(`[Gemini Fallback] gemini-2.5-flash also failed: ${fallbackErr.message}`);
      }
    }

    throw error;
  }
}
