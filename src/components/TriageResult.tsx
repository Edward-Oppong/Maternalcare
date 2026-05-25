/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AssessmentRecord, RiskLevel, SwellingLevel, ProteinuriaLevel } from "../types";
import { ShieldAlert, AlertCircle, CheckSquare, Phone, FileText, RefreshCw, Calendar, Eye, VolumeX, ShieldCheck, Heart, Printer, Download, BookOpen, Brain, Droplets, TrendingUp, Wind, Lightbulb, HelpCircle } from "lucide-react";
import { REFERRAL_FACILITIES } from "../data";
import ActiveCallSimulator from "./ActiveCallSimulator";

interface TriageResultProps {
  record: AssessmentRecord;
  onGoToReferral: () => void;
  onRestart: () => void;
}

export default function TriageResult({ record, onGoToReferral, onRestart }: TriageResultProps) {
  const [activeCallFacility, setActiveCallFacility] = useState<any | null>(null);

  // Quick protocol verification flags
  const [checkedO2, setCheckedO2] = useState(false);
  const [checkedIV, setCheckedIV] = useState(false);
  const [checkedMags, setCheckedMags] = useState(false);
  const [checkedVitals, setCheckedVitals] = useState(false);

  // Beginner education active sub-tab
  const [eduTab, setEduTab] = useState<"cardio" | "renal" | "neuro" | "hepatic">("cardio");

  const isHighRisk = record.riskLevel === RiskLevel.HIGH;
  const isModerateRisk = record.riskLevel === RiskLevel.MODERATE;

  const getUrinalysisLabel = (lvl: ProteinuriaLevel) => {
    switch (lvl) {
      case ProteinuriaLevel.NONE:
        return "Negative (None)";
      case ProteinuriaLevel.TRACE:
        return "Trace (±)";
      case ProteinuriaLevel.PLUS_1:
        return "1+ Positive (Mild)";
      case ProteinuriaLevel.PLUS_2_OR_MORE:
        return "2+ or more (Severe Protein Leak)";
    }
  };

  const getSwellingLabel = (lvl: SwellingLevel) => {
    switch (lvl) {
      case SwellingLevel.NONE_MILD:
        return "None or Mild localized feet bloating";
      case SwellingLevel.FEET_ONLY:
        return "Significant symmetrical foot pitting oedema";
      case SwellingLevel.FACE_OR_HANDS:
        return "Severe systemic face/hands pitting oedema (High alarm sign)";
    }
  };

  // Programmatic generation of a highly styled, print-friendly offline clinical document (Export to PDF)
  const handleExportPDF = () => {
    const formattedDate = new Date(record.timestamp).toLocaleString("en-GH");
    const urinalysisText = getUrinalysisLabel(record.clinical.proteinuria);
    const swellingText = getSwellingLabel(record.clinical.swelling);

    const symptomsList = [
      record.clinical.symptoms.severeHeadache ? "Severe constant headache (Suspected cerebral vasospasm)" : "",
      record.clinical.symptoms.visionChanges ? "Visual distortion / blur / spots (Cerebral cortical irritation)" : "",
      record.clinical.symptoms.ribPain ? "Severe upper right rib / epigastric pain (Glisson's capsule stretch)" : "",
      record.clinical.symptoms.shortnessOfBreath ? "Shortness of breath / Dyspnea (Impending lung fluid shift)" : ""
    ].filter(Boolean);
    const symptomsText = symptomsList.length > 0 ? symptomsList.join(", ") : "No high-acuity symptoms flagged";

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GHS Maternal Triage Report - ${record.registration.fullName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background-color: #faf7f1;
      color: #352b22;
      padding: 30px;
      line-height: 1.5;
    }
    .wrapper {
      max-width: 800px;
      margin: 0 auto;
      background: #fdfbf7;
      border: 2px solid #dfd6c0;
      border-radius: 16px;
      padding: 35px;
      position: relative;
    }
    .flag-bar {
      display: flex;
      height: 6px;
      margin: -35px -35px 25px -35px;
      border-top-left-radius: 14px;
      border-top-right-radius: 14px;
      overflow: hidden;
    }
    .fb-red { background: #ba3b2c; flex: 1; }
    .fb-yellow { background: #d18227; flex: 1; }
    .fb-green { background: #277363; flex: 1; }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #dfd6c0;
      padding-bottom: 20px;
      margin-bottom: 25px;
    }
    .logo-container {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .ghs-tag {
      background: #14493e;
      color: #faf7f1;
      font-size: 22px;
      font-weight: 900;
      padding: 8px 12px;
      border-radius: 8px;
    }
    .header-text h1 {
      font-size: 18px;
      font-weight: 800;
      color: #14493e;
      text-transform: uppercase;
    }
    .header-text p {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
      color: #a59583;
    }
    .triage-badge {
      text-align: right;
    }
    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    .badge.high { background: #fde8e5; color: #ba3b2c; border: 1px solid #fac7c0; }
    .badge.mod { background: #fef0db; color: #aa6315; border: 1px solid #fcd9ae; }
    .badge.low { background: #e2f0e6; color: #3a8559; border: 1px solid #bad5cc; }
    
    .section-title {
      font-size: 11px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      color: #277363;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid #dfd6c0;
      padding-bottom: 4px;
      margin: 25px 0 12px 0;
    }
    
    .grid {
      display: grid;
      grid-template-cols: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 15px;
    }
    .grid-3 {
      display: grid;
      grid-template-cols: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 15px;
    }
    .field h4 {
      font-size: 11px;
      color: #a59583;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .field p {
      font-size: 13px;
      font-weight: 700;
      color: #352b22;
    }
    
    .vital-box {
      background: #f6f1e5;
      border: 1px solid #dfd6c0;
      padding: 12px;
      border-radius: 10px;
    }
    .vital-val {
      font-size: 20px;
      font-weight: 950;
      color: #ba3b2c;
    }
    .vital-val.normal { color: #277363; }
    
    .reasons-box {
      background: #fde8e5;
      border: 1px solid #fac7c0;
      border-radius: 12px;
      padding: 16px;
      color: #65130b;
    }
    .reasons-box.normal {
      background: #e2f0e6;
      border: 1px solid #bad5cc;
      color: #1b452c;
    }
    .reasons-title {
      font-size: 12px;
      font-weight: 800;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .reasons-list {
      list-style-type: none;
      font-size: 11.5px;
    }
    .reasons-list li {
      margin-bottom: 4px;
      display: flex;
      gap: 6px;
    }
    
    .checklist-row {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-top: 10px;
    }
    .chk-pill {
      flex: 1;
      padding: 10px;
      background: #fff;
      border: 1px solid #dfd6c0;
      border-radius: 8px;
      font-size: 11px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .chk-pill.active {
      border-color: #3a8559;
      background: #e2f0e6;
      font-weight: bold;
    }
    .box-check {
      width: 14px;
      height: 14px;
      border: 1px solid #a59583;
      border-radius: 3px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
    }
    .chk-pill.active .box-check {
      background: #3a8559;
      color: white;
      border-color: #3a8559;
    }

    .sign-row {
      display: flex;
      justify-content: space-between;
      margin-top: 35px;
      padding-top: 15px;
      border-top: 1px solid #dfd6c0;
    }
    
    .btn-container {
      display: flex;
      justify-content: center;
      margin-top: 25px;
    }
    .print-btn {
      background: #14493e;
      color: white;
      border: none;
      padding: 10px 25px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    
    @media print {
      body { background-color: #ffffff; padding: 0; }
      .wrapper { border: none; box-shadow: none; padding: 0; }
      .btn-container { display: none; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="flag-bar">
      <div class="fb-red"></div>
      <div class="fb-yellow"></div>
      <div class="fb-green"></div>
    </div>
    
    <div class="header">
      <div class="logo-container">
        <div class="ghs-tag">GHS</div>
        <div class="header-text">
          <h1>Ghana Health Service</h1>
          <p>Maternity & Obstetric Diagnostics</p>
        </div>
      </div>
      <div class="triage-badge">
        <span class="badge ${record.riskLevel === RiskLevel.HIGH ? "high" : record.riskLevel === RiskLevel.MODERATE ? "mod" : "low"}">
          ${record.riskLevel} RISK (Score ${record.riskScore}/10)
        </span>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #a59583;">
          Record Reference ID: ${record.id}
        </div>
      </div>
    </div>
    
    <div class="section-title">1. Patient Information</div>
    <div class="grid">
      <div class="field">
        <h4>Full Name</h4>
        <p>${record.registration.fullName}</p>
      </div>
      <div class="field">
        <h4>Age</h4>
        <p>${record.registration.age} Years</p>
      </div>
      <div class="field">
        <h4>Gestation</h4>
        <p>${record.registration.gestationalWeeks} Weeks</p>
      </div>
      <div class="field">
        <h4>Obstetric History</h4>
        <p>${record.registration.previousPregnancies} Past Pregnancies</p>
      </div>
    </div>
    
    <div class="section-title">2. Clinical Metrics</div>
    <div class="grid-3">
      <div class="vital-box">
        <h4>Blood Pressure</h4>
        <p class="vital-val ${record.clinical.systolicBp < 140 && record.clinical.diastolicBp < 90 ? "normal" : ""}">
          ${record.clinical.systolicBp}/${record.clinical.diastolicBp} <span style="font-size: 10px; font-weight: normal; color: #a59583;">mmHg</span>
        </p>
      </div>
      <div class="vital-box">
        <h4>Urinalysis (Protein)</h4>
        <p style="font-size: 13px; margin-top: 4px; font-weight: 800; color: #352b22;">${urinalysisText}</p>
      </div>
      <div class="vital-box">
        <h4>Pitting Oedema</h4>
        <p style="font-size: 12px; margin-top: 4px; font-weight: 700; color: #352b22;">${swellingText}</p>
      </div>
    </div>
    
    <div class="section-title">3. Critical Symptoms Flagged</div>
    <div style="font-size: 12.5px; color: #352b22; margin-bottom: 15px; font-weight: 600;">
      ${symptomsText}
    </div>
    
    <div class="section-title">4. Clinical Triage Evaluation</div>
    <div class="reasons-box ${record.riskLevel === RiskLevel.LOW ? "normal" : ""}">
      <div class="reasons-title">Triage Status: ${record.riskLevel}</div>
      <ul class="reasons-list">
        ${record.reasons.map(r => `<li><span>•</span> <span>${r}</span></li>`).join("")}
      </ul>
    </div>
    
    ${isHighRisk ? `
    <div class="section-title">5. Emergency Pre-Referral Checklist State</div>
    <div class="checklist-row">
      <div class="chk-pill ${checkedMags ? "active" : ""}">
        <span class="box-check">${checkedMags ? "✓" : ""}</span>
        Magnesium Sulfate given
      </div>
      <div class="chk-pill ${checkedIV ? "active" : ""}">
        <span class="box-check">${checkedIV ? "✓" : ""}</span>
        Secure IV access
      </div>
      <div class="chk-pill ${checkedO2 ? "active" : ""}">
        <span class="box-check">${checkedO2 ? "✓" : ""}</span>
        Airtight safety position
      </div>
      <div class="chk-pill ${checkedVitals ? "active" : ""}">
        <span class="box-check">${checkedVitals ? "✓" : ""}</span>
        Fetal heart check
      </div>
    </div>` : ""}
    
    ${record.clinical.notes ? `
    <div class="section-title">6. Midwife Notes</div>
    <div style="font-size: 12px; font-style: italic; background: #f6f1e5; border-radius: 8px; padding: 12px; border: 1px solid #dfd6c0;">
      ${record.clinical.notes}
    </div>` : ""}
    
    <div class="sign-row">
      <div>
        <span style="font-size: 9px; color: #a59583; text-transform: uppercase;">Referring Clinician</span>
        <div style="font-size: 13px; font-weight: 700; color: #352b22; margin-top: 3px;">${record.clinician?.name || "Practitioner Akosua (R.M.)"}</div>
        <div style="font-size: 11px; color: #7c6c5b;">${record.clinician?.role || "Registered Midwife"} • GHS ID: ${record.clinician?.ghsNumber || "GMR-98442-2026"}</div>
      </div>
      <div style="text-align: right;">
        <span style="font-size: 9px; color: #a59583; text-transform: uppercase;">System Approval timestamp</span>
        <div style="font-size: 11px; font-weight: 700; font-family: 'JetBrains Mono', monospace; color: #352b22; margin-top: 3px;">
          ${formattedDate}
        </div>
        <div style="font-size: 10px; color: #7c6c5b;">SECURE DIGITAL CLINICAL HUB REGISTER</div>
      </div>
    </div>
    
    <div class="btn-container">
      <button onclick="window.print()" class="print-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Generate Printed PDF
      </button>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Clinical_Triage_Record_${record.registration.fullName.replace(/\s+/g, "_")}_${record.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Risk Alert Header Banner */}
      {isHighRisk ? (
        <div className="bg-red-950 text-white rounded-3xl overflow-hidden border border-red-500/30 shadow-xl">
          <div className="relative">
            {/* Embedded Ghana Health triage illustration as background header */}
            <div className="h-44 md:h-52 overflow-hidden relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHAyC7BFFrsjXz-F_hartpaEG6RxXanmvMdx5QMkdx69LvXIL5n_Sq6Vocs8-9Dy1BE9_RbMMNAbYmBzj0hE9sVP_BP9WeMFLSjFQJeYB5PlSq87zKvhDMPlOstdxx_ipo4Bgfa1lcpHbodJqZ0dtG5UgUddF6b89g0LT2aeWpcaueKkbVa55EQyM2EEdjnt4WKnMZIz2Fc6IINliHD1IJd1iBONT0vvCnumi24RiXwGK2tE2VX633R3X_MtqOamUnFcEx7wwjiqY"
                alt="Severe preeclampsia critical banner illustration"
                className="w-full h-full object-cover grayscale brightness-90 contrast-125 saturate-150"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-red-950/70 to-transparent" />
              <div className="absolute left-6 bottom-5 z-10 space-y-2">
                <span className="bg-red-600 text-[10px] py-1 px-3 rounded-full font-mono font-black border border-red-500/40 tracking-wider inline-block">
                  CRITICAL DISPATCH ALARM
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  IMMEDIATE REFERRAL DIRECTIVE
                </h1>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-4">
            <div className="flex gap-4 items-start bg-red-900/45 border border-red-800/60 p-5 rounded-2xl">
              <ShieldAlert className="w-8 h-8 text-red-400 shrink-0 select-none animate-pulse" />
              <div className="space-y-1.5 flex-1">
                <h3 className="font-extrabold text-red-200 text-base leading-snug">
                  DO NOT SEND THIS PATIENT HOME!
                </h3>
                <p className="text-red-100/90 text-xs leading-relaxed font-medium">
                  Patient {record.registration.fullName} meets critical diagnostic criteria for <strong>Severe Pre-eclampsia</strong> or impending eclampsia. She is in urgent danger of maternal-fetal seizures, placental abruption, or stroke if discharged.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : isModerateRisk ? (
        <div className="bg-amber-950 text-white rounded-3xl p-6 border border-amber-500/20 shadow-lg space-y-4">
          <div className="flex gap-3.5 items-start">
            <AlertCircle className="w-8 h-8 text-amber-400 shrink-0" />
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold py-0.5 px-2 bg-amber-800/80 rounded tracking-wider border border-amber-600/30">
                MODERATE RISK TRIASED
              </span>
              <h1 className="text-xl font-bold tracking-tight text-amber-200 mt-1">
                CLOSE VIGILANCE RECOMMENDED
              </h1>
              <p className="text-amber-100/95 text-xs leading-relaxed font-sans pt-1">
                Patient <strong>{record.registration.fullName}</strong> is hemodynamically stable today but holds multiple foundational pre-eclampsia risk factors (prior history, age factor, or diabetes).
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-950 text-white rounded-3xl p-6 border border-emerald-500/20 shadow-lg space-y-4">
          <div className="flex gap-3.5 items-start">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold py-0.5 px-2 bg-emerald-800/80 rounded tracking-wider border border-emerald-600/30">
                LOW RISK TRIASED
              </span>
              <h1 className="text-xl font-bold tracking-tight text-emerald-200 mt-1">
                ROUTINE PRENATAL SCREENING OK
              </h1>
              <p className="text-emerald-100/95 text-xs leading-relaxed pt-1 font-sans">
                Patient <strong>{record.registration.fullName}</strong> exhibits safe baseline range parameters today. Continue scheduled monthly followups.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Core Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Triage Reason & Clinical metrics */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 border-b pb-2">
              Clinical Score Calculations
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-500 text-xs uppercase block font-semibold pb-1">Triage score</span>
                <span className={`text-4xl font-extrabold tracking-tight ${isHighRisk ? "text-red-600" : isModerateRisk ? "text-amber-600" : "text-emerald-600"}`}>
                  {record.riskScore} <span className="text-sm text-slate-400 font-normal">/ 10</span>
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-xs uppercase block font-semibold text-right pb-1">Primary Diagnosis</span>
                <strong className={`block text-sm text-right ${isHighRisk ? "text-red-700" : isModerateRisk ? "text-amber-700" : "text-emerald-700"}`}>
                  {isHighRisk ? "Suspected Severe Pre-eclampsia" : isModerateRisk ? "Mild Gestational Hypertension" : "Routine Prenatal Health"}
                </strong>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4.5 space-y-2.5 border border-slate-100">
              <h4 className="text-xs text-slate-700 font-bold uppercase tracking-wide">
                Primary Assessment Triggers identified:
              </h4>
              <ul className="text-xs text-slate-600 space-y-2">
                {record.reasons.map((reason, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start leading-normal">
                    <span className="text-slate-400 font-bold shrink-0 mt-0.5">•</span>
                    <span className="font-sans font-medium text-slate-800">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Protocols & Checklists */}
          {isHighRisk && (
            <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-slate-650" />
                  Maternal Pre-Referral Checklist
                </h3>
                <span className="text-[10px] font-mono text-slate-400">GHANA CLINICAL COMPLIANCE STANDARDS</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Midwife must execute and check-off these critical stabilization procedures prior to placing patient in emergency transport:
              </p>

              <div className="space-y-3">
                <div
                  onClick={() => setCheckedMags(!checkedMags)}
                  className={`flex gap-3.5 items-start p-3 bg-slate-50 hover:bg-teal-50/40 rounded-xl border border-slate-205 cursor-pointer transition select-none ${
                    checkedMags ? "border-emerald-500 bg-emerald-50/10" : ""
                  }`}
                >
                  <span className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all ${
                    checkedMags ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                  }`}>
                    {checkedMags && <span className="text-[10px] font-black">✓</span>}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      1. Administer Magnesium Sulfate Load
                    </h4>
                    <p className="text-[11px] text-slate-505 mt-0.5 leading-normal">
                      Inject <strong>4g IV slowly</strong> and <strong>10g IM</strong> deep gluteal to halt maternal seizures. Ensure Calcium Gluconate is on immediate standby.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setCheckedIV(!checkedIV)}
                  className={`flex gap-3.5 items-start p-3 bg-slate-50 hover:bg-teal-50/40 rounded-xl border border-slate-205 cursor-pointer transition select-none ${
                    checkedIV ? "border-emerald-500 bg-emerald-50/10" : ""
                  }`}
                >
                  <span className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all ${
                    checkedIV ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                  }`}>
                    {checkedIV && <span className="text-[10px] font-black">✓</span>}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      2. Secure Free-Flowing IV Access
                    </h4>
                    <p className="text-[11px] text-slate-505 mt-0.5 leading-normal">
                      Insert wide 16G or 18G cannula to facilitate emergency IV fluid or rapid anti-hypertensive injections in transport vector.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setCheckedO2(!checkedO2)}
                  className={`flex gap-3.5 items-start p-3 bg-slate-50 hover:bg-teal-50/40 rounded-xl border border-slate-205 cursor-pointer transition select-none ${
                    checkedO2 ? "border-emerald-500 bg-emerald-50/10" : ""
                  }`}
                >
                  <span className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all ${
                    checkedO2 ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                  }`}>
                    {checkedO2 && <span className="text-[10px] font-black">✓</span>}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      3. Position & Clear Airways
                    </h4>
                    <p className="text-[11px] text-slate-505 mt-0.5 leading-normal">
                      Turn patient into <strong>Left Lateral Position</strong> to protect inferior vena cava blood flow. Ready manual suction bulb in case of eclamptic attack.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setCheckedVitals(!checkedVitals)}
                  className={`flex gap-3.5 items-start p-3 bg-slate-50 hover:bg-teal-50/40 rounded-xl border border-slate-205 cursor-pointer transition select-none ${
                    checkedVitals ? "border-emerald-500 bg-emerald-50/10" : ""
                  }`}
                >
                  <span className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-all ${
                    checkedVitals ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"
                  }`}>
                    {checkedVitals && <span className="text-[10px] font-black">✓</span>}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      4. Continuous Fetal Heartbeat Check
                    </h4>
                    <p className="text-[11px] text-slate-505 mt-0.5 leading-normal">
                      Listen via Doppler/Pinard horn. Note any acute fetal deceleration. Log heartbeat in referral summary file.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Beginner-Level Clinical Companion Section */}
          <div className="bg-amber-100/40 rounded-2xl p-6 border shadow-sm space-y-4 text-left">
            <div className="flex items-center gap-2 border-b pb-3 border-amber-200">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              <div>
                <h4 className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500">
                  Beginner Clinician Companion
                </h4>
                <h3 className="text-base font-black text-slate-800 leading-tight">
                  Cardiovascular & Organ Risk Companion
                </h3>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              Pre-eclampsia is a systemic endothelial (inner vessel wall) disorder, not just standard "high BP." Select a system below to understand the physiological damage:
            </p>

            {/* Micro Tab Selector */}
            <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setEduTab("cardio")}
                className={`py-2 px-0.5 text-[9px] font-black rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer focus:outline-none ${
                  eduTab === "cardio"
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Cardio/BP</span>
              </button>
              
              <button
                type="button"
                onClick={() => setEduTab("renal")}
                className={`py-2 px-0.5 text-[9px] font-black rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer focus:outline-none ${
                  eduTab === "renal"
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>Renal/Urine</span>
              </button>

              <button
                type="button"
                onClick={() => setEduTab("neuro")}
                className={`py-2 px-0.5 text-[9px] font-black rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer focus:outline-none ${
                  eduTab === "neuro"
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Brain/Neuro</span>
              </button>

              <button
                type="button"
                onClick={() => setEduTab("hepatic")}
                className={`py-2 px-0.5 text-[9px] font-black rounded-lg transition-all flex flex-col items-center gap-1 cursor-pointer focus:outline-none ${
                  eduTab === "hepatic"
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>Liver/Lung</span>
              </button>
            </div>

            {/* Explanatory Clinical Text */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 min-h-[175px] animate-fadeIn">
              {eduTab === "cardio" && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span>Vascular narrowing (Vasospasm) Explained</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Placental vascular distress releases toxic factors into the maternal bloodstream. This triggers body-wide arterial vasospasm (tightening of blood vessels). The heart is forced to pump against severe resistance, rapidly spiking the Blood Pressure level.
                  </p>
                  <p className="text-[11px] text-teal-700 bg-teal-50 p-2.5 rounded-lg border border-teal-100 font-semibold leading-normal">
                    💡 <strong>Midwife Bedside Pearl:</strong> Patient BP is <strong>{record.clinical.systolicBp}/{record.clinical.diastolicBp}</strong>. High pressure strains blood vessels in the brain, which can rupture and cause life-threatening stroke or cerebral hemorrhage.
                  </p>
                </div>
              )}

              {eduTab === "renal" && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    <span>Glomerular Swelling & Protein Leaking</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    High pressures and inflammatory damage swell up the microscopic filter vessels in the kidneys—a process called <em>glomerular endotheliosis</em>. The swollen structures rip open tiny holes, letting heavy blood proteins (albumin) escape into urine.
                  </p>
                  <p className="text-[11px] text-teal-700 bg-teal-50 p-2.5 rounded-lg border border-teal-100 font-semibold leading-normal">
                    💡 <strong>Midwife Bedside Pearl:</strong> Your patient registers a <strong>{record.clinical.proteinuria} proteinuria urine level</strong>. Losing blood protein collapses the bloodstream's water retention capacity, forcing fluids to escape into tissues and cause extreme hand/face swelling.
                  </p>
                </div>
              )}

              {eduTab === "neuro" && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Cerebral Irritation & Seizure Risk</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    When systemic water leaks into brain tissue, it triggers mild localized cerebral edema (brain swelling). Vasospasms inside the eyes create visual blurs and flashing spots (scotoma). An irritable hyper-excited nervous system is at immediate risk of slipping into life-threatening eclamptic seizures.
                  </p>
                  <p className="text-[11px] text-teal-700 bg-teal-50 p-2.5 rounded-lg border border-teal-100 font-semibold leading-normal">
                    💡 <strong>Midwife Bedside Pearl:</strong> If they complain of a constant crushing "band-like" headache or flashes, always test knee-jerk reflexes! Fast twitching reflex beats (clonus) represent an ultimate pre-seizure alarm.
                  </p>
                </div>
              )}

              {eduTab === "hepatic" && (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Liver Capsule Stretching & Lung Fluid Pool</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Micro-vessel damage stars infarcts and leaks inside the liver. The liver tissue swells and hits hard against its surrounding skin envelope (Glisson's capsule), radiating severe upper right rib-cage pain. Liquid also seeps into lungs (pulmonary edema) causing breathlessness.
                  </p>
                  <p className="text-[11px] text-teal-700 bg-teal-50 p-2.5 rounded-lg border border-teal-100 font-semibold leading-normal">
                    💡 <strong>Midwife Bedside Pearl:</strong> Never dismiss epigastric or right rib pain as pregnancy heartburn! Constant rib pain implies hepatic congestion, which can trigger hepatic rupture. Shortness of breath is a major emergency indicating fluid-filled lungs.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Emerg Call facilities list & Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emergency Contacts card */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-md space-y-5">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Phone className="w-5 h-5 text-red-500 animate-pulse" />
              Tertiary Obstetric Hotlines
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              Direct hotlines to admissions doctors in major referral nodes. Tap to dial and initiate active handover.
            </p>

            <div className="space-y-3.5">
              {REFERRAL_FACILITIES.map((fac) => (
                <div
                  key={fac.id}
                  className="p-3 bg-slate-900 rounded-2xl border border-slate-800 hover:border-red-500 transition-colors flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <strong className="text-xs font-bold text-white block truncate max-w-[190px]">
                      {fac.name}
                    </strong>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {fac.region} • {fac.distanceKm} km away
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveCallFacility(fac)}
                    className="p-2 bg-red-650 hover:bg-red-700 active:scale-90 text-white rounded-xl transition-all flex items-center justify-center cursor-pointer"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick patient details box */}
          <div className="bg-slate-50 rounded-2xl p-5 border shadow-sm space-y-3">
            <h4 className="text-xs text-slate-700 font-extrabold uppercase tracking-wide">
              Subject Overview
            </h4>

            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex justify-between border-b pb-1">
                <span>Subject:</span>
                <strong className="text-slate-800">{record.registration.fullName}</strong>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>Age / Gestation:</span>
                <strong className="text-slate-800">
                  {record.registration.age}Y • {record.registration.gestationalWeeks} Weeks
                </strong>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span>Urinalysis:</span>
                <strong className="text-slate-800">{getUrinalysisLabel(record.clinical.proteinuria)}</strong>
              </div>
              <div className="flex justify-between pb-1">
                <span>Pitting swelling:</span>
                <strong className="text-slate-800">
                  {record.clinical.swelling === SwellingLevel.FACE_OR_HANDS
                    ? "Face/Hands (Severe)"
                    : record.clinical.swelling === SwellingLevel.FEET_ONLY
                    ? "Feet only"
                    : "None/Mild"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extreme Bottom actions block */}
      <div className="border-t pt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Export to PDF / Local medical record file storage link */}
        <button
          onClick={handleExportPDF}
          className="w-full md:w-auto px-6 py-3.5 border-2 border-teal-555 hover:bg-teal-100/50 bg-teal-50 text-teal-600 text-sm font-black rounded-2xl transition-all flex items-center gap-2 justify-center cursor-pointer shadow-sm"
        >
          <Download className="w-4 h-4 text-teal-605" />
          Export to PDF / Save Report
        </button>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto justify-end">
          <button
            onClick={onRestart}
            className="px-6 py-3.5 border border-slate-350 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-2xl transition"
          >
            Discard & Assess Another
          </button>

          <button
            onClick={onGoToReferral}
            className="px-8 py-3.5 bg-red-655 hover:bg-red-700 active:scale-95 text-white text-sm font-black rounded-2xl shadow-lg shadow-red-900/20 transition-all flex items-center gap-2 justify-center cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            {isHighRisk ? "Compile Emergency Referral Note" : "View Triage Referral Note"}
          </button>
        </div>
      </div>

      {/* Active Call Simulator Overlay */}
      {activeCallFacility && (
        <ActiveCallSimulator
          facility={activeCallFacility}
          patientName={record.registration.fullName}
          onClose={() => setActiveCallFacility(null)}
        />
      )}
    </div>
  );
}
