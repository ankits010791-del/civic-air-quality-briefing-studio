export interface SanitizationResult {
  sanitizedData: string;
  detectedFormat: 'csv' | 'json' | 'tsv' | 'plaintext';
  totalLines: number;
  byteSize: number;
  threatsNeutralized: string[];
  isTruncated: boolean;
}

const INJECTION_PATTERNS = [
  /\[\s*system(?:\s*instruction)?\s*\]/gi,
  /ignore\s+(?:all\s+)?(?:previous|prior)\s+instructions/gi,
  /disregard\s+(?:all\s+)?(?:previous|prior)\s+rules/gi,
  /you\s+are\s+now\s+(?:a|an)\s+/gi,
  /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
  /javascript\s*:/gi,
  /\bexec\s*\(/gi,
  /\{\{\s*constructor\s*\.[\s\S]*?\}\}/gi,
];

/**
 * Robust input sanitizer and context-limit guard for raw atmospheric telemetry.
 * Neutralizes prompt injections, strips dangerous control characters,
 * and defends against LLM denial-of-service / hallucination risks.
 */
export function sanitizeRawInput(
  rawInput: string,
  options?: {
    maxBytes?: number;
    maxLines?: number;
  }
): SanitizationResult {
  const maxBytes = options?.maxBytes || 25000;
  const maxLines = options?.maxLines || 150;

  const threatsNeutralized: string[] = [];
  let cleaned = rawInput || '';

  // 1. Strip null bytes and non-printable control characters (except newline, tab, carriage return)
  const hadControlChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(cleaned);
  if (hadControlChars) {
    cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    threatsNeutralized.push('Sanitized dangerous non-printable ASCII control characters.');
  }

  // 2. Neutralize Prompt Injection attempts
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(cleaned)) {
      cleaned = cleaned.replace(pattern, '[SANITIZED_INPUT_TAG]');
      threatsNeutralized.push(`Neutralized adversarial instruction pattern: ${pattern.toString()}`);
    }
  }

  // 3. Format Detection
  let detectedFormat: 'csv' | 'json' | 'tsv' | 'plaintext' = 'plaintext';
  const trimmed = cleaned.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    detectedFormat = 'json';
  } else if (trimmed.includes('\t')) {
    detectedFormat = 'tsv';
  } else if (trimmed.includes(',')) {
    detectedFormat = 'csv';
  }

  // 4. Context Overflow & Truncation Protection
  let isTruncated = false;
  const lines = cleaned.split(/\r?\n/);
  let finalLines = lines;

  if (lines.length > maxLines) {
    finalLines = lines.slice(0, maxLines);
    isTruncated = true;
    threatsNeutralized.push(
      `Input truncated from ${lines.length} lines to ${maxLines} lines to prevent LLM context saturation.`
    );
  }

  let finalString = finalLines.join('\n');
  const byteLength = new Blob([finalString]).size;

  if (byteLength > maxBytes) {
    finalString = finalString.slice(0, maxBytes);
    isTruncated = true;
    threatsNeutralized.push(
      `Input payload truncated to ${maxBytes} bytes to ensure deterministic reasoning.`
    );
  }

  return {
    sanitizedData: finalString,
    detectedFormat,
    totalLines: finalLines.length,
    byteSize: byteLength,
    threatsNeutralized,
    isTruncated,
  };
}
