/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Play, ShieldCheck, Heart, Clock, ArrowUpRight, BookOpen, ChevronRight, Phone, Bell, History } from "lucide-react";
import { AssessmentRecord, RiskLevel, Clinician } from "../types";

interface WelcomeDashboardProps {
  onStartAssessment: () => void;
  onGoToHistory: () => void;
  onGoToEdu: () => void;
  records: AssessmentRecord[];
  onSelectRecord: (rec: AssessmentRecord) => void;
  activeClinician: Clinician;
  onOpenAuth: () => void;
}

export default function WelcomeDashboard({
  onStartAssessment,
  onGoToHistory,
  onGoToEdu,
  records,
  onSelectRecord,
  activeClinician,
  onOpenAuth,
}: WelcomeDashboardProps) {

  const totalScreened = records.length;
  const highRiskCount = records.filter(r => r.riskLevel === RiskLevel.HIGH).length;
  const modRiskCount = records.filter(r => r.riskLevel === RiskLevel.MODERATE).length;

  // Get extreme cases to highlight on dashboard
  const severeAlerts = records
    .filter(r => r.riskLevel === RiskLevel.HIGH)
    .slice(0, 2);

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Hero banner section */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Hotlink of pregnant mother illustration walking near clinic */}
        <div className="absolute right-0 bottom-0 top-0 opacity-15 md:opacity-30 overflow-hidden select-none pointer-events-none">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEhItCPFk6qJEOxOoB2F4eOMrpv8bvjWtM10TDb6OhTcqxzx_Y-6FyCkBxBUVMBAr7QGSDy6LzstBtYc4fNaXposxc0De7Mi7e-i0khWjv6slgJT5x9Y2vjs25TWDOj1DJVItnjauWSw97Qy4IODJw_-08ED9KH68RQ3RxumM8OeGbxCKquOIpbc_Bw6PjoM1D5t5IGt68lNnj63QS0Mv5usiMDps0Ny3EwpSSZUfLbj3_KMA8lUv2iwhTh9tYPdqwYDeqicb6A2o"
            alt="Maternal Health Clinic center illustration representation"
            className="h-full object-cover scale-110"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="md:col-span-8 space-y-4 relative z-10 text-left">
          <div className="bg-teal-500/10 text-teal-300 text-xs py-1 px-3 rounded-full inline-flex items-center gap-1.5 font-bold border border-teal-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            VITAL TRIAGE HUB
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
            PreeclampsiaFlag
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl font-sans font-medium">
            Helping you protect mothers, one visit at a time. Objective clinical decision-making protocols for midwives in Ghana.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onStartAssessment}
              className="py-3.5 px-6 rounded-2xl bg-teal-550 hover:bg-teal-500 active:scale-95 text-teal-950 font-black text-sm flex items-center gap-2 transition shadow-lg shadow-teal-500/15 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-teal-950 stroke-[3]" />
              Start New Assessment
            </button>
            <button
              onClick={onGoToHistory}
              className="py-3.5 px-6 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 border border-slate-700 transition cursor-pointer"
            >
              <History className="w-4 h-4" />
              View Past Assessments
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key clinical metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 select-none">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase">Total Screened</span>
            <strong className="text-slate-900 text-2xl font-black">{totalScreened} Mothers</strong>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-605 shrink-0 select-none">
            <span className="text-red-600 font-extrabold text-lg">!</span>
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase">Severe Cases</span>
            <strong className="text-slate-900 text-2xl font-black">{highRiskCount} Referred</strong>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 select-none">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-slate-400 text-xs font-semibold block uppercase">Moderate Cases</span>
            <strong className="text-slate-900 text-2xl font-black">{modRiskCount} Monitoring</strong>
          </div>
        </div>
      </div>

      {/* 3. Outer grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Left main: Severe alarm tracking and helpful guidelines */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-3.5">
              <h3 className="font-extrabold text-slate-850 flex items-center gap-2 text-base">
                <Bell className="w-4 h-4 text-red-500 animate-pulse" />
                Latest High Risk Flags
              </h3>
              <span className="text-[10px] bg-red-100 text-red-800 font-bold py-1 px-2.5 rounded-full uppercase">
                Attention Required
              </span>
            </div>

            {severeAlerts.length === 0 ? (
              <div className="text-slate-500 text-xs italic py-4 text-center">
                Awesome! No severe risk factors triggered within the recent screens.
              </div>
            ) : (
              <div className="space-y-3.5">
                {severeAlerts.map((aler) => (
                  <div
                    key={aler.id}
                    onClick={() => onSelectRecord(aler)}
                    className="p-4 bg-red-50/50 border border-red-200/60 hover:border-red-500 hover:bg-red-50 hover:shadow-sm cursor-pointer transition rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-sm font-extrabold text-red-950 block">
                        {aler.registration.fullName}
                      </strong>
                      <span className="text-[11px] text-slate-500 leading-normal block">
                        Gestation: {aler.registration.gestationalWeeks} Weeks • BP: {aler.clinical.systolicBp}/{aler.clinical.diastolicBp} mmHg
                      </span>
                    </div>
                    <span className="text-xs text-red-700 font-bold flex items-center gap-0.5 group">
                      Review File
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Guidelines quick access bento card */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm flex flex-col md:flex-row gap-5">
            <div className="w-20 h-20 bg-teal-50 rounded-2xl shrink-0 flex items-center justify-center self-center md:self-auto overflow-hidden">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtBvUIBfZ9xo77JyRwiQNoBSlb2DQE6zy00EHYXBIv8GEpL26tplaJW0eYsL6YGw1nFBp6tgn1qTYGufOahlIeoOH2VLycAtoVVULiljEK3ArYnLbwMEb-QdMaHPGME-VGN_0vlF-wHC4Zz5fHUFTyu4Hzk5NPDbX0Bhd3OCh2p-F-VyHzpPoY15nMbMyN2YwK5szbB4zwjNpC_4YGuoDrXDAnuELNQ1hw1UjvbToeQ2EU2U4GzCs3PFAqDCKjjYd7PCzMfGImpng"
                alt="Kidney glomerulus diagnostic illustration"
                className="w-16 h-16 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-2.5 flex-1">
              <h4 className="font-extrabold text-slate-900 text-base">National GHS Pre-eclampsia Guidelines</h4>
              <p className="text-slate-600 text-xs leading-relaxed font-sans">
                Hypertensive disorders of pregnancy represent the #2 cause of direct maternal mortality in Ghana regional districts. Screening BP at EVERY clinic contact and reading urinalysis strips carefully protects mothers.
              </p>
              <button
                onClick={onGoToEdu}
                className="text-xs text-teal-700 font-bold flex items-center gap-1 hover:underline"
              >
                Access Protocols
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right main: Character Companion card with Nurse Akosua */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 flex flex-col items-center text-center space-y-4 Card">
            <div className="w-20 h-20 bg-white rounded-full border shadow-sm flex items-center justify-center relative select-none">
              <img
                src={activeClinician.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCBOMNxE0yeaUP_4gdv5Dg_A2ZIrry9OLsny6QrTT_SelW7ZtOdPqDPvgT_047rvkRbwlpe_QhO3vhxpmqqQ8bQvhxV-5Jyj3-p6UJ6I7cQQjyegXvOMvYTtfPmrNj0LZYaUigibUL5J7PCjvPabgvg2ZmVgdaNQRQxPTNipBJGlI32dMSowcwV0IwMjvW4zC0TppiVb_vie_HbRmHMs4BFwBN-VRiCTKEql9K2qnigRjnQHQAUk0aJof7uG4cSjW33-PNjWu7ctA"}
                alt={`${activeClinician.name} Companion Avatar`}
                className="w-16 h-16 object-contain rounded-full border border-slate-100"
                referrerPolicy="no-referrer"
              />
              <span className="w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full absolute bottom-1 right-1 animate-pulse" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Active Staff Duty Shift
              </span>
              <h3 className="text-lg font-black text-slate-900">{activeClinician.name}</h3>
              <p className="text-xs text-teal-850 font-bold font-mono">{activeClinician.role}</p>
              <p className="text-[10px] text-slate-400 font-mono">GHS ID: {activeClinician.ghsNumber}</p>
            </div>

            <div className="w-full bg-white border rounded-2xl p-4 text-xs text-slate-600 space-y-3 leading-normal text-left shadow-sm font-sans font-medium">
              <div className="flex gap-2 items-start leading-relaxed text-slate-700">
                <span>
                  {activeClinician.id.includes("akosua") ? (
                    `"Hello there, Nurse Akosua here! Ready to assist. We have ${totalScreened} total mother files saved. Please verify their diastolic thresholds with rest standards before triage calculation."`
                  ) : activeClinician.role.toLowerCase().includes("officer") ? (
                    `"On-duty Medical Officer shift active. All referral notes and triages will automatically carry my verification license GHS stamp: ${activeClinician.ghsNumber}."`
                  ) : (
                    `"Welcome! Continuous assessment logbook is synchronized under license: ${activeClinician.ghsNumber}. Keep testing protein levels at every checkup."`
                  )}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenAuth}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold transition hover:bg-slate-800 cursor-pointer active:scale-95"
            >
              Verify License PIN / Switch Shift
            </button>

            <div className="w-full pt-1.5 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-white border rounded-xl shadow-sm text-center">
                <span className="text-slate-405 block font-semibold uppercase text-[9px] tracking-wide">Duty Station</span>
                <strong className="text-slate-800 text-[11px] block py-0.5 font-mono">Clinic Hub 4</strong>
              </div>
              <div className="p-2 bg-white border rounded-xl shadow-sm text-center">
                <span className="text-slate-405 block font-semibold uppercase text-[9px] tracking-wide">Station Files</span>
                <strong className="text-slate-800 text-[11px] block py-0.5 font-mono">{totalScreened} Files Total</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
