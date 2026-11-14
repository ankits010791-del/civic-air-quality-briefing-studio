import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { extractCleanJson, getGeminiApiKey } from '@/lib/gemini';

describe('Gemini Utility & JSON Extraction Suite', () => {
  it('should parse standard clean JSON string correctly', () => {
    const raw = JSON.stringify({ briefingId: 'brief-001', averageAqi: 185 });
    const parsed = extractCleanJson<{ briefingId: string; averageAqi: number }>(raw);
    expect(parsed.briefingId).toBe('brief-001');
    expect(parsed.averageAqi).toBe(185);
  });

  it('should strip markdown ```json codeblock fences safely', () => {
    const rawWithFences = '```json\n{\n  "status": "success",\n  "count": 42\n}\n```';
    const parsed = extractCleanJson<{ status: string; count: number }>(rawWithFences);
    expect(parsed.status).toBe('success');
    expect(parsed.count).toBe(42);
  });

  it('should extract JSON even when surrounded by introductory or concluding LLM prose', () => {
    const noisyOutput = `Here is the requested technical atmospheric payload:
    {
      "dominantPollutant": "PM2.5",
      "severity": "Unhealthy"
    }
    Please let me know if you need municipal follow-up.`;
    const parsed = extractCleanJson<{ dominantPollutant: string; severity: string }>(noisyOutput);
    expect(parsed.dominantPollutant).toBe('PM2.5');
    expect(parsed.severity).toBe('Unhealthy');
  });

  it('should repair and parse JSON with trailing commas', () => {
    const withTrailingComma = '{"items": [1, 2, 3,], "active": true,}';
    const parsed = extractCleanJson<{ items: number[]; active: boolean }>(withTrailingComma);
    expect(parsed.items).toEqual([1, 2, 3]);
    expect(parsed.active).toBe(true);
  });

  it('should throw informative error on completely unparseable input', () => {
    expect(() => extractCleanJson('This is just plain text without any curly braces or brackets')).toThrow(
      /Failed to parse JSON response/
    );
  });
});

describe('API Key Resolution Suite', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should prioritize custom header key if valid length', () => {
    process.env.GEMINI_API_KEY = 'env-key-abcdef-123456';
    const customKey = 'custom-user-supplied-key-999999';
    expect(getGeminiApiKey(customKey)).toBe(customKey);
  });

  it('should fallback to process.env.GEMINI_API_KEY when no header is provided', () => {
    process.env.GEMINI_API_KEY = 'env-key-abcdef-123456';
    expect(getGeminiApiKey(null)).toBe('env-key-abcdef-123456');
    expect(getGeminiApiKey('')).toBe('env-key-abcdef-123456');
  });

  it('should return null if no key is configured anywhere', () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    expect(getGeminiApiKey(null)).toBeNull();
  });
});
