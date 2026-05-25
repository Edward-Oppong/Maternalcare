import React, { useState } from "react";
import { Clinician } from "../types";
import { X, ShieldCheck, KeyRound, UserRound, Plus, Fingerprint, RefreshCcw, Landmark, UserCheck } from "lucide-react";

interface ClinicianAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinicians: Clinician[];
  activeClinician: Clinician;
  onSelectClinician: (clinician: Clinician) => void;
  onRegisterClinician: (newClin: Clinician) => void;
}

export default function ClinicianAuthModal({
  isOpen,
  onClose,
  clinicians,
  activeClinician,
  onSelectClinician,
  onRegisterClinician,
}: ClinicianAuthModalProps) {
  const [selectedClin, setSelectedClin] = useState<Clinician>(activeClinician);
  const [pinCode, setPinCode] = useState("");
  const [pinError, setPinError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Registration states
  const [regName, setRegName] = useState("");
  const [regRole, setRegRole] = useState("Registered Midwife");
  const [regGhs, setRegGhs] = useState("");
  const [regPin, setRegPin] = useState("");
  const [regError, setRegError] = useState("");

  if (!isOpen) return null;

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

  const verifyPinAndLogin = () => {
    if (pinCode === selectedClin.pinCode) {
      setIsSuccess(true);
      setPinError("");
      setTimeout(() => {
        onSelectClinician(selectedClin);
        setIsSuccess(false);
        setPinCode("");
        onClose();
      }, 1000);
    } else {
      setPinError("Incorrect PIN entered. Please try again.");
      setPinCode("");
      // Add subtle shake effect
      const element = document.getElementById("pin-display-wrapper");
      if (element) {
        element.classList.add("animate-bounce");
        setTimeout(() => element.classList.remove("animate-bounce"), 500);
      }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (!regName.trim() || !regGhs.trim() || !regPin.trim()) {
      setRegError("Please fill out all registration fields.");
      return;
    }

    if (regPin.length !== 4 || isNaN(Number(regPin))) {
      setRegError("PIN must be exactly 4 numeric digits.");
      return;
    }

    const exists = clinicians.some(
      (c) => c.ghsNumber.toLowerCase() === regGhs.trim().toLowerCase()
    );
    if (exists) {
      setRegError("Clinician license/GHS registration already exists.");
      return;
    }

    const newClin: Clinician = {
      id: `clin_${Date.now()}`,
      name: regName.trim(),
      role: regRole,
      ghsNumber: regGhs.trim().toUpperCase(),
      pinCode: regPin.trim(),
    };

    onRegisterClinician(newClin);
    setSelectedClin(newClin);
    setShowRegisterForm(false);
    setRegName("");
    setRegGhs("");
    setRegPin("");
    setPinCode("");
    setPinError("");
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col my-8">
        
        {/* Banner header bar */}
        <div className="bg-gradient-to-r from-teal-850 to-slate-900 p-5 text-white flex justify-between items-center text-left">
          <div className="space-y-1">
            <h2 className="text-lg font-black tracking-tight uppercase flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-teal-400" />
              GHS Clinician Identity Manager
            </h2>
            <p className="text-[10px] text-slate-300 font-mono tracking-wide">
              District Health Network Securesign System
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success screen overlay */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-4 flex-1 flex flex-col justify-center items-center py-20 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-pulse">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-800">Verification Successful</h3>
              <p className="text-sm text-slate-500 font-mono">
                Approved license GMR ID saved to session
              </p>
            </div>
            <div className="py-2 px-4 bg-slate-100 rounded-xl font-bold text-slate-800 text-xs">
              Logged in successfully as {selectedClin.name}
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-6 flex-1 text-left">
            
            {/* 1. Toggle between select / register */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowRegisterForm(false)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                  !showRegisterForm
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Sign In Active Staff
              </button>
              <button
                onClick={() => setShowRegisterForm(true)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                  showRegisterForm
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                Register New Midwife Card
              </button>
            </div>

            {/* REGISTER FORM */}
            {showRegisterForm ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                    Add Practitioner Signature Card
                  </h4>
                  <p className="text-xs text-slate-450 leading-relaxed">
                    Create your profile so your name correctly prints on referrals during the current shift.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-450 uppercase block mb-1">
                      Full Staff Name (e.g. Nurse Akosua)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Practitioner Mary Mensah"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full text-sm p-3 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:border-teal-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-450 uppercase block mb-1">
                      Professional Role Designation
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      className="w-full text-sm p-3 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:border-teal-500 outline-none"
                    >
                      <option value="Registered Midwife">Registered Midwife (R.M.)</option>
                      <option value="Medical Officer">Medical Officer (M.O.)</option>
                      <option value="Public Health Nurse">Public Health Nurse (P.H.N.)</option>
                      <option value="Senior Midwifery Advisor">Senior Midwifery Advisor</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-455 uppercase block mb-1">
                        GHS License/ID No
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. GMR-44910-2026"
                        value={regGhs}
                        onChange={(e) => setRegGhs(e.target.value)}
                        className="w-full text-xs font-mono p-3 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:border-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-455 uppercase block mb-1">
                        Secure 4-Digit PIN code
                      </label>
                      <input
                        type="password"
                        placeholder="e.g. 1234"
                        maxLength={4}
                        value={regPin}
                        onChange={(e) => setRegPin(e.target.value)}
                        className="w-full text-center text-sm tracking-widest p-3 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:border-teal-500 outline-none font-bold"
                      />
                    </div>
                  </div>
                </div>

                {regError && (
                  <p className="text-xs text-red-600 font-semibold bg-red-50 p-2 px-3 rounded-lg border border-red-200/50">
                    ⚠ {regError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl transition cursor-pointer uppercase tracking-wider"
                >
                  Register Staff Card & Activate
                </button>
              </form>
            ) : (
              /* SIGN IN FORM with Pinpad and selected clinician cards */
              <div className="space-y-5">
                
                {/* 1. Select Practitioner */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-455 uppercase block">
                    Choose Practitioner Profile to Login
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {clinicians.map((clin) => {
                      const isSelected = selectedClin.id === clin.id;
                      return (
                        <button
                          key={clin.id}
                          type="button"
                          onClick={() => {
                            setSelectedClin(clin);
                            setPinCode("");
                            setPinError("");
                          }}
                          className={`p-3 rounded-2xl border text-center relative transition-all flex flex-col items-center justify-between gap-2.5 cursor-pointer ${
                            isSelected
                              ? "bg-teal-50/60 border-teal-500 ring-2 ring-teal-500/20"
                              : "bg-white border-slate-200 hover:bg-slate-50"
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
                          
                          <div className="space-y-0.5">
                            <h5 className="text-[11px] font-black text-slate-800 leading-tight block">
                              {clin.name.split(" ")[0]} {clin.name.split(" ")[1] ? clin.name.split(" ")[1].charAt(0) + "." : ""}
                            </h5>
                            <span className="text-[9px] text-slate-400 block font-semibold leading-none">
                              {clin.role === "Registered Midwife" ? "R.M." : clin.role === "Medical Officer" ? "M.O." : "Staff"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Pin validator system content */}
                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500 leading-none">
                      Active Profile: <strong>{selectedClin.name}</strong>
                    </span>
                    <span className="text-[9px] font-mono text-slate-450">
                      GHS Lic: {selectedClin.ghsNumber}
                    </span>
                  </div>

                  {/* Pin Dot Indicators */}
                  <div id="pin-display-wrapper" className="flex flex-col items-center justify-center gap-1.5 py-2">
                    <div className="flex gap-2.5 justify-center">
                      {[0, 1, 2, 3].map((idx) => {
                        const filled = pinCode.length > idx;
                        return (
                          <span
                            key={idx}
                            className={`w-4.5 h-4.5 rounded-full border-2 transition-all ${
                              filled
                                ? "bg-teal-600 border-teal-600 scale-110"
                                : "bg-transparent border-slate-350"
                            }`}
                          />
                        );
                      })}
                    </div>
                    {pinError ? (
                      <span className="text-[11px] text-red-655 font-bold leading-none mt-1.5 block">
                        ⚠ {pinError}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono mt-1.5 block leading-none">
                        Default testing PIN: <strong className="text-teal-700">{selectedClin.pinCode}</strong>
                      </span>
                    )}
                  </div>

                  {/* Clinical Secure Keypad */}
                  <div className="grid grid-cols-3 gap-1.5 max-w-xs mx-auto pt-1 font-sans">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "CLEAR", "0", "DELETE"].map((k) => {
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => handleKeypadPress(k)}
                          className={`py-2 px-4 rounded-xl text-sm font-bold transition active:scale-95 cursor-pointer flex items-center justify-center ${
                            k === "CLEAR" || k === "DELETE"
                              ? "bg-slate-200 hover:bg-slate-300 text-slate-600 text-[10px] tracking-tight"
                              : "bg-white border border-slate-200 hover:bg-slate-100 text-slate-800"
                          }`}
                        >
                          {k}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={verifyPinAndLogin}
                    disabled={pinCode.length !== 4}
                    className={`w-full py-3 rounded-xl font-black text-xs transition uppercase mt-2 cursor-pointer ${
                      pinCode.length === 4
                        ? "bg-slate-900 border border-slate-900 text-white hover:bg-slate-800"
                        : "bg-slate-205 text-slate-400 border border-transparent cursor-not-allowed"
                    }`}
                  >
                    Confirm Security Pin
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
