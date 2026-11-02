import React, { useEffect, useState } from "react";

const BOOT_LOGS = [
  "[SYS_INIT] VITE_REACT_CSR_PIPELINE: MOUNTED",
  "[PALETTE] PURE_BLACK: #000000 | STARK_WHITE: #FFFFFF | TERMINAL_GREEN: #00FF41",
  "[GEOMETRY] RADIUS_RULE: 0px_STRICTLY_ENFORCED",
  "[FIREBASE_AUTH] OTP_MIDDLEWARE: READY",
  "[SHEETS_BRIDGE] GOOGLE_APPS_SCRIPT_DISPATCH: INITIALIZED",
  "[WEBGL_R3F] COMPILING SHADERS & WIREFRAME BUFFER",
  "[STATUS] SYSTEM ONLINE: LAUNCHING WORKSPACE",
];

export const Loader = ({ isReady, onFinished }) => {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < BOOT_LOGS.length) {
        const line = BOOT_LOGS[index];
        if (typeof line === "string") {
          setLogs((prev) => [...prev, line]);
        }
        index++;
        setProgress(Math.round((index / BOOT_LOGS.length) * 100));
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // When 3D and app mount is ready, snap out instantly with 0ms transition
    if (isReady && progress >= 100) {
      setDismissed(true);
      if (onFinished) onFinished();
    }
  }, [isReady, progress, onFinished]);

  if (dismissed) return null;

  return (
    <div
      id="terminal-preloader"
      className="fixed inset-0 z-50 bg-[#000000] text-[#FFFFFF] flex flex-col justify-between p-6 md:p-12 font-mono select-none"
      style={{
        borderRadius: "0px",
        transition: "none", // Strict brutalist rule: no soft fades
      }}
    >
      {/* Header telemetry */}
      <div className="flex items-center justify-between border-b-[1px] border-[#FFFFFF] pb-3">
        <div className="flex items-center space-x-3">
          <span className="inline-block w-3 h-3 bg-[#00FF41]" />
          <span className="text-xs uppercase tracking-widest text-[#FFFFFF] font-bold">
            AIWEBCULT // INITIALIZATION SEQUENCE
          </span>
        </div>
        <span className="text-xs text-[#00FF41] font-mono">
          CORE: ACTIVE
        </span>
      </div>

      {/* Terminal log output */}
      <div className="flex-1 my-8 overflow-hidden font-mono text-xs md:text-sm leading-relaxed space-y-2">
        {logs
          .filter((line) => typeof line === "string" && line.length > 0)
          .map((line, idx) => {
            const isHighlight =
              line.includes("ONLINE") || line.includes("STRICTLY_ENFORCED");
            return (
              <div key={idx} className="flex items-center space-x-3">
                <span className="text-[#00FF41] opacity-60">
                  {String(idx + 1).padStart(2, "0")}&gt;
                </span>
                <span className={isHighlight ? "text-[#00FF41] font-bold" : "text-[#FFFFFF]"}>
                  {line}
                </span>
              </div>
            );
          })}

        {/* Blinking cursor */}
        <div className="flex items-center space-x-2 pt-2">
          <span className="text-[#00FF41]">&gt;</span>
          <span className="inline-block w-2.5 h-4 bg-[#00FF41] animate-pulse" />
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="border-t-[1px] border-[#FFFFFF] pt-4">
        <div className="flex justify-between text-xs text-[#FFFFFF] mb-2 uppercase tracking-wider">
          <span>HYDRATING_WEBGL_SCENE</span>
          <span className="text-[#00FF41] font-bold">{progress}%</span>
        </div>
        <div className="w-full h-3 border-[1px] border-[#FFFFFF] p-0.5 bg-[#000000]">
          <div
            className="h-full bg-[#00FF41]"
            style={{
              width: `${progress}%`,
              transition: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loader;

