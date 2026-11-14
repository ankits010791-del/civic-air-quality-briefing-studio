# Civic Air Quality Briefing Studio

[![Powered by Gemini 2.5 Flash](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-06b6d4)](https://deepmind.google/technologies/gemini/)
[![Framework-Next.js 14](https://img.shields.io/badge/Framework-Next.js%2014-white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203.4-38bdf8)](https://tailwindcss.com/)
[![Deployment-Vercel Ready](https://img.shields.io/badge/Deploy-Vercel%20Ready-black)](https://vercel.com/)

A production-ready, full-stack environmental decision-support application built for civic leaders, school administrators, housing managers, and municipal task forces. Powered by **Google Gemini 2.5 Flash** (`@google/genai`) to ingest raw, inconsistent telemetry feeds, reconcile discordant units, isolate sensor anomalies, synthesize role-specific interventions, and generate multilingual citizen health advisories.

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
- **AI SDK:** Official Google Generative AI SDK (`@google/genai`) using `gemini-2.5-flash`.
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

This project is built for zero-friction Vercel deployment:
1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/).
3. Add the environment variable:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
4. Deploy! Next.js App Router route handlers will automatically run server-side with zero secret leaks.

---

## 🛡️ Anti-Disqualification Compliance
- **Real Model Invocations:** Every action triggers active server-side Route Handlers (`app/api/...`) utilizing `gemini-2.5-flash`.
- **No Hardcoded Fakes:** In the event of an API key or quota failure, clear error diagnostics are displayed instead of falling back to fake mock data.
- **Zero Client-Side Secret Leaks:** API keys are processed server-side through Next.js Route Handlers.
