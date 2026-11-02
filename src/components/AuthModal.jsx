import React, { useState } from "react";
import Button from "./Button";
import {
  sendPhoneOtp,
  verifyPhoneOtp,
  sendEmailOtpLink,
} from "../firebase";
import { logAuthSignup } from "../sheetsService";

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState("PHONE"); // 'PHONE' | 'EMAIL'
  const [step, setStep] = useState("INPUT"); // 'INPUT' | 'VERIFY_OTP'
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  if (!isOpen) return null;

  // Handles Phone OTP submission
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    setIsLoading(true);

    const formattedPhone = phone.trim().startsWith("+") ? phone.trim() : `+${phone.trim()}`;
    const result = await sendPhoneOtp(formattedPhone, "recaptcha-container");

    setIsLoading(false);
    if (result.success) {
      setStep("VERIFY_OTP");
      setInfoMsg(`OTP dispatched to ${formattedPhone}. Enter 6-digit code.`);
    } else {
      setErrorMsg(result.message || "Failed to dispatch phone verification code.");
    }
  };

  // Handles Email Link submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    setIsLoading(true);

    const result = await sendEmailOtpLink(email.trim());
    setIsLoading(false);

    if (result.success) {
      setInfoMsg(`Authorization link sent to ${email}. Check your inbox.`);
    } else {
      setErrorMsg(result.message || "Failed to dispatch email link.");
    }
  };

  // Handles 6-digit OTP confirmation
  const handleOtpConfirm = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const code = otp.join("");
    if (code.length !== 6) {
      setErrorMsg("Verification code must be exactly 6 digits.");
      return;
    }

    setIsLoading(true);
    const result = await verifyPhoneOtp(code);
    setIsLoading(false);

    if (result.success) {
      // Log signup UID directly to Google Sheets via Google Apps Script
      await logAuthSignup({
        uid: result.uid,
        phoneNumber: result.user?.phoneNumber || phone,
        authMethod: "PHONE_OTP",
      });

      if (onAuthSuccess) onAuthSuccess(result.user);
      onClose();
    } else {
      setErrorMsg(result.message || "Invalid or expired verification token.");
    }
  };

  const handleDigitChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance focus to next digit field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000] bg-opacity-90 p-4 font-mono select-none"
      style={{ borderRadius: "0px" }}
    >
      {/* Modal Main Frame */}
      <div
        className="relative w-full max-w-4xl border-[1px] border-[#FFFFFF] bg-[#000000] grid grid-cols-1 md:grid-cols-2 shadow-[8px_8px_0px_0px_#00FF41]"
        style={{ borderRadius: "0px" }}
      >
        {/* Instant Exit Trigger */}
        <button
          onClick={onClose}
          aria-label="Close Authentication Gateway"
          className="absolute -top-4 -right-4 z-20 w-8 h-8 bg-[#000000] text-[#FFFFFF] border-[1px] border-[#FFFFFF] flex items-center justify-center font-bold hover:bg-[#00FF41] hover:text-[#000000] active:translate-x-[2px] active:translate-y-[2px]"
          style={{ borderRadius: "0px" }}
        >
          X
        </button>

        {/* LEFT PANEL: Stark White Action Area */}
        <div className="bg-[#FFFFFF] text-[#000000] p-6 md:p-10 flex flex-col justify-between border-b-[1px] md:border-b-0 md:border-r-[1px] border-[#000000]">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <span className="w-2.5 h-2.5 bg-[#000000]" />
              <span className="text-xs tracking-widest uppercase font-bold text-[#000000]">
                CLIENT GATEWAY // AUTH
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-industrial font-extrabold uppercase tracking-tight text-[#000000] mb-2">
              AUTHENTICATE
            </h2>
            <p className="text-xs text-[#000000] font-mono mb-6 opacity-80">
              Zero passwords. Client sessions authorized via Firebase OTP and logged to Google Sheets.
            </p>

            {/* Auth Mode Toggle */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("PHONE");
                  setStep("INPUT");
                  setErrorMsg("");
                  setInfoMsg("");
                }}
                className={`py-2 px-3 border-[1px] border-[#000000] text-xs font-mono font-bold uppercase transition-none ${
                  authMode === "PHONE"
                    ? "bg-[#000000] text-[#FFFFFF]"
                    : "bg-[#FFFFFF] text-[#000000]"
                }`}
                style={{ borderRadius: "0px" }}
              >
                PHONE OTP
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode("EMAIL");
                  setStep("INPUT");
                  setErrorMsg("");
                  setInfoMsg("");
                }}
                className={`py-2 px-3 border-[1px] border-[#000000] text-xs font-mono font-bold uppercase transition-none ${
                  authMode === "EMAIL"
                    ? "bg-[#000000] text-[#FFFFFF]"
                    : "bg-[#FFFFFF] text-[#000000]"
                }`}
                style={{ borderRadius: "0px" }}
              >
                EMAIL LINK
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-2 bg-[#000000] text-[#00FF41] border-[1px] border-[#000000] text-xs font-mono">
                [ERR]: {errorMsg}
              </div>
            )}

            {infoMsg && (
              <div className="mb-4 p-2 bg-[#000000] text-[#FFFFFF] border-[1px] border-[#00FF41] text-xs font-mono">
                [OK]: {infoMsg}
              </div>
            )}

            {/* PHONE AUTH: INPUT STEP */}
            {authMode === "PHONE" && step === "INPUT" && (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-mono font-bold mb-1 text-[#000000]">
                    PHONE NUMBER SPECIFICATION
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 019 2831"
                    className="w-full px-3 py-2.5 border-[1px] border-[#000000] bg-[#FFFFFF] text-[#000000] text-sm font-mono placeholder:text-neutral-400 focus:outline-2 focus:outline-[#00FF41]"
                    style={{ borderRadius: "0px" }}
                  />
                  <span className="text-[10px] text-neutral-500 font-mono block mt-1">
                    Format: +[Country Code][Number] (e.g. +14155552671)
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? "DISPATCHING RECAPTCHA..." : "DISPATCH OTP"}
                </Button>
              </form>
            )}

            {/* PHONE AUTH: VERIFY OTP STEP */}
            {authMode === "PHONE" && step === "VERIFY_OTP" && (
              <form onSubmit={handleOtpConfirm} className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] uppercase tracking-wider font-mono font-bold text-[#000000]">
                      ENTER 6-DIGIT CODE
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep("INPUT")}
                      className="text-[10px] underline font-mono text-[#000000]"
                    >
                      EDIT NUMBER
                    </button>
                  </div>

                  <div className="grid grid-cols-6 gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(idx, e.target.value)}
                        className="w-full h-12 text-center text-lg font-mono font-bold border-[1px] border-[#000000] bg-[#FFFFFF] text-[#000000] focus:outline-2 focus:outline-[#00FF41]"
                        style={{ borderRadius: "0px" }}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? "VERIFYING..." : "CONFIRM TOKEN"}
                </Button>
              </form>
            )}

            {/* EMAIL LINK AUTH */}
            {authMode === "EMAIL" && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-mono font-bold mb-1 text-[#000000]">
                    AUTHORIZED WORK EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="architect@domain.com"
                    className="w-full px-3 py-2.5 border-[1px] border-[#000000] bg-[#FFFFFF] text-[#000000] text-sm font-mono placeholder:text-neutral-400 focus:outline-2 focus:outline-[#00FF41]"
                    style={{ borderRadius: "0px" }}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? "TRANSMITTING..." : "SEND SIGN-IN LINK"}
                </Button>
              </form>
            )}
          </div>

          <div className="pt-6 mt-6 border-t-[1px] border-[#000000] text-[10px] text-neutral-600 font-mono">
            SECURE ACCESS MONITORED // LOGGED VIA APPS SCRIPT MIDDLEWARE
          </div>
        </div>

        {/* RIGHT PANEL: Terminal Green Social Proof */}
        <div className="bg-[#00FF41] text-[#000000] p-6 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-[1px] border-[#000000] pb-3 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-widest">
                VERIFIED TELEMETRY // AUDIT 104
              </span>
              <span className="text-[10px] uppercase bg-[#000000] text-[#00FF41] px-2 py-0.5 font-mono">
                RECORDED ROI
              </span>
            </div>

            {/* Human-Authored Direct Testimonial */}
            <div className="space-y-4">
              <p className="font-industrial text-base md:text-lg font-bold leading-snug uppercase tracking-tight text-[#000000]">
                &ldquo;We replaced our bloated legacy SaaS pipeline with AIwebCult. Latency dropped from 1,420ms to 84ms within 48 hours of cutover. Infrastructure bill collapsed by $42,600 in the third quarter alone. Zero dropped packets across 14.8 million consecutive transactions.&rdquo;
              </p>

              <div className="pt-2 font-mono text-xs">
                <div className="font-bold uppercase tracking-wider text-[#000000]">
                  MARCUS VANCE
                </div>
                <div className="text-[11px] text-[#000000] opacity-80 uppercase">
                  VP INFRASTRUCTURE, VECTORSCALE DATA SYSTEMS
                </div>
              </div>
            </div>
          </div>

          {/* Flat monochrome client logos with NO hover opacity shifts */}
          <div className="mt-8 pt-6 border-t-[1px] border-[#000000]">
            <div className="text-[10px] font-bold tracking-widest uppercase mb-3">
              PRODUCTION NODES DEPLOYED AT:
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono font-bold">
              <div className="p-2 border-[1px] border-[#000000] bg-[#00FF41] text-[#000000]">
                HYPER_IO
              </div>
              <div className="p-2 border-[1px] border-[#000000] bg-[#00FF41] text-[#000000]">
                SYNTH_NET
              </div>
              <div className="p-2 border-[1px] border-[#000000] bg-[#00FF41] text-[#000000]">
                KINETIC_DB
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

