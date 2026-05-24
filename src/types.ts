/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum RiskLevel {
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
}

export enum ProteinuriaLevel {
  NONE = "NONE",
  TRACE = "TRACE",
  PLUS_1 = "1+",
  PLUS_2_OR_MORE = "2+ or more",
}

export enum SwellingLevel {
  NONE_MILD = "NONE_MILD",
  FEET_ONLY = "FEET_ONLY",
  FACE_OR_HANDS = "FACE_OR_HANDS",
}

export interface PatientRegistration {
  fullName: string;
  age: number;
  gestationalWeeks: number;
  previousPregnancies: number;
  previousPreeclampsia: boolean;
}

export interface ClinicalEvaluation {
  systolicBp: number;
  diastolicBp: number;
  proteinuria: ProteinuriaLevel;
  swelling: SwellingLevel;
  symptoms: {
    severeHeadache: boolean;
    visionChanges: boolean;
    ribPain: boolean;
    shortnessOfBreath: boolean;
  };
  chronicHypertension: boolean;
  preExistingDiabetes: boolean;
  multiplePregnancy: boolean;
  notes?: string;
}

export interface AssessmentRecord {
  id: string;
  timestamp: string;
  registration: PatientRegistration;
  clinical: ClinicalEvaluation;
  riskLevel: RiskLevel;
  riskScore: number; // calculated score out of 10
  reasons: string[];
  referralId?: string;
  referralStatus: "PENDING" | "REFERRED" | "STABILIZED";
  facilityName?: string;
}

export interface Facility {
  id: string;
  name: string;
  region: string;
  phone: string;
  distanceKm: number;
  isTertiary: boolean;
}
