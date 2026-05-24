/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CLINICAL_ARTICLES, Article } from "../data";
import { BookOpen, AlertTriangle, Activity, Scale, Check, ChevronRight, HelpCircle } from "lucide-react";

export default function EducationalHub() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Magnesium safety calculator state
  const [weightKg, setWeightKg] = useState<number>(65);
  const [mgConcentration, setMgConcentration] = useState<string>("50"); // 50% solution commonly used
  const [isCalculated, setIsCalculated] = useState(false);

  const calculateDose = () => {
    setIsCalculated(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 bottom-0 top-0 opacity-15 overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtBvUIBfZ9xo77JyRwiQNoBSlb2DQE6zy00EHYXBIv8GEpL26tplaJW0eYsL6YGw1nFBp6tgn1qTYGufOahlIeoOH2VLycAtoVVULiljEK3ArYnLbwMEb-QdMaHPGME-VGN_0vlF-wHC4Zz5fHUFTyu4Hzk5NPDbX0Bhd3OCh2p-F-VyHzpPoY15nMbMyN2YwK5szbB4zwjNpC_4YGuoDrXDAnuELNQ1hw1UjvbToeQ2EU2U4GzCs3PFAqDCKjjYd7PCzMfGImpng"
            alt="Clinical illustration background"
            className="h-full object-cover scale-110"
          />
        </div>
        <div className="relative z-10 max-w-lg">
          <div className="bg-teal-700/50 backdrop-blur-md text-teal-100 text-xs py-1 px-3 rounded-full inline-flex items-center gap-1.5 font-semibold mb-4 border border-teal-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            OFFICIAL GHANA HEALTH SERVICE PROTOCOLS
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Clinical Education Hub</h2>
          <p className="text-teal-100 text-sm mt-1.5 leading-relaxed">
            Essential references for pre-eclampsia triage, blood pressure standards, and Magnesium Sulfate dosing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Diagnostic protocol sheets */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            Pre-eclampsia Quick Guides
          </h3>

          <div className="space-y-4">
            {CLINICAL_ARTICLES.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(selectedArticle?.id === art.id ? null : art)}
                className={`bg-white rounded-2xl p-5 border cursor-pointer hover:border-teal-500 active:scale-[0.99] transition-all duration-200 ${
                  selectedArticle?.id === art.id ? "border-teal-600 shadow-md ring-1 ring-teal-600/10" : "border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold py-1 px-2.5 bg-slate-100 text-slate-700 rounded-md uppercase tracking-wider">
                    {art.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{art.readingTime} read</span>
                </div>
                <h4 className="font-bold text-slate-900 text-base">{art.title}</h4>
                <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">{art.summary}</p>

                {selectedArticle?.id === art.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 prose prose-sm animate-fadeIn">
                    <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-teal-700">Clinical Focus Points:</h5>
                    <ul className="list-none p-0 m-0 space-y-2.5">
                      {art.details.map((detail, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start text-sm text-slate-700 leading-relaxed">
                          <Check className="w-4 h-4 text-teal-600 grow-0 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-end text-xs text-teal-600 font-bold mt-3">
                  {selectedArticle?.id === art.id ? "Collapse Details" : "Read Full Protocol"}
                  <ChevronRight className={`w-4 h-4 transition-transform ml-0.5 ${selectedArticle?.id === art.id ? "rotate-90" : ""}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Swelling demonstration card */}
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200/60 shadow-sm flex flex-col md:flex-row gap-5">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX_EJsaktW3TIOzJmWZ3_TUuzewNS0aC7htAHLZ0qmj4MAUDJvs1XQ7Imk40LuE9pG_5RYV0OfjY3GW2C2YEmXi_JT0qrqTgNZ1gfvOdhqAEhyUK3R0hJXGHG6a6GEpq6mRFOIsUz8cwK4Qnc4Is8ZQAbdZDWG47fG1kkyPU1ggwDiwKXJDQhTuhsRjqSta_Vltb_tef5Mmum-ZlLgKXUZDsD2YA1zWxoNAFMfDjBgMxX2zBL28KHc4OdruQB4tmzQopMKmbyjxnw"
                alt="Pitting Oedema technique"
                className="rounded-xl w-full h-auto object-cover border border-amber-200"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-3 flex-1">
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-800 py-1 px-2.5 rounded text-left inline-block">
                TECHNIQUE INSTRUCTION
              </span>
              <h4 className="font-bold text-amber-900 text-base">How to Screen for Pitting Oedema</h4>
              <p className="text-slate-700 text-sm leading-relaxed">
                Preeclampsia causes rapid retention of fluid, leading to swollen tissue. Always test specifically for <strong>depth of depression</strong>:
              </p>
              <ol className="text-xs text-slate-600 font-medium space-y-1.5 list-decimal pl-4">
                <li>Press firmly with your thumb on the patient's tibia, dorsum of feet, or ankle for exactly <strong>5 seconds</strong>.</li>
                <li>Release your thumb and check if an imprint / pitting indentation remains.</li>
                <li><strong>Trace (Grade 1+):</strong> Subtle dent, returns immediately.</li>
                <li><strong>Severe (Grade 3-4+):</strong> Deep pit (4-8mm) remaining for several minutes. Face or hand swelling is an critical indicator.</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Right Column - Magnesium safety calculation */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-teal-950 text-white rounded-3xl p-6 border border-teal-800 shadow-lg space-y-5">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-400" />
              Emergency MgSO₄ Dosing Companion
            </h3>
            <p className="text-xs text-teal-100 leading-relaxed">
              Calculates dosage guidelines according to weight and available preparation protocols. Do not use as sole diagnostic validation. Verify deep tendon reflexes before administration!
            </p>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-teal-300 font-mono mb-2">
                  PATIENT ESTIMATED WEIGHT
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="40"
                    max="120"
                    value={weightKg}
                    onChange={(e) => {
                      setWeightKg(Number(e.target.value));
                      setIsCalculated(false);
                    }}
                    className="w-full accent-teal-400"
                  />
                  <span className="text-lg font-bold font-mono min-w-[70px] text-right">
                    {weightKg} kg
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-300 font-mono mb-2">
                  AVAILABLE MgSO₄ PREPARATION CONCENTRATION
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMgConcentration("50");
                      setIsCalculated(false);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      mgConcentration === "50"
                        ? "bg-teal-400 text-teal-950 border-teal-400 shadow-md"
                        : "bg-teal-900/50 text-white border-teal-800 hover:bg-teal-900"
                    }`}
                  >
                    50% w/v (0.5g/mL)
                  </button>
                  <button
                    onClick={() => {
                      setMgConcentration("20");
                      setIsCalculated(false);
                    }}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      mgConcentration === "20"
                        ? "bg-teal-400 text-teal-950 border-teal-400 shadow-md"
                        : "bg-teal-900/50 text-white border-teal-800 hover:bg-teal-900"
                    }`}
                  >
                    20% w/v (0.2g/mL)
                  </button>
                </div>
              </div>

              <button
                onClick={calculateDose}
                className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-teal-950 font-bold text-sm transition-colors cursor-pointer"
              >
                Generate Safety Dosage Chart
              </button>
            </div>

            {isCalculated && (
              <div className="bg-teal-900/40 rounded-2xl p-4 border border-teal-800/80 space-y-3.5 animate-fadeIn">
                <div className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider pb-1.5 border-b border-teal-800">
                  CALCULATED DOSAGES ({weightKg}kg Patient):
                </div>

                <div className="space-y-3.5 divide-y divide-teal-900">
                  <div>
                    <div className="text-xs text-teal-200/80 font-semibold mb-1">
                      1. LOADING DOSE OVERVIEW (IV Administration)
                    </div>
                    <div className="text-sm font-bold text-white leading-normal">
                      4g IV Slowly <span className="text-teal-300 font-mono font-normal">over 20 minutes</span>
                    </div>
                    <p className="text-[10px] text-teal-200 mt-0.5 leading-normal font-mono text-left">
                      Convert to: inject <strong>{(8).toFixed(1)} mL</strong> of the 50% solution or <strong>{(20).toFixed(1)} mL</strong> of the 20% solution. Give directly under strict vitals check.
                    </p>
                  </div>

                  <div className="pt-3">
                    <div className="text-xs text-teal-200/80 font-semibold mb-1">
                      2. DEEP INTRAMUSCULAR DOSE (IM Administration)
                    </div>
                    <div className="text-sm font-bold text-white leading-normal">
                      10g IM <span className="text-teal-300 font-mono font-normal flex-auto">(5g in each buttock)</span>
                    </div>
                    <p className="text-[10px] text-teal-200 mt-0.5 leading-normal font-mono text-left">
                      Requires: inject <strong>10 mL</strong> of the 50% solution in EACH buttock (total 20mL). Add 1mL of 2% Lignocaine to reduce extreme local injection pain.
                    </p>
                  </div>

                  <div className="pt-3">
                    <div className="text-xs text-amber-300 font-bold flex items-center gap-1 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      CRITICAL CLINICAL WATCH
                    </div>
                    <p className="text-[10px] text-slate-300 leading-normal">
                      Withheld next dose immediately if:
                      <br />- Deep tendon knee reflexes are missing.
                      <br />- Vitals drop below 12 breaths/minute.
                      <br />- Hourly urine excretion is less than 30 mL.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Kidney illustration / why we test urine card */}
          <div className="bg-teal-50 rounded-2xl p-5 border border-teal-200/60 shadow-sm flex gap-4">
            <div className="w-20 h-20 bg-teal-100 rounded-xl flex items-center justify-center grow-0 shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtBvUIBfZ9xo77JyRwiQNoBSlb2DQE6zy00EHYXBIv8GEpL26tplaJW0eYsL6YGw1nFBp6tgn1qTYGufOahlIeoOH2VLycAtoVVULiljEK3ArYnLbwMEb-QdMaHPGME-VGN_0vlF-wHC4Zz5fHUFTyu4Hzk5NPDbX0Bhd3OCh2p-F-VyHzpPoY15nMbMyN2YwK5szbB4zwjNpC_4YGuoDrXDAnuELNQ1hw1UjvbToeQ2EU2U4GzCs3PFAqDCKjjYd7PCzMfGImpng"
                alt="Kidney glomerulus"
                className="w-16 h-16 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h4 className="font-bold text-teal-900 text-sm mb-1">Why Proteuniria reflects Kidney Strain</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pre-eclampsia damages the lining of blood vessels, causing a systemic leak. The small filters in the kidney (glomeruli) begin to let precious protein slip through into the urine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
