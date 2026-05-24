/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AssessmentRecord, RiskLevel, SwellingLevel, ProteinuriaLevel } from "../types";
import { Search, SlidersHorizontal, Calendar, ArrowRight, Eye, ShieldAlert, FileSpreadsheet, PhoneCall } from "lucide-react";

interface HistoryListProps {
  records: AssessmentRecord[];
  onSelectRecord: (record: AssessmentRecord) => void;
}

export default function HistoryList({ records, onSelectRecord }: HistoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState<RiskLevel | "ALL">("ALL");

  const filteredRecords = records.filter((r) => {
    const nameMatch = r.registration.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const riskMatch = filterRisk === "ALL" ? true : r.riskLevel === filterRisk;
    return nameMatch && riskMatch;
  });

  const getRiskStyles = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.HIGH:
        return {
          bg: "bg-red-50 text-red-700 border-red-200",
          badge: "bg-red-600 text-white",
          label: "Critical Danger",
        };
      case RiskLevel.MODERATE:
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          badge: "bg-amber-500 text-white",
          label: "Moderate Warning",
        };
      case RiskLevel.LOW:
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          badge: "bg-emerald-600 text-white",
          label: "Healthy Range",
        };
    }
  };

  const getReferralBadge = (status: "PENDING" | "REFERRED" | "STABILIZED") => {
    switch (status) {
      case "REFERRED":
        return <span className="bg-red-100 text-red-800 text-xs py-1 px-2.5 rounded-full font-bold">REFERRED TO HOSPITAL</span>;
      case "STABILIZED":
        return <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2.5 rounded-full font-semibold">CLINIC PROGRESS CHECK</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs py-1 px-2.5 rounded-full font-medium">ROUTINE SCREENING</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Hub */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search patient records by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:outline-none rounded-xl transition-all font-sans"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2 shrink-0 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold py-2.5 px-1.5 text-slate-500 flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filter Level:
          </span>
          <button
            onClick={() => setFilterRisk("ALL")}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              filterRisk === "ALL"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Caseload
          </button>
          <button
            onClick={() => setFilterRisk(RiskLevel.HIGH)}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              filterRisk === RiskLevel.HIGH
                ? "bg-red-600 text-white"
                : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200/55"
            }`}
          >
            High Risk
          </button>
          <button
            onClick={() => setFilterRisk(RiskLevel.MODERATE)}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              filterRisk === RiskLevel.MODERATE
                ? "bg-amber-500 text-white"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/55"
            }`}
          >
            Moderate
          </button>
          <button
            onClick={() => setFilterRisk(RiskLevel.LOW)}
            className={`py-1.5 px-3.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              filterRisk === RiskLevel.LOW
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/55"
            }`}
          >
            Low Risk
          </button>
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="bg-slate-50 border rounded-2xl p-12 text-center text-slate-500 max-w-lg mx-auto">
          <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 mb-1">No Clinical Records Found</h4>
          <p className="text-sm">There are no patient records matching your current filter choices or search name.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((rec) => {
            const styles = getRiskStyles(rec.riskLevel);
            const dateStr = new Date(rec.timestamp).toLocaleDateString("en-GH", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={rec.id}
                onClick={() => onSelectRecord(rec)}
                className={`group bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md hover:border-teal-500 cursor-pointer transition-all duration-200 relative flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5 gap-2">
                    <span className="text-[11px] font-mono font-semibold text-slate-400">
                      {rec.id}
                    </span>
                    <span className={`text-[11px] font-bold py-1 px-2.5 rounded-full uppercase ${styles.badge}`}>
                      {rec.riskLevel} Risk (Score {rec.riskScore}/10)
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-teal-600 transition-colors">
                    {rec.registration.fullName}
                  </h3>

                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-3 pb-3 border-b border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block pb-0.5">Gestational Age</span>
                      <strong className="text-slate-800">{rec.registration.gestationalWeeks} Weeks</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block pb-0.5">Blood Pressure</span>
                      <strong className={rec.clinical.systolicBp >= 140 || rec.clinical.diastolicBp >= 90 ? "text-red-600 font-bold" : "text-slate-800"}>
                        {rec.clinical.systolicBp}/{rec.clinical.diastolicBp} mmHg
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block pb-0.5">Proteinuria</span>
                      <strong className="text-slate-800 uppercase">{rec.clinical.proteinuria}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block pb-0.5">Age</span>
                      <strong className="text-slate-800">{rec.registration.age} Years</strong>
                    </div>
                  </div>

                  <div className="mt-3.5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {dateStr}
                    </div>

                    <div className="text-xs text-slate-600 leading-normal line-clamp-1 italic font-sans ...">
                      {rec.clinical.notes || "No additional clinician comments entered for this screening."}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  {getReferralBadge(rec.referralStatus)}
                  <span className="text-xs text-teal-600 font-bold flex items-center gap-1 group-hover:underline">
                    Expand Details
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5 transform group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Companion Card at bottom */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col md:flex-row items-center gap-5 justify-between">
        <div className="flex gap-4 items-start text-center md:text-left">
          <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCBOMNxE0yeaUP_4gdv5Dg_A2ZIrry9OLsny6QrTT_SelW7ZtOdPqDPvgT_047rvkRbwlpe_QhO3vhxpmqqQ8bQvhxV-5Jyj3-p6UJ6I7cQQjyegXvOMvYTtfPmrNj0LZYaUigibUL5J7PCjvPa0bgvg2ZmVgdaNQRQxPTNipBJGlI32dMSowcwV0IwMjvW4zC0TppiVb_vie_HbRmHMs4BFwBN-VRiCTKEql9K2qnigRjnQHQAUk0aJof7uG4cSjW33-PNjWu7ctA"
              alt="Companion Nurse Akosua"
              className="w-12 h-12 object-contain rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Past Data Archiving Guidelines</h4>
            <p className="text-xs text-slate-500 leading-normal max-w-xl">
              Ghana Health Service regulations specify records must persist locally for 6 months. High risk cases referred to tertiary facilities require follow-ups within 24 hours to track maternity discharge sheets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
