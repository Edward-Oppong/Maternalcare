/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AssessmentRecord, RiskLevel, SwellingLevel, ProteinuriaLevel } from "../types";
import { ShieldAlert, AlertCircle, CheckSquare, Phone, FileText, RefreshCw, Calendar, Eye, VolumeX, ShieldCheck, Heart } from "lucide-react";
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

  const isHighRisk = record.riskLevel === RiskLevel.HIGH;
  const isModerateRisk = record.riskLevel === RiskLevel.MODERATE;

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
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
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
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
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
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
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
                <strong className="text-slate-800">{record.clinical.proteinuria} Protein</strong>
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
      <div className="border-t pt-6 flex flex-col sm:flex-row gap-4 justify-end">
        <button
          onClick={onRestart}
          className="px-6 py-3.5 border border-slate-350 bg-white hover:bg-slate-100 text-slate-705 text-sm font-semibold rounded-2xl transition"
        >
          Discard & Assess Another Patient
        </button>

        <button
          onClick={onGoToReferral}
          className="px-8 py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-sm font-black rounded-2xl shadow-lg shadow-red-900/30 transition-all flex items-center gap-2 justify-center cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          {isHighRisk ? "Compile Emergency Referral Note" : "View Triage Referral Note"}
        </button>
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
