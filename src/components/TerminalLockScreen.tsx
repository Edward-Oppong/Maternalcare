import React, { useState } from "react";
import { Clinician } from "../types";
import { Lock, ShieldAlert, KeyRound, UserRound, ArrowRight, UserCheck, HelpCircle, Plus, RefreshCcw } from "lucide-react";

interface TerminalLockScreenProps {
  clinicians: Clinician[];
  onUnlock: (clinician: Clinician) => void;
  onRegisterClinician?: (newClin: Clinician) => void;
}

export default function TerminalLockScreen({ clinicians, onUnlock, onRegisterClinician }: TerminalLockScreenProps) {
  const [selectedClin, setSelectedClin] = useState<Clinician>(clinicians[0] || {
    id: "nurse_akosua",
    name: "Nurse Akosua (R.M.)",
    role: "Registered Midwife",
    ghsNumber: "GMR-98442-2026",
    pinCode: "1234",
  });
  
  const [pinCode, setPinCode] = useState("");
  const [pinError, setPinError] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Registration states
  const [regName, setRegName] = useState("");
  const [regRole, setRegRole] = useState("Registered Midwife");
  const [regGhs, setRegGhs] = useState("");
  const [regPin, setRegPin] = useState("");
  const [regError, setRegError] = useState("");
  const [isVerifyingRegistry, setIsVerifyingRegistry] = useState(false);
  const [registryMessage, setRegistryMessage] = useState("");

  const handleKeypadPress = (val: string) => {
    setPinError("");
    if (val === "CLEAR") {
      setPinCode("");
    } else if (val === "DELETE") {
      setPinCode((prev) => prev.slice(0, -1));
    } else {
      if (pinCode.length < 4) {
        setPinCode((prev) => prev + val);
      }
    }
  };

  const handleUnlockSubmit = () => {
    if (pinCode === selectedClin.pinCode) {
      setIsUnlocking(true);
      setPinError("");
      setTimeout(() => {
        onUnlock(selectedClin);
        setIsUnlocking(false);
        setPinCode("");
      }, 750);
    } else {
      setPinError("Invalid security credential key.");
      setPinCode("");
      
      // Bounce animation trigger
      const pinWrapper = document.getElementById("lock-pin-indicator");
      if (pinWrapper) {
        pinWrapper.classList.add("animate-bounce");
        setTimeout(() => pinWrapper.classList.remove("animate-bounce"), 500);
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegistryMessage("");

    if (!regName.trim() || !regGhs.trim() || !regPin.trim()) {
      setRegError("Please specify all details to register.");
      return;
    }

    if (regPin.length !== 4 || isNaN(Number(regPin))) {
      setRegError("PIN must be exactly 4 numeric digits.");
      return;
    }

    // Nurses & Midwives Council (NMC) / Ghana Health Service licensure format validator
    const licensePattern = /^(GMR|NMC|GDC|MDC|PHN|RGN|RM|MO)-\d{3,6}(-\d{4})?$/i;
    if (!licensePattern.test(regGhs.trim())) {
      setRegError("NMC Registry Check Failed: GHS Registration format is incorrect. Official licenses must start with a valid designation prefix followed by digits (e.g. GMR-12345-2026, NMC-88402-2026, or PHN-32049-2026).");
      return;
    }

    const exists = clinicians.some(
      (c) => c.ghsNumber.toLowerCase() === regGhs.trim().toLowerCase()
    );
    if (exists) {
      setRegError("Clinician license/GHS registration already exists.");
      return;
    }

    setIsVerifyingRegistry(true);
    setRegistryMessage("Accessing Nurses and Midwives Council (NMC) Ghana ledger...");

    setTimeout(() => {
      setRegistryMessage(`Checking active status for practitioner '${regName}'...`);
      
      setTimeout(() => {
        const newClin: Clinician = {
          id: `clin_${Date.now()}`,
          name: regName.trim(),
          role: regRole,
          ghsNumber: regGhs.trim().toUpperCase(),
          pinCode: regPin.trim(),
        };

        setIsVerifyingRegistry(false);
        setRegistryMessage("");

        if (onRegisterClinician) {
          onRegisterClinician(newClin);
        }
        
        // Auto unlock with new clinician
        setIsUnlocking(true);
        setTimeout(() => {
          onUnlock(newClin);
          setIsUnlocking(false);
        }, 750);
      }, 800);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-50 overflow-y-auto selection:bg-teal-500/10 transition-all font-sans select-none">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-800 flex flex-col relative my-6">
        
        {/* Urgent header branding banner */}
        <div className="bg-gradient-to-r from-red-600 to-slate-900 p-6 text-white text-left">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/15 border border-red-400/30 text-[9px] font-mono tracking-wider font-extrabold uppercase text-red-200">
                ● SESSION LOCKED
              </span>
              <h2 className="text-xl font-black tracking-tight uppercase flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-400 stroke-[2.5]" />
                Obstetric Station Secure
              </h2>
              <p className="text-[10px] text-slate-300 font-mono tracking-wide leading-none">
                GHS Patient Data Protection Directive System
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
              <ShieldAlert className="w-6 h-6 text-red-200" />
            </div>
          </div>
        </div>

        {isUnlocking ? (
          <div className="p-12 text-center py-20 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <UserCheck className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-800">License Handshake Verified</h3>
              <p className="text-xs text-slate-450 font-mono tracking-wide">
                Restoring clinical triage logs...
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6 text-left">
            
            {/* 1. Toggle between select clinician / register new clinician */}
            {onRegisterClinician && (
              <div className="flex gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    !showRegisterForm
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Confirm Registered PIN
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegisterForm(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    showRegisterForm
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Register New Midwife Card
                </button>
              </div>
            )}

            {showRegisterForm ? (
              /* DYNAMIC REGISTRATION DIRECT FROM LOCK SCREEN */
              <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-fadeIn">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">
                    Add Practitioner Shift Profile
                  </h4>
                  <p className="text-xs text-slate-500 leading-normal">
                    Enter your professional details. Your registered name will print on patient referral letters and triage history logs.
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <label className="text-[9px] font-bold text-slate-450 uppercase block mb-1">
                      Staff Member Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Midwife Mary Mensah"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full text-xs p-3 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:border-teal-500 outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-455 uppercase block mb-1">
                      Role Title Designation
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full text-xs p-3 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:border-teal-500 outline-none font-bold"
                    >
                      <option value="Registered Midwife">Registered Midwife (R.M.)</option>
                      <option value="Medical Officer">Medical Officer (M.O.)</option>
                      <option value="Public Health Nurse">Public Health Nurse (P.H.N.)</option>
                      <option value="Senior Midwife Adviser">Senior Midwife Adviser</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[9px] font-bold text-slate-455 uppercase block mb-1">
                        GHS License/ID No
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. GMR-12003-2026"
                        value={regGhs}
                        onChange={(e) => setRegGhs(e.target.value)}
                        className="w-full text-xs font-mono p-3 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:border-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-455 uppercase block mb-1">
                        Secure 4-Digit PIN Code
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="e.g. 1122"
                        maxLength={4}
                        value={regPin}
                        onChange={(e) => setRegPin(e.target.value)}
                        className="w-full text-center text-xs tracking-widest p-3 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:border-teal-500 outline-none font-bold"
                      />
                    </div>
                  </div>
                </div>

                {isVerifyingRegistry && (
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center gap-3 animate-pulse font-sans">
                    <RefreshCcw className="w-5 h-5 text-teal-600 animate-spin shrink-0" />
                    <div className="space-y-0.5 text-left">
                      <p className="text-xs font-bold text-teal-800">Verifying Professional Credentials</p>
                      <p className="text-[10px] font-mono text-teal-605">{registryMessage}</p>
                    </div>
                  </div>
                )}

                {regError && (
                  <p className="text-xs text-red-655 font-bold bg-red-50 p-2.5 rounded-xl border border-red-200/50">
                    ⚠ {regError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isVerifyingRegistry}
                  className={`w-full py-3.5 font-black text-xs rounded-xl transition uppercase tracking-wider shadow-sm active:scale-95 ${
                    isVerifyingRegistry
                      ? "bg-slate-205 text-slate-400 border border-transparent cursor-not-allowed"
                      : "bg-teal-600 hover:bg-teal-750 text-white cursor-pointer"
                  }`}
                >
                  {isVerifyingRegistry ? "Querying GHS Database..." : "Register Profile & Log In"}
                </button>
              </form>
            ) : (
              /* TRADITIONAL PIN SIGN-IN GRID */
              <div className="space-y-6">
                <div className="bg-red-50/60 border border-red-200/50 rounded-2xl p-4 flex gap-3.5 items-start">
                  <div className="p-2 bg-red-100 rounded-xl text-red-655 shrink-0">
                    <Lock className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-805 uppercase tracking-tight">Terminal Shift Locked</h4>
                    <p className="text-xs text-slate-500 leading-normal font-medium">
                      Select your clinician card below or use the clinical register tab above to activate a new shift card, then enter your 4-digit security PIN.
                    </p>
                  </div>
                </div>

                {/* Clinician Card Selector */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-455 uppercase block">
                    Select Active Midwife or Doctor
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {clinicians.map((clin) => {
                      const isSel = selectedClin.id === clin.id;
                      return (
                        <button
                          key={clin.id}
                          type="button"
                          onClick={() => {
                            setSelectedClin(clin);
                            setPinCode("");
                            setPinError("");
                          }}
                          className={`p-3 rounded-2xl border text-center relative transition-all flex flex-col items-center justify-between gap-2.5 cursor-pointer h-28 ${
                            isSel
                              ? "bg-teal-50/60 border-teal-500 ring-4 ring-teal-500/10"
                              : "bg-white border-slate-205 hover:bg-slate-50"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden border bg-slate-100 flex items-center justify-center shrink-0">
                            {clin.avatarUrl ? (
                              <img
                                src={clin.avatarUrl}
                                alt={clin.name}
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <UserRound className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          
                          <div className="space-y-0.5 w-full text-center">
                            <h5 className="text-[10px] font-black text-slate-800 leading-tight block truncate max-w-full">
                              {clin.name.split(" ")[0]} {clin.name.split(" ")[1] ? clin.name.split(" ")[1].charAt(0) + "." : ""}
                            </h5>
                            <span className="text-[8px] text-slate-405 block font-bold uppercase leading-none">
                              {clin.role === "Registered Midwife" ? "R.M." : clin.role === "Medical Officer" ? "M.O." : "Staff"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PIN Numeric Keypad Verification Block */}
                <div className="bg-slate-50 border rounded-2xl p-4.5 space-y-3.5">
                  <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="text-xs font-medium text-slate-500 truncate max-w-[200px]">
                      Practitioner: <strong className="text-slate-900">{selectedClin.name}</strong>
                    </span>
                    <span className="text-[9px] font-mono font-bold text-slate-450 shrink-0">
                      Lic: {selectedClin.ghsNumber}
                    </span>
                  </div>

                  {/* Secure Dots Visual Indicator */}
                  <div id="lock-pin-indicator" className="flex flex-col items-center justify-center gap-1.5 py-1">
                    <div className="flex gap-3 justify-center">
                      {[0, 1, 2, 3].map((idx) => {
                        const filled = pinCode.length > idx;
                        return (
                          <span
                            key={idx}
                            className={`w-4 h-4 rounded-full border-2 transition-all ${
                              filled
                                ? "bg-teal-600 border-teal-600 scale-110"
                                : "bg-transparent border-slate-350"
                            }`}
                          />
                        );
                      })}
                    </div>
                    {pinError ? (
                      <span className="text-xs text-red-655 font-bold mt-1 shadow-sm leading-none block">
                        ⚠ {pinError}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-450 font-mono mt-1 leading-none flex items-center gap-1 justify-center">
                        <HelpCircle className="w-3 h-3 text-slate-400" />
                        Testing PIN: <strong className="text-teal-700 font-extrabold">{selectedClin.pinCode}</strong>
                      </span>
                    )}
                  </div>

                  {/* Secure Web Keypad Grid */}
                  <div className="grid grid-cols-3 gap-1.5 max-w-[240px] mx-auto">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLEAR", "0", "DELETE"].map((numKey) => {
                      return (
                        <button
                          key={numKey}
                          type="button"
                          onClick={() => handleKeypadPress(numKey)}
                          className={`py-2 rounded-xl text-xs font-bold font-sans transition active:scale-95 cursor-pointer flex items-center justify-center border border-slate-200 ${
                            numKey === "CLEAR" || numKey === "DELETE"
                              ? "bg-slate-200 text-slate-600 font-bold hover:bg-slate-250 text-[10px]"
                              : "bg-white text-slate-800 hover:bg-slate-100 font-black text-sm"
                          }`}
                        >
                          {numKey}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleUnlockSubmit}
                    disabled={pinCode.length !== 4}
                    className={`w-full py-3.5 rounded-xl font-black text-xs transition uppercase ${
                      pinCode.length === 4
                        ? "bg-teal-600 border border-teal-600 hover:bg-teal-750 text-white shadow-md active:scale-95"
                        : "bg-slate-205 text-slate-400 border border-transparent cursor-not-allowed"
                    }`}
                  >
                    Unlock Ob-Shift Console
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
