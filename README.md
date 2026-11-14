# Civic Air Quality Briefing Studio

[![AI-Powered](https://img.shields.io/badge/AI-Google%20Gemini%20API-06b6d4)](https://deepmind.google/technologies/gemini/)
[![Framework-Next.js 14](https://img.shields.io/badge/Framework-Next.js%2014-white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203.4-38bdf8)](https://tailwindcss.com/)
[![Testing](https://img.shields.io/badge/Testing-Vitest%20%7C%2020%20Passing-success)](https://vitest.dev/)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA%20Compliant-purple)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Security](https://img.shields.io/badge/Security-Sanitized%20%26%20Hardened-green)](https://owasp.org/)
[![Deployment-Vercel Ready](https://img.shields.io/badge/Deploy-Vercel%20Ready-black)](https://vercel.com/)

A production-grade, full-stack civic environmental intelligence application built for municipal leaders, school administrators, housing managers, and delivery fleet dispatchers. Powered by **Google Gemini** (`@google/genai`) to ingest raw telemetry, reconcile discordant units, detect sensor anomalies, synthesize role-specific interventions, and generate multilingual citizen health advisories.

---

## 🌟 Key Features (Zero Mock Architecture)

### 1. Raw Data Ingestion & Normalization Studio (High Impact)
- **Multi-Format Ingestion:** Ingests malformed CSVs, tab-separated tables, and raw IoT JSON dumps containing mixed units ($\mu g/m^3$, $ppm$, $ppb$, $mg/m^3$), inconsistent timestamps (ISO, 12h AM/PM, epoch), missing fields, and sensor malfunction codes (e.g. `-999`, flatline).
- **Intelligent Gemini Normalizer:** Standardizes atmospheric measurements into uniform units ($\mu g/m^3$ for particulates, $ppm$ for gases), computes sub-index AQI equivalents, and assigns categories.
- **Dedicated Data Integrity Audit Panel:**
  - Automated **Data Health Score (0-100)** gauge.
  - Granular breakdown of flagged gaps, out-of-bounds readings, unit reconciliations, and corrupt formats.
  - **Sensor Telemetry Coverage Matrix** indicating `ONLINE`, `DEGRADED`, and `OFFLINE` status per station.
  - Full standardized table view with expandable records.

### 2. Role-Based Action Intelligence Engine (High Impact)
- Persona selection before generating briefings:
  - 🏫 **School Principal / Educational Administrator:** Prioritizes classroom HEPA air purifier deployment, playground and athletic event cancellations, school timetable adjustments, and alerts to asthmatic student registers.
  - 🏢 **Housing Society / RWA Manager:** Directs backup diesel generator (DG) running curbs, bans open garden leaf and garbage burning, enforces water misting for civil work, and issues senior citizen morning walk alerts.
  - 🏛️ **Ward / Municipal Environmental Officer:** Dispatches mechanized vacuum road sweeping routes, water sprinkler tankers, industrial smokestack inspection taskforces, and commercial diesel truck diversions.
  - 🛵 **Gig Worker & Delivery Fleet Dispatcher:** Dynamic shift exposure budgeting, mandatory N95 gear enforcement, delivery dispatch pacing, and air quality rerouting via low-emission corridors.
- Generates prioritized, tactical intervention cards with execution time windows, operational step checklists, required gear, and expected impact.

### 3. Traceability & Evidence Mapping (High Impact)
- Every insight, spatial hotspot, and recommended intervention features an interactive **"Trace Source Data"** badge.
- Clicking the badge opens a specialized **Traceability Modal** displaying:
  - Exact source row IDs (`ROW-1`, `ROW-4`, etc.).
  - Observed atmospheric concentration signals.
  - Verbatim raw input snippets from the original un-normalized feed.
  - Triggered civic environmental safety standard (NAAQS / WHO 24h limits).
  - Scientific causal derivation rationale.

### 4. Longitudinal Brief Comparison Studio (Medium Impact)
- Compare current briefing snapshots side-by-side with historical baselines.
- Save current briefing sessions as custom historical snapshots with one click.
- Active Gemini comparative analysis computing:
  - Trajectory status (Worsening, Improving, Stable).
  - Pollutant-level deltas (PM2.5, PM10, etc.) with surge/decline percentages.
  - **Hotspot Migration Analysis** explaining spatial shifts across sectors.
  - Gemini Executive Comparative Narrative with physical meteorological context.
  - Actionable policy adjustments necessitated by the observed delta.

### 5. Dual Output Generation Studio (High Impact)
- **Internal Technical Briefing Note:**
  - Structured for municipal emergency committees and disaster authorities.
  - Official statutory classification level and timestamp.
  - **WHO & NAAQS 24-Hour Compliance Table** (observed avg vs limits with regulatory compliance status).
  - Spatial hotspot distribution and deployment directives.
  - Departmental directives with enforcement deadlines.
  - Formatted technical Markdown report with Copy and Print capabilities.
- **Multilingual Citizen Advisory Card:**
  - Simplified, empathetic public health notice.
  - **Multiple Languages:** English, Hindi (हिन्दी), Spanish (Español), Marathi (मराठी), Bengali (বাংলা), French (Français).
  - **Reading Levels:** General Public, Simple (5th Grade), Technical.
  - Visual AQI status dial with plain-language explanation.
  - **Vulnerable Group Callouts:** Dedicated precaution cards for:
    - 👶 Children & Schools
    - 🧓 Older Adults & Seniors
    - 🫁 Asthmatics & Chronic Respiratory Patients
    - 👷 Outdoor Workers & Transit Commuters
  - Actionable home tips, indoor air quality guidelines, transit notices, and emergency helpline details.
  - One-click print/PDF layout.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router), React 18, TypeScript (Strict Mode).
- **Styling:** Tailwind CSS with dark-mode aesthetic and custom print stylesheets.
- **AI SDK:** Official Google Generative AI SDK (`@google/genai`) using `gemini-3.5-flash-lite` with automatic `gemini-3.5-flash` failover.
- **Testing:** Vitest + React Testing Library (20 tests covering unit parsing, security sanitization, and UI accessibility).
- **Security:** Layered input sanitization (`lib/sanitizer.ts`) defending against prompt injections, control character corruptions, and payload overages.
- **Accessibility:** Full WCAG 2.1 AA compliance with semantic ARIA roles, dialog modal traps, and full keyboard navigation.
- **Icons:** `lucide-react`.
- **API Endpoints:**
  - `POST /api/analyze`: Raw data ingestion, Gemini normalization, and anomaly detection.
  - `POST /api/brief`: Role-based action intelligence with evidence mapping and internal briefing synthesis.
  - `POST /api/compare`: Longitudinal snapshot comparison and environmental delta trends.
  - `POST /api/advisory`: Multilingual citizen advisory generation across reading levels.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v22.17.1)
- Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. Clone or navigate to the repository:
   ```bash
   cd PromptWars
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your API key:
   Create a `.env.local` file in the project root:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(Note: You can also configure or test your API key dynamically in the UI via the **Settings** button in the top navigation bar).*

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Vercel Deployment

This project is configured for automated Vercel deployment:
1. Push the repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com/), ensure **Framework Preset** is set to **Next.js** with default output directory.
3. Add the environment variable:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
4. Deploy! Server-side route handlers will automatically run on Vercel's Edge/Serverless platform.
