# Security & Responsible Disclosure Policy

The **Civic Air Quality Briefing Studio** adheres to rigorous civic data protection and responsible disclosure standards.

## Security Practices Implemented
1. **Zero Secret Leakage:** No API keys or tokens are stored client-side or committed into the repository.
2. **Context-Limit Ingestion Sanitization:** Ingested CSV, TSV, and JSON streams pass through `lib/sanitizer.ts`, which enforces:
   - Automated detection and neutralization of Prompt Injection, Jailbreak, and DAN mode instructions.
   - Stripping of embedded HTML tags, scripts, and XSS attack vectors.
   - Cleansing of unprintable ASCII control characters.
   - Strict size bounds (25KB / 150 lines) to prevent denial-of-service / context saturation.
3. **OWASP HTTP Security Headers:** Configured via `next.config.mjs` including:
   - `Content-Security-Policy (CSP)`
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - Stripped `X-Powered-By` server fingerprinting
4. **Endpoint Whitelisting:** Server-side route handlers enforce explicit enum validation for persona scopes (`principal`, `rwa`, `municipal`, `gig_dispatch`) and reading levels.

## Reporting a Vulnerability
If you discover a security vulnerability in this project, please report it to our engineering maintainers at `security@civicair.gov`.
