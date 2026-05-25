/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PatientRegistration, ClinicalEvaluation, ProteinuriaLevel, SwellingLevel, RiskLevel, AssessmentRecord } from "../types";
import { AlertCircle, ArrowRight, ArrowLeft, Heart, Sparkles, Activity, Plus, Minus, UserCheck, ShieldAlert, Check } from "lucide-react";

interface ActiveAssessmentProps {
  onComplete: (registration: PatientRegistration, clinical: ClinicalEvaluation) => void;
  onCancel: () => void;
}

export default function ActiveAssessment({ onComplete, onCancel }: ActiveAssessmentProps) {
  const [assessmentStage, setAssessmentStage] = useState<"reg" | "clin">("reg");
  const [activeStep, setActiveStep] = useState(1);

  // --- State 1: Patient Registration Data ---
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState(24);
  const [gestationalWeeks, setGestationalWeeks] = useState(32);
  const [previousPregnancies, setPreviousPregnancies] = useState(1);
  const [previousPreeclampsia, setPreviousPreeclampsia] = useState(false);

  // --- State 2: Patient Clinical Vitals ---
  const [systolicBp, setSystolicBp] = useState(120);
  const [diastolicBp, setDiastolicBp] = useState(80);
  const [proteinuria, setProteinuria] = useState<ProteinuriaLevel>(ProteinuriaLevel.NONE);
  const [swelling, setSwelling] = useState<SwellingLevel>(SwellingLevel.NONE_MILD);

  // Alarm Symptoms Checklist
  const [severeHeadache, setSevereHeadache] = useState(false);
  const [visionChanges, setVisionChanges] = useState(false);
  const [ribPain, setRibPain] = useState(false);
  const [shortnessOfBreath, setShortnessOfBreath] = useState(false);

  // Pre-existing risk checklist
  const [chronicHypertension, setChronicHypertension] = useState(false);
  const [preExistingDiabetes, setPreExistingDiabetes] = useState(false);
  const [multiplePregnancy, setMultiplePregnancy] = useState(false);

  const [midwifeNotes, setMidwifeNotes] = useState("");

  const TOTAL_REG_STEPS = 5;
  const TOTAL_CLIN_STEPS = 5;

  const getTrimesterLabel = (weeks: number) => {
    if (weeks <= 12) return "Trimester 1 (Weeks 4-12)";
    if (weeks <= 26) return "Trimester 2 (Weeks 13-26)";
    return "Trimester 3 (Weeks 27-42) • Deep pre-eclampsia risk phase";
  };

  const calculateBpStatus = (sys: number, dia: number) => {
    if (sys >= 160 || dia >= 110) {
      return {
        label: "Critical Hypertension! Emergency Advice Triggered",
        color: "text-red-650 bg-red-100",
        gaugeColor: "border-red-600 bg-red-500",
        percentage: 92,
      };
    }
    if (sys >= 140 || dia >= 90) {
      return {
        label: "Mild/Moderate Gestational Hypertension",
        color: "text-amber-700 bg-amber-100",
        gaugeColor: "border-amber-500 bg-amber-400",
        percentage: 65,
      };
    }
    return {
      label: "Baseline Hypertension Safe (Healthy Level)",
      color: "text-emerald-700 bg-emerald-100",
      gaugeColor: "border-emerald-500 bg-emerald-500",
      percentage: 35,
    };
  };

  const bpStatus = calculateBpStatus(systolicBp, diastolicBp);

  // Handle Wizard Navigation
  const handleRegNext = () => {
    if (activeStep < TOTAL_REG_STEPS) {
      setActiveStep(activeStep + 1);
    } else {
      // Switch from Registration stage to clinical Stage
      setAssessmentStage("clin");
      setActiveStep(1);
    }
  };

  const handleRegPrev = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    } else {
      onCancel();
    }
  };

  const handleClinNext = () => {
    if (activeStep < TOTAL_CLIN_STEPS) {
      setActiveStep(activeStep + 1);
    } else {
      // Completed both stages! Submit evaluation state
      const registration: PatientRegistration = {
        fullName: fullName.trim() || "Maternity Patient",
        age,
        gestationalWeeks,
        previousPregnancies,
        previousPreeclampsia,
      };

      const clinical: ClinicalEvaluation = {
        systolicBp,
        diastolicBp,
        proteinuria,
        swelling,
        symptoms: {
          severeHeadache,
          visionChanges,
          ribPain,
          shortnessOfBreath,
        },
        chronicHypertension,
        preExistingDiabetes,
        multiplePregnancy,
        notes: midwifeNotes.trim(),
      };

      onComplete(registration, clinical);
    }
  };

  const handleClinPrev = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    } else {
      // Switch back to Registration stage, step 5
      setAssessmentStage("reg");
      setActiveStep(TOTAL_REG_STEPS);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[500px] flex flex-col justify-between">
      {/* Top Banner Indicator */}
      <div className="bg-slate-900 px-6 py-4.5 text-white flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 block font-bold">
            Ghana Clinical Protocol Hub
          </span>
          <h2 className="text-base font-extrabold tracking-tight mt-0.5">
            {assessmentStage === "reg" ? "Patient Demographic Intake" : "Objective Bedside Screening"}
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold bg-slate-800 py-1.5 px-3 rounded-full border border-slate-700">
            {assessmentStage === "reg"
              ? `Demographics: Step ${activeStep} of ${TOTAL_REG_STEPS}`
              : `Vitals & Symptoms: Step ${activeStep} of ${TOTAL_CLIN_STEPS}`}
          </span>
        </div>
      </div>

      {/* Joint Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100 flex">
        {/* Registration bar progress section */}
        <div className="flex-1 flex gap-0.5 mr-0.5">
          {Array.from({ length: TOTAL_REG_STEPS }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                assessmentStage === "clin"
                  ? "bg-teal-600"
                  : activeStep >= idx + 1
                  ? "bg-teal-500"
                  : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        {/* Clinical bar progress section */}
        <div className="flex-1 flex gap-0.5">
          {Array.from({ length: TOTAL_CLIN_STEPS }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full flex-1 transition-all duration-300 ${
                assessmentStage === "clin" && activeStep >= idx + 1 ? "bg-red-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Body Canvas - Dynamic questions */}
      <div className="p-6 md:p-10 flex-1 flex flex-col justify-center">
        {assessmentStage === "reg" ? (
          /* REGISTRATION PROGRESS VIEWS */
          <div className="space-y-6">
            {/* Step 1: Full Name */}
            {activeStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col-reverse md:flex-row gap-6 md:items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block mb-1">
                      Step 1 of 5
                    </span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                      Tell us about your patient
                    </h3>
                    <p className="text-sm text-slate-500 leading-normal mt-1">
                      Please register the patient's full clinical identity.
                    </p>
                  </div>
                  <div className="w-24 h-24 shrink-0 overflow-hidden rounded-2xl border bg-teal-50 p-1 flex items-center justify-center self-center md:self-auto">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcnqwu8wyQrFbxqg8T1ogHpPCxtmO1250PCNp2bPycUhb9t1GfEqqFfAn2XPWctX8En9HYScQl9B6gZhHcajg6-orDivauszeQzPG0iXWb3wfed-y3ibQ_1cOZwvZ1Pze2k54TGKPJJiWf1SZ7vO1K8yhN9jbZ9W2611trUDst1E5-8gDMVeF1qqRtYBq8KXxnUAd7TStlSsW6F1x1hqZHWZOy9p7sLdTAsVV7_6xZF_42FJSK-f5-cksi8J5hlpPhYHfmMyu8KwQ"
                      alt="Midwife and patient registration"
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-mono font-bold text-slate-450 uppercase">
                    Patient's Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name of pregnant mother"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-base font-semibold px-4 py-3 border-2 border-slate-200 outline-none rounded-2xl focus:border-teal-500 transition-all font-sans"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Patient Age */}
            {activeStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block mb-1">
                    Step 2 of 5
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    How old is the patient?
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Age is a vital preeclampsia susceptibility cofactor.
                  </p>
                </div>

                <div className="flex justify-center items-center gap-6 py-4">
                  <button
                    onClick={() => setAge(Math.max(12, age - 1))}
                    className="p-3.5 border-2 border-slate-200 hover:border-teal-500 text-slate-600 rounded-2xl active:scale-90 transition-all cursor-pointer"
                  >
                    <Minus className="w-6 h-6" />
                  </button>
                  <div className="text-center min-w-[120px]">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">
                      {age}
                    </span>
                    <span className="text-xs text-slate-405 block font-bold tracking-widest uppercase mt-1">
                      Years Old
                    </span>
                  </div>
                  <button
                    onClick={() => setAge(Math.min(55, age + 1))}
                    className="p-3.5 border-2 border-slate-200 hover:border-teal-500 text-slate-600 rounded-2xl active:scale-90 transition-all cursor-pointer"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>

                {(age < 18 || age > 35) && (
                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/60 flex gap-3 items-start">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-800">Extreme Maternal Age Factor</h4>
                      <p className="text-[11px] text-amber-700 leading-relaxed mt-0.5">
                        Teenagers under 18 and elderly patients older than 35 hold significantly elevated baseline physiological risks for hypertensive pregnancy disorders.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Gestational Weeks */}
            {activeStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block mb-1">
                    Step 3 of 5
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    Current Gestational Age (Weeks)
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Preeclampsia typically triggers **after 20 weeks** of pregnancy.
                  </p>
                </div>

                <div className="flex justify-center items-center gap-6 py-2">
                  <button
                    onClick={() => setGestationalWeeks(Math.max(4, gestationalWeeks - 1))}
                    className="p-3 border-2 border-slate-200 hover:border-teal-500 text-slate-600 rounded-2xl active:scale-95 transition-all cursor-pointer"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="text-center min-w-[140px]">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">
                      {gestationalWeeks}
                    </span>
                    <span className="text-xs text-slate-400 block font-bold tracking-wide mt-1">
                      Gestation Weeks
                    </span>
                  </div>
                  <button
                    onClick={() => setGestationalWeeks(Math.min(42, gestationalWeeks + 1))}
                    className="p-3 border-2 border-slate-200 hover:border-teal-500 text-slate-600 rounded-2xl active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-200/70">
                  <span className="text-xs font-bold text-teal-700 block uppercase tracking-wider mb-1.5">Trimester Classification</span>
                  <p className="text-xs text-slate-700 font-semibold">{getTrimesterLabel(gestationalWeeks)}</p>

                  {gestationalWeeks < 20 ? (
                    <div className="mt-3 text-[11px] text-slate-500 leading-normal bg-orange-50 p-2.5 rounded-lg border border-orange-200 text-left flex gap-1.5 items-start">
                      <AlertCircle className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                      <span>Note: True pre-eclampsia requires gestation ≥ 20 weeks. High blood pressure before 20 weeks typically refers to **Chronic Hypertension** or molar gestational dynamics.</span>
                    </div>
                  ) : (
                    <div className="mt-3 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-left flex gap-1.5 items-start">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Patient has passed the critical 20-week transition. Urinalysis and objective pressure screen checks are now clinical baseline essentials.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Previous Pregnancies */}
            {activeStep === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block mb-1">
                    Step 4 of 5
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    Prior Pregnancies (Parity)
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    First pregnancy (parity 0) represents a key risk cohort coefficient.
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-3 pt-6">
                  {[0, 1, 2, "3+"].map((cnt, i) => (
                    <button
                      key={i}
                      onClick={() => setPreviousPregnancies(i)}
                      className={`py-4 rounded-2xl font-black text-lg border-2 transition-all cursor-pointer ${
                        previousPregnancies === i
                          ? "bg-teal-600 text-white border-teal-600 shadow-md"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-500"
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>

                {previousPregnancies === 0 && (
                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/60 leading-normal flex gap-3 items-start text-left mt-4 text-xs text-amber-800">
                    <AlertCircle className="w-5 h-5 text-amber-650 shrink-0" />
                    <div>
                      <h4 className="font-bold">Nulliparous (First Pregnancy) Risk</h4>
                      <p className="text-[11px] text-amber-700 mt-0.5">
                        First-time mothers hold a statistically higher baseline incidence of new-onset hypertensive disorders compared to multiparous mothers. Keep screen meticulous.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Prior Preeclampsia */}
            {activeStep === 5 && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block mb-1">
                    Step 5 of 5
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    History of past pre-eclampsia?
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Recurrence is highly common under secondary pregnancies.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-6">
                  <button
                    onClick={() => setPreviousPreeclampsia(true)}
                    className={`p-6 rounded-2xl border-2 font-black transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                      previousPreeclampsia
                        ? "bg-red-50 text-red-800 border-red-500 ring-2 ring-red-500/10 shadow-lg"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-red-500"
                    }`}
                  >
                    <span className="text-xl font-bold">YES</span>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                      Prior clinical history
                    </span>
                  </button>

                  <button
                    onClick={() => setPreviousPreeclampsia(false)}
                    className={`p-6 rounded-2xl border-2 font-black transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
                      !previousPreeclampsia
                        ? "bg-emerald-50 text-emerald-800 border-emerald-500 ring-2 ring-emerald-500/10 shadow-lg"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-500"
                    }`}
                  >
                    <span className="text-xl font-bold">NO / N/A</span>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                      No positive history
                    </span>
                  </button>
                </div>

                {previousPreeclampsia && (
                  <div className="bg-red-50 text-red-900 border border-red-200 p-4.5 rounded-2xl flex gap-3.5 items-start text-xs leading-normal">
                    <ShieldAlert className="w-6 h-6 text-red-650 shrink-0" />
                    <div>
                      <h4 className="font-extrabold uppercase text-red-950">CRITICAL RISK PRECURSER ENVELOPE</h4>
                      <p className="text-[11px] text-red-900 mt-0.5">
                        A history of prior gestational preeclampsia represents one of the strongest prospective risk indicators. This patient requires extremely careful blood pressure check and proteinuria screening.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* CLINICAL METRICS STEP VIEWS */
          <div className="space-y-6">
            {/* Step 1: Blood Pressure */}
            {activeStep === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col-reverse md:flex-row gap-6 md:items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest block mb-1">
                      Step 1 of 5 (Vitals)
                    </span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                      What is her blood pressure reading?
                    </h3>
                  </div>
                  <div className="w-20 h-20 bg-red-50 rounded-2xl p-1 flex items-center justify-center shrink-0 self-center md:self-auto border border-red-200">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoAQqXnRKl4u3DVNZ7hGcz6bHmfwUyTLYmSWaMvlMcT7K13USKi9qNL9ywutTy7UglPIc3ajxlpWApu01Cet9U4tJxYbD86DaS3DWhIRGSoQlMARSDEw7qGAgPNZJavsUaeMjxiTa7gULTWboyEJnyWRilDFlCOGZsi76HlqAHmHH4kCU8oWAM7wMb1ytpsFUYglNIIPtDsNiKbC3cgiBnwjCoXTuPt7d81CwcLNSCqIEE5601uAmckd5etEfmxwfIKZZ39g1q0N4"
                      alt="Sphygmomanometer gauge"
                      className="w-16 h-16 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Semicircle interactive scale simulation */}
                <div className="relative py-4 flex flex-col items-center">
                  <div className="w-full max-w-sm h-3 bg-slate-200 rounded-full overflow-hidden relative mb-4">
                    <div
                      className={`h-full transition-all duration-300 ${bpStatus.gaugeColor}`}
                      style={{ width: `${bpStatus.percentage}%` }}
                    />
                  </div>
                  <div className={`px-4 py-2 rounded-full font-bold text-xs ${bpStatus.color}`}>
                    {bpStatus.label}
                  </div>
                </div>

                {/* Micro-steppers for Systolic & Diastolic BP */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Systolic stepper */}
                  <div className="bg-slate-50 border rounded-2xl p-4.5 space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-bold uppercase font-mono text-slate-450 tracking-wide">
                        SYSTOLIC BP
                      </span>
                      <span className="text-slate-400 text-[10px] font-mono">Heart Contraction</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSystolicBp(Math.max(70, systolicBp - 5))}
                        className="py-1.5 px-3 border rounded-xl hover:border-teal-500 font-bold active:scale-90 transition-all cursor-pointer"
                      >
                        -5
                      </button>
                      <div className="text-center">
                        <span className={`text-4xl font-black ${systolicBp >= 140 ? "text-red-650" : "text-slate-800"}`}>
                          {systolicBp}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block pb-1">mmHg</span>
                      </div>
                      <button
                        onClick={() => setSystolicBp(Math.min(240, systolicBp + 5))}
                        className="py-1.5 px-3 border rounded-xl hover:border-teal-500 font-bold active:scale-90 transition-all cursor-pointer"
                      >
                        +5
                      </button>
                    </div>

                    <input
                      type="range"
                      min="70"
                      max="220"
                      value={systolicBp}
                      step="1"
                      onChange={(e) => setSystolicBp(Number(e.target.value))}
                      className="w-full accent-red-500"
                    />
                  </div>

                  {/* Diastolic stepper */}
                  <div className="bg-slate-50 border rounded-2xl p-4.5 space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-bold uppercase font-mono text-slate-450 tracking-wide">
                        DIASTOLIC BP
                      </span>
                      <span className="text-slate-400 text-[10px] font-mono">Heart Relaxed</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setDiastolicBp(Math.max(40, diastolicBp - 5))}
                        className="py-1.5 px-3 border rounded-xl hover:border-teal-500 font-bold active:scale-90 transition-all cursor-pointer"
                      >
                        -5
                      </button>
                      <div className="text-center">
                        <span className={`text-4xl font-black ${diastolicBp >= 90 ? "text-red-650" : "text-slate-800"}`}>
                          {diastolicBp}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block pb-1">mmHg</span>
                      </div>
                      <button
                        onClick={() => setDiastolicBp(Math.min(160, diastolicBp + 5))}
                        className="py-1.5 px-3 border rounded-xl hover:border-teal-500 font-bold active:scale-90 transition-all cursor-pointer"
                      >
                        +5
                      </button>
                    </div>

                    <input
                      type="range"
                      min="40"
                      max="140"
                      value={diastolicBp}
                      step="1"
                      onChange={(e) => setDiastolicBp(Number(e.target.value))}
                      className="w-full accent-red-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Urinalysis / Protein urine */}
            {activeStep === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col-reverse md:flex-row gap-6 md:items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-red-605 uppercase tracking-widest block mb-1">
                      Step 2 of 5 (Vitals)
                    </span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight font-sans">
                      What did the urine test show?
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed mt-1">
                      Proteinuria confirms glomerular kidney leakage induced by pre-eclampsia.
                    </p>
                  </div>
                  <div className="w-20 h-20 bg-yellow-50 rounded-2xl p-1 flex items-center justify-center shrink-0 border border-yellow-250 self-center md:self-auto">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3CRhL_jOSGlStX6vqsUN1YNr5VKvWscDnCE2EcFTbUVZsgGogWWuEcx3m4uR9iH6gdPEJcT6wwFOqZ1EpEDUwFEBamhZjVCoPXfGIOBbgHR6deBgmv94MTIOC5MP2fvoGr1p-ZnFW2whQhjbO1UFLYpqfp3yr1ZjwHtzJ5q5dXcNwoKq7jjQX54jtzoNBQNs1KowPSWui6xRCeJ6d4Z1-Z63vSX3chYM-giyZZcyBOZol44QC1QSl18uWrniTqH9Ef7-tIAY09Cc"
                      alt="Urine strip indicators"
                      className="w-16 h-16 object-cover rounded"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5 py-3">
                  {Object.values(ProteinuriaLevel).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setProteinuria(lvl)}
                      className={`p-4 rounded-xl border-2 font-bold text-sm text-left transition-all justify-between items-center flex cursor-pointer ${
                        proteinuria === lvl
                          ? "bg-teal-50 text-teal-900 border-teal-500 ring-1 ring-teal-500/20"
                          : "bg-slate-55 text-slate-700 border-slate-200 hover:border-teal-500"
                      }`}
                    >
                      <div>
                        <div className="font-extrabold text-base">{lvl}</div>
                        <div className="text-[10px] text-slate-400 lowercase font-mono">
                          {lvl === ProteinuriaLevel.NONE
                            ? "Negative urine leak"
                            : lvl === ProteinuriaLevel.TRACE
                            ? "Minor track leak"
                            : lvl === ProteinuriaLevel.PLUS_1
                            ? "Significant (1+)"
                            : "Severe protein loss (2+)"}
                        </div>
                      </div>
                      {proteinuria === lvl && (
                        <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-black">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="bg-slate-50 border p-4 rounded-xl text-left flex gap-3 text-xs text-slate-600 leading-normal">
                  <AlertCircle className="w-5 h-5 text-teal-650 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-800">Protocol Tip: Clean Catch</h5>
                    <p className="mt-0.5">Note: Ensure a **midstream clean-catch urine sample** is tested to prevent false-positives caused by amniotic fluid or vaginal discharge contamination.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Swelling */}
            {activeStep === 3 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col-reverse md:flex-row gap-6 md:items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest block mb-1">
                      Step 3 of 5 (Vitals)
                    </span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                      Does she have unusual swelling?
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 leading-normal">
                      Pitting oedema after rest is a key symptom metric.
                    </p>
                  </div>
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl p-1 flex items-center justify-center shrink-0 border overflow-hidden self-center md:self-auto">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX_EJsaktW3TIOzJmWZ3_TUuzewNS0aC7htAHLZ0qmj4MAUDJvs1XQ7Imk40LuE9pG_5RYV0OfjY3GW2C2YEmXi_JT0qrqTgNZ1gfvOdhqAEhyUK3R0hJXGHG6a6GEpq6mRFOIsUz8cwK4Qnc4Is8ZQAbdZDWG47fG1kkyPU1ggwDiwKXJDQhTuhsRjqSta_Vltb_tef5Mmum-ZlLgKXUZDsD2YA1zWxoNAFMfDjBgMxX2zBL28KHc4OdruQB4tmzQopMKmbyjxnw"
                      alt="Leg pitting swelling demo"
                      className="w-18 h-18 object-cover rounded"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="space-y-3 py-3">
                  <button
                    onClick={() => setSwelling(SwellingLevel.NONE_MILD)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      swelling === SwellingLevel.NONE_MILD
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-slate-50 text-slate-700 border-slate-205 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <strong className="text-sm font-bold block">No Swelling / Normal Local Foot Swelling</strong>
                      <span className="text-[10px] text-slate-400 block font-medium mt-0.5">No imprint remains after pressing ankle tissue.</span>
                    </div>
                    {swelling === SwellingLevel.NONE_MILD && <div className="text-xs font-bold">✓ Active</div>}
                  </button>

                  <button
                    onClick={() => setSwelling(SwellingLevel.FEET_ONLY)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      swelling === SwellingLevel.FEET_ONLY
                        ? "bg-amber-50 text-amber-900 border-amber-500"
                        : "bg-slate-50 text-slate-700 border-slate-205 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <strong className="text-sm font-bold block">Symmetrical Foot/Ankle Pitting Oedema</strong>
                      <span className="text-[10px] text-slate-550 block font-medium mt-0.5">Slight visible depth indentation remaining on legs.</span>
                    </div>
                    {swelling === SwellingLevel.FEET_ONLY && <div className="text-xs font-bold text-amber-750">✓ Active</div>}
                  </button>

                  <button
                    onClick={() => setSwelling(SwellingLevel.FACE_OR_HANDS)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      swelling === SwellingLevel.FACE_OR_HANDS
                        ? "bg-red-50 text-red-955 border-red-500"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <strong className="text-sm font-bold block">Severe Swelling in Face, Hands or Abdomen</strong>
                      <span className="text-[10px] text-slate-550 block font-medium mt-0.5">Highly suspicious pre-eclampsia trigger. Eye puffiness or hand ballooning.</span>
                    </div>
                    {swelling === SwellingLevel.FACE_OR_HANDS && <div className="text-xs font-bold text-red-750">✓ Alarming Sign</div>}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Severe Symptoms */}
            {activeStep === 4 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col-reverse md:flex-row gap-6 md:items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-red-650 uppercase tracking-widest block mb-1">
                      Step 4 of 5 (Vitals)
                    </span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight font-sans">
                      Is she experiencing any of these?
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 leading-normal text-left">
                      These are **clinical target danger signs** indicating impending end-organ breakdown or eclamptic shock.
                    </p>
                  </div>
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl p-1 flex items-center justify-center shrink-0 border self-center md:self-auto overflow-hidden">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBp_vIgFY7MbcuiFtY47XT1tOH6JMCzy-Nlx6g08Lo9jmzQwtyTVuQVWF_vwJ9YKSQMkCfHg7B0GZ6-GlehuT9IR4QahQyNZ1wnxBzSZGuCKE0bgbXv-7FPTxC7UQwuEDQsWosIzIaOJIigymlXAzRBiJOy17cDqw-SoYxbxTH5-LQ2gQ2U0bVpwNrE6hgudTCpbSvAm1O5KCyQ9NcoZpEv6fvp6mZgxSkrG6HT-s0rukixD3VeXmHsNh1yMPQoussN3j0h31hP0FQ"
                      alt="Symptoms diagram overview"
                      className="w-18 h-18 object-cover rounded"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2 text-left">
                  {/* Headache */}
                  <div
                    onClick={() => setSevereHeadache(!severeHeadache)}
                    className={`p-3.5 border rounded-xl flex items-center gap-3 cursor-pointer transition select-none ${
                      severeHeadache ? "bg-red-50 text-red-900 border-red-500" : "bg-slate-50 hover:bg-slate-100 border-slate-205"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center text-[9px] font-black ${
                      severeHeadache ? "bg-red-650 border-red-600 text-white" : "border-slate-350 bg-white text-transparent"
                    }`}>✓</span>
                    <div>
                      <strong className="text-xs font-bold block">Severe Pounding Headache</strong>
                      <span className="text-[10px] text-slate-450 block leading-tight">Unresponsive to regular paracetamol.</span>
                    </div>
                  </div>

                  {/* Vision */}
                  <div
                    onClick={() => setVisionChanges(!visionChanges)}
                    className={`p-3.5 border rounded-xl flex items-center gap-3 cursor-pointer transition select-none ${
                      visionChanges ? "bg-red-50 text-red-900 border-red-500" : "bg-slate-50 hover:bg-slate-100 border-slate-205"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center text-[9px] font-black ${
                      visionChanges ? "bg-red-650 border-red-600 text-white" : "border-slate-350 bg-white"
                    }`}>✓</span>
                    <div>
                      <strong className="text-xs font-bold block">Visual Spots or Blur</strong>
                      <span className="text-[10px] text-slate-450 block leading-tight">Double vision, flashes, or blind segments.</span>
                    </div>
                  </div>

                  {/* Rib Pain */}
                  <div
                    onClick={() => setRibPain(!ribPain)}
                    className={`p-3.5 border rounded-xl flex items-center gap-3 cursor-pointer transition select-none ${
                      ribPain ? "bg-red-50 text-red-900 border-red-500" : "bg-slate-50 hover:bg-slate-100 border-slate-205"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center text-[9px] font-black ${
                      ribPain ? "bg-red-650 border-red-600 text-white" : "border-slate-350 bg-white"
                    }`}>✓</span>
                    <div>
                      <strong className="text-xs font-bold block">Epigastric Pain Under Ribs</strong>
                      <span className="text-[10px] text-slate-450 block leading-tight">Stomach liver swelling tightness.</span>
                    </div>
                  </div>

                  {/* Breathing */}
                  <div
                    onClick={() => setShortnessOfBreath(!shortnessOfBreath)}
                    className={`p-3.5 border rounded-xl flex items-center gap-3 cursor-pointer transition select-none ${
                      shortnessOfBreath ? "bg-red-50 text-red-900 border-red-500" : "bg-slate-50 hover:bg-slate-100 border-slate-205"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center text-[9px] font-black ${
                      shortnessOfBreath ? "bg-red-650 border-red-600 text-white" : "border-slate-350 bg-white"
                    }`}>✓</span>
                    <div>
                      <strong className="text-xs font-bold block">Shortness of Breath (Dyspnea)</strong>
                      <span className="text-[10px] text-slate-450 block leading-tight">Due to fluid leakage into thoracic lung spaces.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Underlying risk checklist */}
            {activeStep === 5 && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex flex-col-reverse md:flex-row gap-6 md:items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-widest block mb-1">
                      Step 5 of 5 (Vitals)
                    </span>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                      Pre-existing Risk Factors
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Confirm if she holds any of these co-morbid baselines.
                    </p>
                  </div>
                  <div className="w-20 h-20 bg-emerald-50 rounded-2xl p-1 flex items-center justify-center border border-emerald-200 shrink-0 self-center md:self-auto overflow-hidden">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQnxWCj5xeAtVB7WzPb0pkYthXu99P7cnwP6IIzX66Fzau82Shfk5o79MZ8azyK320rewPJ0ZWEKHYW5rQ77c-timL4tUZERFIz9QlYVthqlfjzkmCl1LfsBPD6HxMaBqopkHT_82ti0xKSOVT6AcjlCYLwkMIW8TkszxmuZVA8NC0QcVDif_U3RNdEGBHhcJ6BcKZ75qROZpo4_VXvUhlXNHKeKeE8v_91kMYUNu0xI7BYMR__0U7P1CghR1YMH0_hcLjYlWvOWU"
                      alt="Twins multiple pregnancy risk graphics"
                      className="w-18 h-18 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="space-y-3.5 pt-2 text-left">
                  {/* Chronic HP */}
                  <div
                    onClick={() => setChronicHypertension(!chronicHypertension)}
                    className={`p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition select-none ${
                      chronicHypertension ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 hover:bg-slate-100 border-slate-205"
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <span className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center text-[9px] font-black ${
                        chronicHypertension ? "bg-teal-500 border-teal-500 text-white animate-pulse" : "border-slate-350 bg-white text-transparent"
                      }`}>✓</span>
                      <div>
                        <strong className="text-xs font-bold block">Chronic high BP before pregnancy</strong>
                        <span className="text-[10px] text-slate-400 block pb-0.5">Diagnosed prior to current gestation period.</span>
                      </div>
                    </div>
                  </div>

                  {/* Diabetes */}
                  <div
                    onClick={() => setPreExistingDiabetes(!preExistingDiabetes)}
                    className={`p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition select-none ${
                      preExistingDiabetes ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 hover:bg-slate-100 border-slate-205"
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <span className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center text-[9px] font-black ${
                        preExistingDiabetes ? "bg-teal-500 border-teal-500 text-white animate-pulse" : "border-slate-350 bg-white"
                      }`}>✓</span>
                      <div>
                        <strong className="text-xs font-bold block">Pre-existing Diabetes mellitus</strong>
                        <span className="text-[10px] text-slate-400 block pb-0.5">Known insulin dependent or gestational history.</span>
                      </div>
                    </div>
                  </div>

                  {/* Twins */}
                  <div
                    onClick={() => setMultiplePregnancy(!multiplePregnancy)}
                    className={`p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition select-none ${
                      multiplePregnancy ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 hover:bg-slate-100 border-slate-205"
                    }`}
                  >
                    <div className="flex gap-3 items-center">
                      <span className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center text-[9px] font-black ${
                        multiplePregnancy ? "bg-teal-500 border-teal-500 text-white animate-pulse" : "border-slate-350 bg-white"
                      }`}>✓</span>
                      <div>
                        <strong className="text-xs font-bold block">Expecting twins, triplets or more</strong>
                        <span className="text-[10px] text-slate-400 block pb-0.5">Placental volumetric overload factor.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Free midwife notes input */}
                <div className="space-y-1 text-left mt-3">
                  <label className="block text-[10px] font-bold font-mono text-slate-400 uppercase">
                    Free Text Midwife observations
                  </label>
                  <input
                    type="text"
                    value={midwifeNotes}
                    onChange={(e) => setMidwifeNotes(e.target.value)}
                    placeholder="E.g., Patient is highly anxious. Retested BP after 15mins rest on left arm. Fetal heart rate stable at 144 bpm."
                    className="w-full text-xs p-3 border rounded-xl bg-slate-50 focus:bg-white focus:border-teal-500 outline-none transition"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="p-6 bg-slate-50 border-t flex justify-between items-center">
        <button
          onClick={assessmentStage === "reg" ? handleRegPrev : handleClinPrev}
          className="flex items-center gap-1 py-2.5 px-4 text-xs font-bold text-slate-600 bg-white hover:bg-slate-100 border rounded-xl transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {assessmentStage === "reg" && activeStep === 1 ? "Exit Intake" : "Previous Step"}
        </button>

        <button
          onClick={assessmentStage === "reg" ? handleRegNext : handleClinNext}
          className={`flex items-center gap-1.5 py-3 px-6 text-sm font-black rounded-xl transition-all shadow active:scale-95 cursor-pointer ${
            assessmentStage === "reg"
              ? "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-700/10"
              : "bg-red-600 hover:bg-red-700 text-white shadow-red-700/10"
          }`}
        >
          {assessmentStage === "reg" && activeStep === TOTAL_REG_STEPS ? (
            <>
              Enter Vitals Screening
              <ArrowRight className="w-4 h-4" />
            </>
          ) : assessmentStage === "clin" && activeStep === TOTAL_CLIN_STEPS ? (
            <>
              Initialize Diagnostic Triaging
              <Sparkles className="w-4 h-4 ml-0.5" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
