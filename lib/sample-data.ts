import { HistoricalSnapshot } from './types';

export const MESSY_MUNICIPAL_CSV = `Timestamp,Sensor_ID,Location_Zone,Pollutant,Raw_Reading,Unit,Calibration_Status,Remarks
2025-11-14 08:15:00,WRD-04-A,Sector 4 North Primary School,PM2.5,214.6,ug/m3,CALIBRATED,Heavy morning school drop-off traffic
14/11/2025 08:20 AM,WRD-07-IND,Sector 7 Industrial Area,PM2.5,0.285,ppm,UNVERIFIED,Heavy diesel truck idling near logistics hub
2025-11-14T08:25:32Z,WRD-04-B,Sector 4 Kindergarten Playground,PM10,380.2,micrograms/m3,CALIBRATED,Visible particulate haze observed
11-14-2025 08:30,WRD-09-RWA,Greenwood Enclave RWA Block C,PM2.5,142.0,µg/m³,CALIBRATED,Backup diesel generator running (power cut)
2025-11-14 08:35:12,WRD-12-MUN,Sector 12 Ring Road Flyover,NO2,98.4,ppb,CALIBRATED,Heavy commercial traffic corridor
,WRD-07-IND,Sector 7 Waste Processing Yard,PM2.5,340.5,ug/m3,EXPIRED,Missing timestamp - open waste burning suspected
2025-11-14 08:42:00,WRD-11-HUB,Sector 11 Construction Zone,PM10,512.0,ug/m3,CALIBRATED,Uncovered sand piles and excavation work
2025-11-14 08:45:00,WRD-01-CIV,Central Municipal Hospital Ward,PM2.5,-999,ug/m3,ERROR_FLAGGED,Sensor optical chamber blockage / error code
2025-11-14 08:50:22,WRD-09-RWA,Greenwood Enclave Gate 2,CO,4.8,ppm,CALIBRATED,Vehicular queuing at boom barrier
14/11/2025 08:55:00,WRD-04-A,Sector 4 Sports Complex,PM2.5,198.0,µg/m3,CALIBRATED,Morning athletics training session
2025-11-14 09:00:00,WRD-07-IND,Sector 7 Boiler Plant B,SO2,45.2,ppb,CALIBRATED,Furnace startup emissions
2025-11-14 09:05:00,UNKNOWN_ID,,PM2.5,189.5,ug/m3,,Corrupt row missing location and sensor ID
2025-11-14 09:10:00,WRD-12-MUN,Sector 12 Market Complex,PM2.5,165.2,ug/m3,CALIBRATED,Street food tandoors and morning traffic
2025-11-14 09:15:00,WRD-04-A,Sector 4 North Primary School,AQI_EST,268,,AUTO_CALC,Estimated sub-index from school roof station`;

export const MESSY_COMMUNITY_JSON = `[
  {
    "device_name": "EcoBreeze-Ward4-School",
    "timestamp_iso": "2025-11-14T08:00:00Z",
    "zone": "Sector 4 School Zone",
    "pm2_5": "225.4 ug/m3",
    "pm10": 395.0,
    "battery": "88%",
    "notes": "School bell ring, children gathering"
  },
  {
    "device_name": "EcoBreeze-Ward7-Factory",
    "epoch_time": 1731571500,
    "zone": "Sector 7 Industrial Belt",
    "pm2_5_ppm": 0.31,
    "no2_ppb": 115,
    "flag": "HIGH_EXPOSURE",
    "notes": "Adjacent to metallurgical foundry"
  },
  {
    "device_name": "EcoBreeze-RWA-Complex",
    "timestamp_iso": "14-11-2025 08:35",
    "zone": "Greenwood Society Garden",
    "pm2_5": 158.0,
    "unit": "µg/m3",
    "sensor_drift": "+4%",
    "notes": "Lawn leaf burning reported by security"
  },
  {
    "device_name": "EcoBreeze-Construction-Site",
    "timestamp_iso": "2025-11-14T08:45:00Z",
    "zone": "Sector 11 Metro Construction",
    "pm2_5": "310 ug/m3",
    "pm10": 580.0,
    "dust_suppression": "INACTIVE",
    "notes": "Dry drilling underway without mist gun"
  },
  {
    "device_name": "EcoBreeze-Faulty-Node",
    "timestamp_iso": "2025-11-14T08:50:00Z",
    "zone": "Sector 2 Residential",
    "pm2_5": null,
    "pm10": -99.0,
    "notes": "Sensor flatline, power disconnect"
  }
]`;

export const HISTORICAL_SNAPSHOTS: HistoricalSnapshot[] = [
  {
    id: 'snap-yesterday-baseline',
    name: 'Yesterday 24h Baseline (Cycle T-1)',
    timestamp: '2025-11-13 08:30:00',
    location: 'Metropolitan District & Civic Zones',
    averageAqi: 172,
    peakAqi: 242,
    dominantPollutant: 'PM2.5',
    totalSensors: 14,
    summary:
      'Moderate-to-Poor air quality with localized elevated PM2.5 in Sector 4 and early evening vehicular emissions along Sector 12 Ring Road.',
    hotspotAreas: ['Sector 4 North', 'Sector 12 Ring Road Flyover'],
  },
  {
    id: 'snap-last-week-favorable',
    name: 'Last Week Clear Window (Post-Rain Baseline)',
    timestamp: '2025-11-07 10:00:00',
    location: 'Metropolitan District & Civic Zones',
    averageAqi: 88,
    peakAqi: 125,
    dominantPollutant: 'PM10',
    totalSensors: 14,
    summary:
      'Favorable air dispersion following light convective precipitation. All residential and school wards remained within acceptable national thresholds.',
    hotspotAreas: ['Sector 7 Industrial Area'],
  },
];
