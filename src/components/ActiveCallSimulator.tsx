/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Phone, PhoneOff, UserCheck, ShieldAlert, Volume2 } from "lucide-react";
import { Facility } from "../types";

interface ActiveCallSimulatorProps {
  facility: Facility;
  patientName: string;
  onClose: () => void;
}

export default function ActiveCallSimulator({
  facility,
  patientName,
  onClose,
}: ActiveCallSimulatorProps) {
  const [callStatus, setCallStatus] = useState<"dialing" | "connected" | "ended">("dialing");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (callStatus === "connected") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  useEffect(() => {
    if (callStatus === "dialing") {
      const timeout = setTimeout(() => {
        setCallStatus("connected");
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [callStatus]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remaining.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-950 text-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-red-500/20">
        <div className="p-8 text-center flex flex-col items-center">
          <div className="mb-4 text-xs font-mono py-1 px-3 bg-red-950 text-red-400 rounded-full border border-red-900/40 inline-block animate-pulse">
            EMERGENCY TRIAGE HOTLINE
          </div>

          <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
            {callStatus === "dialing" && (
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500/20 animate-ping" />
            )}
            <div className="relative w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-900/30">
              <Phone className="w-10 h-10 animate-pulse" />
            </div>
          </div>

          <h3 className="text-xl font-bold tracking-tight mb-1">{facility.name}</h3>
          <p className="text-red-400 text-sm mb-6 font-mono font-medium">{facility.phone}</p>

          <div className="w-full bg-slate-900 rounded-2xl p-4 mb-8 text-left border border-slate-800">
            {callStatus === "dialing" && (
              <div className="text-center text-slate-400 py-2">
                <p className="text-sm font-medium animate-pulse">Dialing hospital hotline...</p>
                <p className="text-xs text-slate-500 mt-1">Connecting midwife clinical channel</p>
              </div>
            )}

            {callStatus === "connected" && (
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    CONNECTED • CLINICAL HANDOVER
                  </span>
                  <span className="text-xs font-mono text-slate-400">{formatTime(timer)}</span>
                </div>

                <div className="space-y-3 prose prose-invert">
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    <strong>Midwife Handover Script:</strong>
                    <br />
                    "Hello, this is Midwife Akosua. I am referring a <strong>{patientName}</strong> who screened <strong>HIGH RISK</strong> for pre-eclampsia. Vitals stand at clinical emergency. Requesting immediate obstetric admission."
                  </p>

                  <div className="p-2.5 bg-red-950/20 border border-red-900/30 rounded-lg flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-red-300 leading-normal">
                      Ask the admitting doctor to confirm availability of <strong>Magnesium Sulfate</strong> and incubator space if gestational age is low.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 w-full">
            <button
              onClick={() => {
                setCallStatus("ended");
                setTimeout(onClose, 800);
              }}
              className="py-3.5 px-6 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white font-semibold flex items-center justify-center gap-2 w-full shadow-lg shadow-red-950/40"
            >
              <PhoneOff className="w-5 h-5" />
              {callStatus === "connected" ? "End Handover" : "Cancel Call"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
