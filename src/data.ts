/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AssessmentRecord, Facility, RiskLevel, ProteinuriaLevel, SwellingLevel } from "./types";

export const REFERRAL_FACILITIES: Facility[] = [
  {
    id: "kbth",
    name: "Korle Bu Teaching Hospital (Maternity Wing)",
    region: "Greater Accra",
    phone: "+233 30 267 1100",
    distanceKm: 8.4,
    isTertiary: true,
  },
  {
    id: "ridge",
    name: "Greater Accra Regional Hospital (Ridge)",
    region: "Greater Accra",
    phone: "+233 30 222 8315",
    distanceKm: 3.2,
    isTertiary: true,
  },
  {
    id: "tema_gen",
    name: "Tema General Hospital",
    region: "Greater Accra",
    phone: "+233 30 320 6101",
    distanceKm: 24.5,
    isTertiary: false,
  },
  {
    id: "kath",
    name: "Komfo Anokye Teaching Hospital",
    region: "Ashanti",
    phone: "+233 32 202 2301",
    distanceKm: 252.1,
    isTertiary: true,
  },
  {
    id: "ccth",
    name: "Cape Coast Teaching Hospital",
    region: "Central",
    phone: "+233 33 213 2212",
    distanceKm: 145.0,
    isTertiary: true,
  },
];

export const INITIAL_ASSESSMENT_RECORDS: AssessmentRecord[] = [
  {
    id: "REC-2026-001",
    timestamp: new Date(Date.now() - 3600000 * 24 * 1).toISOString(), // 1 day ago
    registration: {
      fullName: "Esi Mensah",
      age: 28,
      gestationalWeeks: 34,
      previousPregnancies: 2,
      previousPreeclampsia: false,
    },
    clinical: {
      systolicBp: 165,
      diastolicBp: 112,
      proteinuria: ProteinuriaLevel.PLUS_2_OR_MORE,
      swelling: SwellingLevel.FACE_OR_HANDS,
      symptoms: {
        severeHeadache: true,
        visionChanges: true,
        ribPain: false,
        shortnessOfBreath: false,
      },
      chronicHypertension: false,
      preExistingDiabetes: false,
      multiplePregnancy: false,
      notes: "Patient complains of pounding headache since morning and brief spots in her vision. Sent with emergency ambulance to Ridge.",
    },
    riskLevel: RiskLevel.HIGH,
    riskScore: 9,
    reasons: [
      "Severe Hypertension (BP ≥ 160/110 mmHg)",
      "Significant Proteinuria (2+ or more)",
      "Severe Symptoms Present: Severe headache, vision changes",
      "Severe Pitting Edema in face or hands",
    ],
    referralId: "REF-2026-614",
    referralStatus: "REFERRED",
    facilityName: "Greater Accra Regional Hospital (Ridge)",
  },
  {
    id: "REC-2026-002",
    timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString(), // 3 days ago
    registration: {
      fullName: "Ama Boateng",
      age: 36,
      gestationalWeeks: 29,
      previousPregnancies: 3,
      previousPreeclampsia: true,
    },
    clinical: {
      systolicBp: 142,
      diastolicBp: 92,
      proteinuria: ProteinuriaLevel.TRACE,
      swelling: SwellingLevel.FEET_ONLY,
      symptoms: {
        severeHeadache: false,
        visionChanges: false,
        ribPain: false,
        shortnessOfBreath: false,
      },
      chronicHypertension: false,
      preExistingDiabetes: true,
      multiplePregnancy: false,
      notes: "Moderate elevation. Patient has pre-existing risk factors: diabetic, age > 35, and previous pre-eclampsia. Scheduled closely for twice weekly clinic checkups.",
    },
    riskLevel: RiskLevel.MODERATE,
    riskScore: 5,
    reasons: [
      "Mild/Moderate Hypertension (BP 140-159/90-109 mmHg)",
      "High Risk Factors: Age >35, Previous history of pre-eclampsia, Pre-existing Diabetes",
    ],
    referralId: undefined,
    referralStatus: "STABILIZED",
    facilityName: undefined,
  },
  {
    id: "REC-2026-003",
    timestamp: new Date(Date.now() - 3600000 * 24 * 4).toISOString(), // 4 days ago
    registration: {
      fullName: "Abena Osei",
      age: 22,
      gestationalWeeks: 18,
      previousPregnancies: 0,
      previousPreeclampsia: false,
    },
    clinical: {
      systolicBp: 115,
      diastolicBp: 75,
      proteinuria: ProteinuriaLevel.NONE,
      swelling: SwellingLevel.NONE_MILD,
      symptoms: {
        severeHeadache: false,
        visionChanges: false,
        ribPain: false,
        shortnessOfBreath: false,
      },
      chronicHypertension: false,
      preExistingDiabetes: false,
      multiplePregnancy: false,
      notes: "First pregnancy clinic visit. Happy healthy parameters. Dynamic routine monitoring advice given.",
    },
    riskLevel: RiskLevel.LOW,
    riskScore: 1,
    reasons: ["No hypertensive readings", "No proteinuria", "No alarm symptoms"],
    referralId: undefined,
    referralStatus: "PENDING",
    facilityName: undefined,
  },
];

export interface Article {
  id: string;
  title: string;
  category: string;
  readingTime: string;
  summary: string;
  details: string[];
}

export const CLINICAL_ARTICLES: Article[] = [
  {
    id: "pe-defn",
    title: "Understanding Pre-eclampsia vs. Eclampsia",
    category: "Pathophysiology",
    readingTime: "5 min",
    summary: "Pre-eclampsia is a multi-system pregnancy disorder characterized by new-onset hypertension (typically ≥ 140/90) and or proteinuria after 20 weeks of gestation. If untreated, it progresses into eclampsia.",
    details: [
      "Onset: Always after 20 weeks of gestation (except in molar pregnancies).",
      "Hallmarks: Hypertension + End-organ dysfunction (most commonly Proteinuria, kidney injury, hepatic damage, thrombocytopenia, or cerebral symptoms).",
      "What is Eclampsia?: The onset of generalized tonic-clonic seizures in a pregnant woman with pre-eclampsia, which is a life-threatening medical emergency.",
      "Primary Treatment: Delivery of the baby and placenta is the only definitive cure, but blood pressure must be stabilized and seizures prevented with Magnesium Sulfate beforehand.",
    ],
  },
  {
    id: "bp-technique",
    title: "Accurate Blood Pressure Measurement Protocol",
    category: "Diagnostics",
    readingTime: "4 min",
    summary: "Inaccurate BP measurements can lead to missed diagnosis of gestational hypertension or dangerous over-diagnosis. Learn the clinical standards.",
    details: [
      "Preparation: Patient must rest sitting comfortably with feet flat for at least 5 minutes before reading. No talking or sudden stress.",
      "Arm Position: Keep the arm bare, fully supported, and positioned at the Level of the Heart.",
      "Cuff Sizing: Choose the correct cuff. If too small, the reading will be falsely high; if too large, it will be falsely low.",
      "Repeatability: If the initial reading is ≥ 140/90, repeat the measurement after 15 minutes of quiet rest. Use the second reading as the diagnostic marker.",
    ],
  },
  {
    id: "magsulfate",
    title: "Magnesium Sulfate (MgSO₄) Administration Guide",
    category: "Emergency Care",
    readingTime: "6 min",
    summary: "The primary drug of choice for anti-convulsive therapy in severe pre-eclampsia. Requires extreme dosage precision and monitoring.",
    details: [
      "Loading Dose: 4g IV slowly over 15-20 minutes, followed by 10g IM (5g in each buttock) as the initial loading dose.",
      "Maintenance Dose: 5g IM every 4 hours in alternating buttocks, or 1-2g/hour IV continuous infusion.",
      "Toxicity Monitoring Checklist: ALWAYS check three clinical parameters before each maintenance dose:",
      "1. Patellar Reflexes (knee jerks) must be active and present.",
      "2. Respiratory Rate must be ≥ 16 breaths per minute.",
      "3. Urine Output must be ≥ 30ml per hour (requires indwelling Foley catheter).",
      "Antidote: Calcium Gluconate (1g IV over 10 minutes) must be at the bedside at all times in case of magnesium toxicity (loss of reflexes, shallow breathing).",
    ],
  },
];
