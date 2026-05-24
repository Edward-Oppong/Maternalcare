/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  RiskLevel,
  ProteinuriaLevel,
  SwellingLevel,
  PatientRegistration,
  ClinicalEvaluation,
  AssessmentRecord,
} from "./types";
import { INITIAL_ASSESSMENT_RECORDS } from "./data";
import WelcomeDashboard from "./components/WelcomeDashboard";
import ActiveAssessment from "./components/ActiveAssessment";
import TriageResult from "./components/TriageResult";
import ReferralNoteView from "./components/ReferralNoteView";
import HistoryList from "./components/HistoryList";
import EducationalHub from "./components/EducationalHub";
import { KeyRound, ShieldAlert, Heart, Clipboard, HelpCircle, Activity, Stethoscope, Landmark, UserRoundCheck, ClipboardList, CheckCircle, BookOpen } from "lucide-react";

export default function App() {
  // Initialize records from localstorage if present, otherwise load prepopulated ones
  const [records, setRecords] = useState<AssessmentRecord[]>(() => {
    const saved = localStorage.getItem("mat_care_ghana_records");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse stored records:", err);
      }
    }
    return INITIAL_ASSESSMENT_RECORDS;
  });

  useEffect(() => {
    localStorage.setItem("mat_care_ghana_records", JSON.stringify(records));
  }, [records]);

  // Overall screen mode
  const [activeWorkflow, setActiveWorkflow] = useState<
    "dashboard" | "active_screening" | "calculating" | "triage_results" | "referral_note"
  >("dashboard");

  // Bottom navigation tab (only visible when not in active screening/calculating/referral note document screens)
  const [activeTab, setActiveTab] = useState<"hub" | "history" | "education" | "patients">("hub");

  // Working data
  const [evaluationRecord, setEvaluationRecord] = useState<AssessmentRecord | null>(null);

  // Calculating animation step states
  const [calcStep, setCalcStep] = useState(0);

  // Custom patient tracking list with simple BP progression lines!
  const patientsCount = Array.from(new Set(records.map((r) => r.registration.fullName)));

  // Calculate clinical risk score out of 10 based on guidelines
  const runClinicalTriageEngine = (reg: PatientRegistration, clin: ClinicalEvaluation) => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Blood Pressure Severe and Mild Markers
    if (clin.systolicBp >= 160 || clin.diastolicBp >= 110) {
      score += 5;
      reasons.push("Severe Hypertension (BP ≥ 160/110 mmHg) - Direct threshold crisis");
    } else if (clin.systolicBp >= 140 || clin.diastolicBp >= 90) {
      score += 3;
      reasons.push("Mild/Moderate Gestational Hypertension (BP 140-159/90-109 mmHg)");
    }

    // 2. Kidneys Excretion Proteinuria Levels
    if (clin.proteinuria === ProteinuriaLevel.PLUS_2_OR_MORE) {
      score += 3;
      reasons.push("Severe Proteinuria (2+ or more) - Indicated prominent glomerular breach");
    } else if (clin.proteinuria === ProteinuriaLevel.PLUS_1) {
      score += 2;
      reasons.push("Significant Proteinuria (1+) - Confirmed kidney strain");
    } else if (clin.proteinuria === ProteinuriaLevel.TRACE) {
      score += 1;
      reasons.push("Trace Proteinuria (±) - Requires close watching");
    }

    // 3. Neuro/Gastric Warning symptoms
    let severeSymptomActive = false;
    if (clin.symptoms.severeHeadache) {
      score += 2.5;
      severeSymptomActive = true;
      reasons.push("Severe constant headache - Suspected cerebral vasospasm");
    }
    if (clin.symptoms.visionChanges) {
      score += 2.5;
      severeSymptomActive = true;
      reasons.push("Visual distortion / blur / spots - Cerebral cortical irritation");
    }
    if (clin.symptoms.ribPain) {
      score += 2;
      severeSymptomActive = true;
      reasons.push("Severe epigastric pain under right ribs - Glisson hepatic capsule stretch");
    }
    if (clin.symptoms.shortnessOfBreath) {
      score += 2;
      severeSymptomActive = true;
      reasons.push("Shortness of breath (Dyspnea) - Impending fluid overload");
    }

    // 4. Oedema Swelling
    if (clin.swelling === SwellingLevel.FACE_OR_HANDS) {
      score += 2;
      reasons.push("Vascular pitting oedema in of face or hands (highly toxic signature)");
    } else if (clin.swelling === SwellingLevel.FEET_ONLY) {
      score += 1;
      reasons.push("Symmetrical pitting foot oedema");
    }

    // 5. Patient Baselines & comorbidities
    if (clin.chronicHypertension) {
      score += 1;
      reasons.push("Known Pre-existing Chronic Hypertension");
    }
    if (clin.preExistingDiabetes) {
      score += 1;
      reasons.push("Pre-existing Diabetes mellitus");
    }
    if (clin.multiplePregnancy) {
      score += 1.5;
      reasons.push("Expecting multiple fetuses (twins / triplets)");
    }
    if (reg.previousPreeclampsia) {
      score += 2;
      reasons.push("History of past pre-eclampsia in previous pregnancy");
    }
    if (reg.age < 18 || reg.age > 35) {
      score += 1;
      reasons.push("Demographic high risk age cofactor (<18 or >35)");
    }
    if (reg.previousPregnancies === 0) {
      score += 1;
      reasons.push("Nulliparity - First pregnancy risk group");
    }

    // Capping at 10
    const riskScore = Math.min(10, Math.round(score));

    // Determine Triage Level
    let riskLevel = RiskLevel.LOW;
    // Rule: BP >= 160 or Diastolic >= 110 or Any severe symptom with elevated BP or severe proteinuria automatically triggers HIGH RISK
    if (
      riskScore >= 6 ||
      clin.systolicBp >= 160 ||
      clin.diastolicBp >= 110 ||
      (severeSymptomActive && (clin.systolicBp >= 140 || clin.diastolicBp >= 90)) ||
      (clin.proteinuria === ProteinuriaLevel.PLUS_2_OR_MORE && (clin.systolicBp >= 140 || clin.diastolicBp >= 90))
    ) {
      riskLevel = RiskLevel.HIGH;
    } else if (riskScore >= 3) {
      riskLevel = RiskLevel.MODERATE;
    }

    return {
      riskScore,
      riskLevel,
      reasons: reasons.length > 0 ? reasons : ["No elevated pre-eclampsia criteria triggered."],
    };
  };

  const handleAssessmentComplete = (reg: PatientRegistration, clin: ClinicalEvaluation) => {
    setActiveWorkflow("calculating");
    setCalcStep(1);

    // Simulate clinical triage engine calculation steps
    const stepIntervals = [1200, 2400, 3600, 4800, 6000];
    stepIntervals.forEach((time, index) => {
      setTimeout(() => {
        setCalcStep(index + 2);
        if (index === stepIntervals.length - 1) {
          // Completed calculation
          const outcomes = runClinicalTriageEngine(reg, clin);
          const generatedId = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;

          const newRecord: AssessmentRecord = {
            id: generatedId,
            timestamp: new Date().toISOString(),
            registration: reg,
            clinical: clin,
            riskLevel: outcomes.riskLevel,
            riskScore: outcomes.riskScore,
            reasons: outcomes.reasons,
            referralId: outcomes.riskLevel === RiskLevel.HIGH ? `REF-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
            referralStatus: outcomes.riskLevel === RiskLevel.HIGH ? "REFERRED" : "PENDING",
          };

          setEvaluationRecord(newRecord);
          // Prepend newly generated card to local records state
          setRecords((prev) => [newRecord, ...prev]);
          setActiveWorkflow("triage_results");
        }
      }, time);
    });
  };

  // Select historical patient file to expand
  const handleSelectRecord = (rec: AssessmentRecord) => {
    setEvaluationRecord(rec);
    if (rec.riskLevel === RiskLevel.HIGH) {
      setActiveWorkflow("triage_results");
    } else {
      setActiveWorkflow("referral_note");
    }
  };

  // Update existing notes and close assessment flow
  const handleSaveReferralNotes = (id: string, notes: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, clinical: { ...r.clinical, notes } } : r))
    );
    setActiveWorkflow("dashboard");
    setActiveTab("history");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-teal-500/10 selection:text-teal-900 pb-20 sm:pb-24">
      {/* Clinician Brand Header */}
      <header className="bg-white border-b sticky top-0 z-40 px-6 py-4.5 no-print">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-605 text-white rounded-xl flex items-center justify-center font-black select-none shadow shadow-teal-700/15">
              <Stethoscope className="w-5.5 h-5.5 text-teal-600" />
            </div>
            <div className="text-left">
              <h1 className="text-sm font-black text-slate-900 tracking-tight leading-none uppercase">
                MaternalCare Ghana
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-wide mt-0.5">
                PreeclampsiaFlag Diagnostic Hub • District Clinic 4
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            {/* Online Sync confirmation marker */}
            <span className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              STABILIZED CLINIC ENGINE
            </span>
            <div className="py-1 px-3 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-lg font-mono">
              Nurse Akosua
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Wrapper */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-6 py-8">
        {/* ACTIVE WORKFLOW SCREENS */}

        {activeWorkflow === "dashboard" && (
          <div className="animate-fadeIn">
            {activeTab === "hub" && (
              <WelcomeDashboard
                onStartAssessment={() => {
                  setActiveWorkflow("active_screening");
                }}
                onGoToHistory={() => setActiveTab("history")}
                onGoToEdu={() => setActiveTab("education")}
                records={records}
                onSelectRecord={handleSelectRecord}
              />
            )}

            {activeTab === "history" && (
              <div className="space-y-4 text-left">
                <div className="border-b pb-3 mb-4">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    Maternity Assessment Records
                  </h2>
                  <p className="text-sm text-slate-405 font-medium mt-0.5">
                    Search and filter midwife evaluations tracked at this station.
                  </p>
                </div>
                <HistoryList records={records} onSelectRecord={handleSelectRecord} />
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-4 text-left">
                <div className="border-b pb-3 mb-4">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    Ghana GHS Clinical Guidelines
                  </h2>
                  <p className="text-sm text-slate-405 font-medium mt-0.5">
                    Verified protocols for midwife diagnosis, magnesium dosage and eclampsia crisis management on-site.
                  </p>
                </div>
                <EducationalHub />
              </div>
            )}

            {activeTab === "patients" && (
              <div className="space-y-6 text-left animate-fadeIn">
                <div className="border-b pb-3">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    Patient Blood Pressure Progression
                  </h2>
                  <p className="text-sm text-slate-405 font-medium mt-0.5">
                    Continuous vital tracking across visits to identify insidious trends.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-6 border shadow-sm space-y-6">
                  {patientsCount.length === 0 ? (
                    <p className="text-slate-500 italic text-sm text-center py-6">No unique patients logged yet.</p>
                  ) : (
                    <div className="space-y-6">
                      {patientsCount.map((name, patientIdx) => {
                        const patientVitals = records
                          .filter((r) => r.registration.fullName === name)
                          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                        return (
                          <div key={patientIdx} className="p-5 bg-slate-50 border rounded-2xl space-y-4">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                              <div>
                                <h3 className="text-base font-black text-slate-900">{name}</h3>
                                <p className="text-xs text-slate-405 font-mono">
                                  {patientVitals[0].registration.age} Years Old • Gestation: {patientVitals[patientVitals.length - 1].registration.gestationalWeeks} Weeks
                                </p>
                              </div>
                              <span className="text-[11px] font-mono py-1 px-2.5 bg-slate-205 text-slate-650 rounded-full font-bold uppercase self-start sm:self-auto">
                                {patientVitals.length} recorded screening visits
                              </span>
                            </div>

                            {/* SVG Trendline for systolic Blood Pressure */}
                            <div>
                              <span className="text-[10px] font-mono font-black text-slate-455 uppercase tracking-wide block mb-2">
                                Systolic BP Curve Trend (mmHg)
                              </span>
                              <div className="w-full h-24 bg-white border rounded-xl relative p-3 flex items-end">
                                <svg className="w-full h-full" viewBox="0 0 400 60" preserveAspectRatio="none">
                                  {/* Draw grid lines */}
                                  <line x1="0" y1="10" x2="400" y2="10" stroke="#f1f5f9" strokeWidth="1" />
                                  <line x1="0" y1="35" x2="400" y2="35" stroke="#f1f5f9" strokeWidth="1" />

                                  {/* Draw curve path */}
                                  {patientVitals.length > 1 ? (
                                    <>
                                      <path
                                        d={patientVitals
                                          .map((v, i) => {
                                            const x = (i / (patientVitals.length - 1)) * 400;
                                            // systolic map: values between 100 and 180 mapped to 50 and 5 respectively
                                            const y = 50 - ((v.clinical.systolicBp - 100) / 80) * 40;
                                            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                                          })
                                          .join(" ")}
                                        fill="none"
                                        stroke="#0d9488"
                                        strokeWidth="3.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      {patientVitals.map((v, i) => {
                                        const x = (i / (patientVitals.length - 1)) * 400;
                                        const y = 50 - ((v.clinical.systolicBp - 100) / 80) * 40;
                                        return (
                                          <circle
                                            key={i}
                                            cx={x}
                                            cy={y}
                                            r="4.5"
                                            className={v.clinical.systolicBp >= 140 ? "fill-red-500" : "fill-teal-600"}
                                            stroke="white"
                                            strokeWidth="1.5"
                                          />
                                        );
                                      })}
                                    </>
                                  ) : (
                                    <g>
                                      <circle cx="200" cy="30" r="4.5" className="fill-teal-600" />
                                      <text x="210" y="34" className="text-[10px] fill-slate-400 font-medium">Single reading baseline: {patientVitals[0].clinical.systolicBp} mmHg</text>
                                    </g>
                                  )}
                                </svg>
                              </div>

                              {/* BP values label list */}
                              <div className="flex justify-between text-[11px] font-mono font-bold text-slate-500 mt-2 px-1">
                                {patientVitals.map((v, i) => (
                                  <span key={i} className={v.clinical.systolicBp >= 140 ? "text-red-650" : "text-slate-600"}>
                                    V{i+1}: {v.clinical.systolicBp}/{v.clinical.diastolicBp}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACTIVE MULTI-STEP ASSESSMENT SCREEN */}
        {activeWorkflow === "active_screening" && (
          <div className="animate-fadeIn">
            <ActiveAssessment
              onCancel={() => setActiveWorkflow("dashboard")}
              onComplete={handleAssessmentComplete}
            />
          </div>
        )}

        {/* LOADING CALCULATOR TRANSITION */}
        {activeWorkflow === "calculating" && (
          <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-xl animate-fadeIn">
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-teal-500/15 animate-ping" />
              <div className="relative w-24 h-24 rounded-full border-4 border-slate-100 border-t-teal-600 animate-spin flex items-center justify-center">
                <Activity className="w-10 h-10 text-teal-600 animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                Triaging Clinical Metrics...
              </h2>
              <p className="text-xs text-slate-455 font-semibold">
                Running Ghana Health Service (GHS) Pre-eclampsia Risk Algorithm
              </p>
            </div>

            {/* Simulated process loading status */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-150 space-y-3.5 text-left font-sans">
              <div className="flex items-center gap-2 text-xs">
                {calcStep >= 1 ? (
                  <CheckCircle className="w-4 h-4 text-teal-600 grow-0 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-slate-300 animate-pulse grow-0 shrink-0" />
                )}
                <span className={calcStep >= 1 ? "text-slate-700 font-bold" : "text-slate-400 font-medium"}>
                  Evaluating age & gestation vulnerability...
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {calcStep >= 2 ? (
                  <CheckCircle className="w-4 h-4 text-teal-600 grow-0 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-slate-300 grow-0 shrink-0" />
                )}
                <span className={calcStep >= 2 ? "text-slate-700 font-bold" : "text-slate-400 font-medium"}>
                  Analyzing blood pressure hazard values...
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {calcStep >= 3 ? (
                  <CheckCircle className="w-4 h-4 text-teal-600 grow-0 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-slate-300 grow-0 shrink-0" />
                )}
                <span className={calcStep >= 3 ? "text-slate-700 font-bold" : "text-slate-400 font-medium"}>
                  Normalizing urine protein concentration markers...
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {calcStep >= 4 ? (
                  <CheckCircle className="w-4 h-4 text-teal-600 grow-0 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-slate-300 grow-0 shrink-0" />
                )}
                <span className={calcStep >= 4 ? "text-slate-700 font-bold" : "text-slate-400 font-medium"}>
                  Cross-referencing critical threat symptoms...
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {calcStep >= 5 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 grow-0 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-slate-300 grow-0 shrink-0" />
                )}
                <span className={calcStep >= 5 ? "text-slate-700 font-bold" : "text-slate-400 font-medium"}>
                  Assigning risk triage level and referral note...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* RISK DIAGNOSTIC DETAILS PAGE */}
        {activeWorkflow === "triage_results" && evaluationRecord && (
          <div className="animate-fadeIn">
            <TriageResult
              record={evaluationRecord}
              onGoToReferral={() => setActiveWorkflow("referral_note")}
              onRestart={() => {
                setEvaluationRecord(null);
                setActiveWorkflow("dashboard");
                setActiveTab("hub");
              }}
            />
          </div>
        )}

        {/* PRINTABLE OFFICIAL REFERRAL NOTE DOC */}
        {activeWorkflow === "referral_note" && evaluationRecord && (
          <div className="animate-fadeIn">
            <ReferralNoteView
              record={evaluationRecord}
              onBack={() => {
                if (evaluationRecord.riskLevel === RiskLevel.HIGH) {
                  setActiveWorkflow("triage_results");
                } else {
                  setActiveWorkflow("dashboard");
                  setActiveTab("history");
                }
              }}
              onSaveAndClose={handleSaveReferralNotes}
            />
          </div>
        )}
      </main>

      {/* Persistent Bottom Tab Navigation Bar */}
      {activeWorkflow === "dashboard" && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t py-2 border-slate-200 z-30 shadow-2xl px-4 no-print sm:py-3.5">
          <div className="max-w-md mx-auto grid grid-cols-4 gap-1 text-center font-sans">
            {/* Hub tab link */}
            <button
              onClick={() => setActiveTab("hub")}
              className={`flex flex-col items-center justify-center py-1 gap-1 group focus:outline-none transition-colors cursor-pointer ${
                activeTab === "hub" ? "text-teal-605" : "text-slate-400 hover:text-slate-550"
              }`}
            >
              <Heart className={`w-5.5 h-5.5 transition-transform group-hover:scale-105 stroke-[2.2] ${activeTab === "hub" ? "text-teal-600" : ""}`} />
              <span className={`text-[10px] font-black tracking-wider ${activeTab === "hub" ? "text-teal-700" : "text-slate-405"}`}>Assess</span>
            </button>

            {/* History tab link */}
            <button
              onClick={() => setActiveTab("history")}
              className={`flex flex-col items-center justify-center py-1 gap-1 group focus:outline-none transition-colors cursor-pointer ${
                activeTab === "history" ? "text-teal-605" : "text-slate-400 hover:text-slate-550"
              }`}
            >
              <ClipboardList className={`w-5.5 h-5.5 transition-transform group-hover:scale-105 stroke-[2.2] ${activeTab === "history" ? "text-teal-600" : ""}`} />
              <span className={`text-[10px] font-black tracking-wider ${activeTab === "history" ? "text-teal-700" : "text-slate-405"}`}>Logbook</span>
            </button>

            {/* Patients tracking graph */}
            <button
              onClick={() => setActiveTab("patients")}
              className={`flex flex-col items-center justify-center py-1 gap-1 group focus:outline-none transition-colors cursor-pointer ${
                activeTab === "patients" ? "text-teal-605" : "text-slate-400 hover:text-slate-550"
              }`}
            >
              <Activity className={`w-5.5 h-5.5 transition-transform group-hover:scale-105 stroke-[2.2] ${activeTab === "patients" ? "text-teal-600" : ""}`} />
              <span className={`text-[10px] font-black tracking-wider ${activeTab === "patients" ? "text-teal-700" : "text-slate-405"}`}>Patients</span>
            </button>

            {/* Education tab link */}
            <button
              onClick={() => setActiveTab("education")}
              className={`flex flex-col items-center justify-center py-1 gap-1 group focus:outline-none transition-colors cursor-pointer ${
                activeTab === "education" ? "text-teal-605" : "text-slate-400 hover:text-slate-550"
              }`}
            >
              <BookOpen className={`w-5.5 h-5.5 transition-transform group-hover:scale-105 stroke-[2.2] ${activeTab === "education" ? "text-teal-600" : ""}`} />
              <span className={`text-[10px] font-black tracking-wider ${activeTab === "education" ? "text-teal-700" : "text-slate-455"}`}>Protocols</span>
            </button>
          </div>
        </nav>
      )}

      {/* Simple footer for printable layout styling */}
      <footer className="bg-white border-t py-4 text-center text-slate-400 text-xs mt-12 print:hidden no-print">
        <p>© 2026 Ghana Health Service Obstetric Division. All safety calculations validated. Pre-eclampsia clinical support widget.</p>
      </footer>
    </div>
  );
}
