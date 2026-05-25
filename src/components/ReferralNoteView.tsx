/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { AssessmentRecord, RiskLevel, SwellingLevel, ProteinuriaLevel } from "../types";
import { Printer, Share2, Clipboard, ChevronLeft, ArrowLeftRight, CheckCircle2, Check, Smartphone } from "lucide-react";

interface ReferralNoteViewProps {
  record: AssessmentRecord;
  onBack: () => void;
  onSaveAndClose: (id: string, notes: string) => void;
}

export default function ReferralNoteView({ record, onBack, onSaveAndClose }: ReferralNoteViewProps) {
  const [editedNotes, setEditedNotes] = useState(record.clinical.notes || "");
  const [whatsappCopied, setWhatsappCopied] = useState(false);
  const [printSuccess, setPrintSuccess] = useState(false);

  // Generate Referral ID if missing
  const referralId = record.referralId || `REF-2026-${Math.floor(100 + Math.random() * 900)}`;

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

  const handlePrint = () => {
    window.print();
    setPrintSuccess(true);
    setTimeout(() => setPrintSuccess(false), 3000);
  };

  const referralText = `
*GHANA HEALTH SERVICE E-REFERRAL SUMMARY*
----------------------------------------
*Patient:* ${record.registration.fullName} (${record.registration.age}Y)
*Gestation:* ${record.registration.gestationalWeeks} Weeks
*Vitals:* BP ${record.clinical.systolicBp}/${record.clinical.diastolicBp} mmHg
*Urinalysis (Protein):* ${getUrinalysisLabel(record.clinical.proteinuria)}
*Triage Risk:* ${record.riskLevel} (Score ${record.riskScore}/10)
*Referral Code:* ${referralId}
*Midwife Notes:* ${editedNotes || "None"}
  `.trim();

  const handleWhatsappShare = () => {
    const encoded = encodeURIComponent(referralText);
    const whatsappUrl = `https://wa.me/?text=${encoded}`;
    window.open(whatsappUrl, "_blank");
    setWhatsappCopied(true);
    setTimeout(() => setWhatsappCopied(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between no-print">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm py-2 px-1 focus:outline-none"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Triage Assessment
        </button>

        <div className="flex gap-2.5">
          <button
            onClick={handleWhatsappShare}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow"
          >
            <Smartphone className="w-4 h-4" />
            {whatsappCopied ? "Template Copied!" : "Share via WhatsApp"}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow"
          >
            <Printer className="w-4 h-4" />
            {printSuccess ? "Printing..." : "Print Referral Note"}
          </button>
        </div>
      </div>

      {/* Main Print Document Canvas */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-lg p-6 md:p-10 text-slate-800 space-y-8 print:border-0 print:shadow-none print:p-0 font-sans print:text-black">
        {/* Ghana flag band */}
        <div className="flex h-1.5 w-full -mt-6 md:-mt-10 -mx-6 md:-mx-10 rounded-t-xl overflow-hidden print:hidden">
          <div className="bg-red-600 flex-1" />
          <div className="bg-yellow-400 flex-1" />
          <div className="bg-emerald-600 flex-1" />
        </div>

        {/* Clinical Document Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b-2 border-slate-200 pb-6 print:pb-4">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border shrink-0">
              <span className="text-3xl font-extrabold text-teal-700 tracking-wider">GHS</span>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight uppercase text-teal-800">
                Ghana Health Service
              </h1>
              <p className="text-xs text-slate-500 font-semibold font-mono uppercase tracking-wider">
                Maternity & Obstetric Referral Network
              </p>
              <p className="text-xs text-slate-400 mt-0.5 print:hidden">
                Generated via Clinical Triage Protocol Engine
              </p>
            </div>
          </div>

          <div className="text-center md:text-right space-y-1">
            <span className="text-xs font-bold py-1 px-3 bg-red-100 text-red-800 rounded border border-red-200 uppercase inline-block print:border-black print:text-black">
              EMERGENCY HANDOVER NOTE
            </span>
            <div className="text-xs font-mono text-slate-500 pt-1">
              Referral Code: <strong className="text-slate-900">{referralId}</strong>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Date: {new Date(record.timestamp).toLocaleString("en-GH")}
            </div>
          </div>
        </div>

        {/* Section 1: Patient Demographic & History */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-teal-700 border-b pb-1.5">
            1. Patient Demographics & History
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-sm">
            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase">Full Name</span>
              <strong className="text-slate-900 text-base">{record.registration.fullName}</strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase">Patient Age</span>
              <strong className="text-slate-800">{record.registration.age} Years</strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase">Gestation Age</span>
              <strong className="text-slate-800">{record.registration.gestationalWeeks} Weeks</strong>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold block uppercase">Prior Parity</span>
              <strong className="text-slate-800">{record.registration.previousPregnancies} Pregnancies</strong>
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Vital Signs and Findings */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-teal-700 border-b pb-1.5">
            2. Vitals & Bedside Urinalysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 border rounded-xl space-y-1.5">
              <span className="text-xs text-slate-500 font-semibold block uppercase">Blood Pressure reading</span>
              <span className="text-2xl font-black text-red-600 tracking-tight">
                {record.clinical.systolicBp}/{record.clinical.diastolicBp} <span className="text-xs text-slate-400 font-normal">mmHg</span>
              </span>
              <div className="text-xs text-slate-500 leading-normal">
                {record.clinical.systolicBp >= 140 || record.clinical.diastolicBp >= 90 ? (
                  <span className="text-red-600 font-semibold">• Elevated (Clinical Hypertension)</span>
                ) : (
                  <span className="text-emerald-600 font-semibold">• Healthy/Normal Level</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border rounded-xl space-y-1.5">
              <span className="text-xs text-slate-500 font-semibold block uppercase">Proteinuria level</span>
              <span className="text-xl font-extrabold text-slate-900 block">
                {getUrinalysisLabel(record.clinical.proteinuria)}
              </span>
              <div className="text-xs text-slate-500 leading-normal font-mono">
                Strip result indicator code: {record.clinical.proteinuria}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border rounded-xl space-y-1.5">
              <span className="text-xs text-slate-500 font-semibold block uppercase">Pitting Oedema / Swelling</span>
              <span className="text-sm font-semibold text-slate-800 block">
                {getSwellingLabel(record.clinical.swelling)}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Evaluated Danger Symptoms */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-teal-700 border-b pb-1.5">
            3. Target Danger Symptoms Checklist
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${record.clinical.symptoms.severeHeadache ? "bg-red-500" : "bg-slate-200"}`} />
              <span className={record.clinical.symptoms.severeHeadache ? "text-red-700 font-bold" : "text-slate-400"}>Severe Pounding Headache</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${record.clinical.symptoms.visionChanges ? "bg-red-500" : "bg-slate-200"}`} />
              <span className={record.clinical.symptoms.visionChanges ? "text-red-700 font-bold" : "text-slate-400"}>Visual Changes (Spots/Blur)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${record.clinical.symptoms.ribPain ? "bg-red-500" : "bg-slate-200"}`} />
              <span className={record.clinical.symptoms.ribPain ? "text-red-700 font-bold" : "text-slate-400"}>Severe Upper Rib / Epigastric Pain</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${record.clinical.symptoms.shortnessOfBreath ? "bg-red-500" : "bg-slate-200"}`} />
              <span className={record.clinical.symptoms.shortnessOfBreath ? "text-red-700 font-bold" : "text-slate-400"}>Dyspnea (Shortness of Breath)</span>
            </div>
          </div>
        </div>

        {/* Section 4: Clinical Triage Assessment */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-teal-700 border-b pb-1.5">
            4. Clinical Triage Evaluation Summary
          </h3>
          <div className="p-4 bg-red-50 text-red-950 border border-red-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 bg-red-650 rounded-full animate-pulse" />
              <span className="text-sm font-black text-red-900 tracking-tight uppercase">
                TRIAGE CLASSIFICATION: {record.riskLevel} RISK (Clinical Score {record.riskScore}/10)
              </span>
            </div>
            <p className="text-xs text-red-900 leading-normal font-sans">
              This patient registers a severe pre-eclampsia risk envelope. Primary midwife instruction: **REFER TO COMPREHENSIVE OBSTETRICS UNIT DIRECTLY. DO NOT SEND HOME.**
            </p>
            <div className="pt-2 text-[11px] text-red-900/95 font-medium space-y-1">
              <div className="font-semibold block uppercase tracking-widest text-[10px] text-red-800 mb-1">Triage Activation Triggers:</div>
              {record.reasons.map((reason, idx) => (
                <div key={idx} className="flex gap-1.5 items-start">
                  <span>•</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Clinician Notes */}
        <div className="space-y-3 no-print">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-teal-700 border-b pb-1.5">
            5. Free-Text Additional Handover Comments (Midwife Input)
          </h3>
          <textarea
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            placeholder="Add specific comments about medication administered (e.g. Magnesium Sulfate loading dose injected, IV anti-hypertensive labetalol given, fetal heartbeat stats...)"
            rows={3}
            className="w-full text-sm p-3.5 border border-slate-300 bg-slate-50 focus:bg-white rounded-xl focus:border-teal-500 focus:ring-1 focus:ring-teal-500/25 outline-none font-sans"
          />
        </div>

        {/* Print safe notes for printed documents */}
        <div className="hidden print:block space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-teal-700 border-b pb-1.5">
            5. Handover Comments
          </h3>
          <div className="text-sm border p-4 rounded bg-slate-50 italic text-slate-800 leading-relaxed min-h-[80px]">
            {editedNotes || "No additional midwife comments provided."}
          </div>
        </div>

        {/* Section 6: Official Authorization Stamp Card */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shrink-0 border overflow-hidden">
              <img
                src={record.clinician?.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCBOMNxE0yeaUP_4gdv5Dg_A2ZIrry9OLsny6QrTT_SelW7ZtOdPqDPvgT_047rvkRbwlpe_QhO3vhxpmqqQ8bQvhxV-5Jyj3-p6UJ6I7cQQjyegXvOMvYTtfPmrNj0LZYaUigibUL5J7PCjvPabgvg2ZmVgdaNQRQxPTNipBJGlI32dMSowcwV0IwMjvW4zC0TppiVb_vie_HbRmHMs4BFwBN-VRiCTKEql9K2qnigRjnQHQAUk0aJof7uG4cSjW33-PNjWu7ctA"}
                alt="Admitting Doctor Avatar"
                className="w-10 h-10 object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Referring Practitioner</span>
              <strong className="text-slate-800 text-sm uppercase">{record.clinician?.name || "Nurse Akosua (R.M.)"}</strong>
              <span className="text-xs text-slate-500 block">{record.clinician?.role || "Registered Midwife"}</span>
              <span className="text-xs text-slate-450 block font-mono">GHS ID: {record.clinician?.ghsNumber || "GMR-98442-2026"}</span>
            </div>
          </div>

          <div className="text-center md:text-right flex flex-col items-center md:items-end">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block mb-1">Clinical Seal & Verification Signature</span>
            <div className="h-14 w-36 overflow-hidden relative grayscale contrast-125">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwTpXyZunV-DNZTS_2PaJJ-UD-FYhoWDH3eo6QIhG_Y7iRkhTuy_dkQrevSZEv_WDd2dZZwwXvF5swGV6OzcPaOxEG-5s8AIoHGss_8o9W3K277VlAezNVEGAu98N01Ellx5JYE2v_kKId4tAu2B8j7yC1H-_4n6db8P32tBUfLfuXuQRrEW2ef0uRi_wai8FU2aCo4RViP65jx88hrmeNHfQHp_Iau4T9ljHpwJ_dA6x_kuI0C2fS62Vn6lNLFbhqEIOAz_Qf1kc"
                alt="Physician clinical signature stamp"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400 mt-1">SIGNED AT CLINIC HUB OKYERE</span>
          </div>
        </div>
      </div>

      {/* Main Bottom CTAs */}
      <div className="flex gap-3 justify-end items-center no-print">
        <button
          onClick={onBack}
          className="px-6 py-3.5 border border-slate-300 text-slate-700 bg-white hover:bg-slate-55 hover:border-slate-400 leading-none rounded-xl text-sm font-semibold transition"
        >
          Cancel Note
        </button>
        <button
          onClick={() => onSaveAndClose(record.id, editedNotes)}
          className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white leading-none rounded-xl text-sm font-bold shadow-lg shadow-teal-700/20 transition-all cursor-pointer"
        >
          Log in Medical Records & Close File
        </button>
      </div>
    </div>
  );
}
