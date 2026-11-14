export type AQICategory =
  | 'Good'
  | 'Moderate'
  | 'Poor'
  | 'Unhealthy'
  | 'Severe'
  | 'Hazardous';

export type PollutantType = 'PM2.5' | 'PM10' | 'NO2' | 'SO2' | 'CO' | 'O3' | 'AQI' | 'AQI_EST';

export interface RawReadingRecord {
  rowId: string;
  originalText: string;
}

export interface NormalizedReading {
  rowId: string;
  rawSnippet: string;
  timestamp: string; // ISO format or standardized human time
  originalTimestamp?: string;
  location: string;
  pollutant: PollutantType;
  rawValue: string | number;
  normalizedValue: number;
  standardUnit: 'µg/m³' | 'ppm' | 'AQI';
  aqiEquivalent: number;
  category: AQICategory;
  anomaliesFlagged: string[];
  reliabilityScore: number; // 0-100%
}

export interface DataIntegrityIssue {
  id: string;
  rowId: string;
  sensorId: string;
  issueType:
    | 'UNIT_MISMATCH'
    | 'CORRUPT_FORMAT'
    | 'OUT_OF_BOUNDS'
    | 'MISSING_FIELD'
    | 'INCONSISTENT_TIMESTAMP'
    | 'SENSOR_FLATLINE';
  description: string;
  rawSnippet: string;
  actionTaken: string;
  severity: 'low' | 'medium' | 'high';
}

export interface SensorStatus {
  sensorId: string;
  location: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  readingsCount: number;
  lastReadingTime?: string;
  notes?: string;
}

export interface DataIntegrityAudit {
  totalInputRows: number;
  validParsedRows: number;
  corruptRowsCount: number;
  normalizedUnitCount: number;
  interpolatedFieldsCount: number;
  overallDataHealthScore: number; // 0-100
  auditSummary: string;
  anomalies: DataIntegrityIssue[];
  sensorCoverage: SensorStatus[];
}

export type PersonaType = 'principal' | 'rwa' | 'municipal';

export interface PersonaConfig {
  id: PersonaType;
  title: string;
  badge: string;
  description: string;
  iconName: string;
  responsibilities: string[];
}

export interface TraceEvidence {
  sourceRowIds: string[];
  observedMetric: string;
  rawEvidenceSnippets: string[];
  ruleTriggered: string;
  confidence: number;
  rationale: string;
}

export interface ActionCard {
  id: string;
  persona: PersonaType;
  title: string;
  priority: 'CRITICAL_NOW' | 'HIGH_ALERT' | 'MEDIUM_ADVISORY' | 'ROUTINE_MONITORING';
  targetDomain: string; // e.g. "Physical Education & Recess", "DG Set Control", "Anti-Smog Guns"
  actionHeadline: string;
  detailedProtocol: string[];
  operationalWindow: string; // e.g. "Next 2 hours", "Immediate (0-30 mins)"
  resourceRequirements: string[];
  expectedImpact: string;
  traceEvidence: TraceEvidence;
}

export interface BriefingAnalysis {
  briefingId: string;
  generatedAt: string;
  locationSummary: string;
  averageAqi: number;
  peakAqi: number;
  peakZone: string;
  dominantPollutant: PollutantType;
  overallCategory: AQICategory;
  normalizedReadings: NormalizedReading[];
  dataIntegrityAudit: DataIntegrityAudit;
  executiveSummary: string;
  hotspots: Array<{
    zone: string;
    aqi: number;
    dominantPollutant: string;
    threatLevel: 'Moderate' | 'High' | 'Severe' | 'Critical';
    traceRowId: string;
  }>;
}

export interface HistoricalSnapshot {
  id: string;
  name: string;
  timestamp: string;
  location: string;
  averageAqi: number;
  peakAqi: number;
  dominantPollutant: PollutantType;
  totalSensors: number;
  summary: string;
  hotspotAreas: string[];
}

export interface ComparisonResult {
  currentSnapshot: {
    name: string;
    timestamp: string;
    averageAqi: number;
    peakAqi: number;
  };
  historicalSnapshot: {
    name: string;
    timestamp: string;
    averageAqi: number;
    peakAqi: number;
  };
  overallAqiDelta: {
    difference: number;
    percentChange: number;
    trend: 'worsening' | 'improving' | 'stable';
    summaryNarrative: string;
  };
  pollutantDeltas: Array<{
    pollutant: string;
    previousAvg: number;
    currentAvg: number;
    percentChange: number;
    unit: string;
    status: 'SURGE' | 'ELEVATED' | 'DECLINE' | 'STABLE';
    traceDetails: string;
  }>;
  hotspotMigration: Array<{
    area: string;
    previousAqi: number;
    currentAqi: number;
    statusChange: string;
    shiftAnalysis: string;
  }>;
  aiComparativeBrief: string;
  strategicAdjustments: string[];
}

export interface ComplianceRow {
  pollutant: string;
  observed24hAvg: number;
  whoStandard: number;
  nationalStandard: number;
  unit: string;
  complianceRatio: number;
  status: 'COMPLIANT' | 'BORDERLINE' | 'EXCEEDED' | 'SEVERELY_EXCEEDED';
}

export interface InternalBriefingNote {
  briefingTitle: string;
  issuedFor: string;
  classificationLevel: string;
  timestamp: string;
  executiveSummary: string;
  meteorologicalSynergyNotes: string;
  complianceTable: ComplianceRow[];
  spatialHotspots: Array<{
    sector: string;
    aqi: number;
    primaryContributor: string;
    dispatchDirective: string;
    traceRow: string;
  }>;
  departmentalDirectives: Array<{
    department: string;
    directive: string;
    enforcementAuthority: string;
    deadline: string;
  }>;
  fullTechnicalReportMarkdown: string;
}

export interface CitizenAdvisory {
  headline: string;
  subheadline: string;
  language: string;
  languageCode: string;
  readingLevel: 'General Public' | 'Simple (5th Grade)' | 'Technical';
  currentAirCondition: {
    aqiScore: number;
    statusBadge: string;
    colorHex: string;
    plainExplanation: string;
  };
  healthAdvisories: {
    children: {
      callout: string;
      dos: string[];
      donts: string[];
    };
    olderAdults: {
      callout: string;
      dos: string[];
      donts: string[];
    };
    respiratoryAndHeart: {
      callout: string;
      dos: string[];
      donts: string[];
    };
    outdoorWorkers: {
      callout: string;
      dos: string[];
      donts: string[];
    };
  };
  actionableTips: string[];
  indoorAirRecommendations: string[];
  schoolAndCommuteNotice: string;
  emergencyHelplineNotice: string;
}
