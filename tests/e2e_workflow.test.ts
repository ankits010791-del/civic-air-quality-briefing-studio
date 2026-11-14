import { describe, it, expect } from 'vitest';
import { MESSY_MUNICIPAL_CSV } from '@/lib/sample-data';
import { sanitizeRawInput } from '@/lib/sanitizer';

describe('Workflow & End-to-End Integrity Verification', () => {
  it('should verify sample dataset contains representative municipal anomalies', () => {
    expect(MESSY_MUNICIPAL_CSV).toContain('ppm'); // unit mismatch
    expect(MESSY_MUNICIPAL_CSV).toContain('-999'); // error code
    expect(MESSY_MUNICIPAL_CSV).toContain('Sector');
  });

  it('should clean sample dataset without dropping valid sensor coordinates', () => {
    const result = sanitizeRawInput(MESSY_MUNICIPAL_CSV);
    expect(result.detectedFormat).toBe('csv');
    expect(result.totalLines).toBeGreaterThan(5);
    expect(result.sanitizedData).toContain('Sector 4 North Primary School');
    expect(result.sanitizedData).toContain('Sector 7 Industrial Area');
  });

  it('should enforce strict security isolation when given extreme script payloads', () => {
    const payload = `<script type="text/javascript">document.cookie="stolen";</script>
<img src="x" onerror="alert(1)" />
eval("process.exit(1)");
PM2.5,120.0,ug/m3`;

    const sanitized = sanitizeRawInput(payload);
    expect(sanitized.sanitizedData).not.toContain('<script');
    expect(sanitized.sanitizedData).not.toContain('onerror=');
    expect(sanitized.sanitizedData).not.toContain('eval(');
    expect(sanitized.sanitizedData).toContain('PM2.5,120.0,ug/m3');
  });
});
