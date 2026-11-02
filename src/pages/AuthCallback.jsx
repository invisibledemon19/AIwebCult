import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyEmailOtpLink } from "../firebase";
import { logAuthSignup } from "../sheetsService";
import Button from "../components/Button";

export const AuthCallback = () => {
  const [status, setStatus] = useState("VERIFYING_AUTHORIZATION_LINK...");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const result = await verifyEmailOtpLink();
      if (result.success) {
        setStatus("AUTHORIZATION_GRANTED. LOGGING SESSION...");
        // Pass UID to Google Sheets middleware as mandated by architecture.md
        await logAuthSignup({
          uid: result.uid,
          email: result.user?.email,
          authMethod: "EMAIL_LINK",
        });

        setTimeout(() => {
          navigate("/");
        }, 800);
      } else {
        setError(result.message || "LINK_VERIFICATION_FAILED");
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] font-mono flex items-center justify-center p-6">
      <div className="border-[1px] border-[#FFFFFF] bg-[#000000] p-8 max-w-md w-full shadow-[6px_6px_0px_0px_#00FF41]">
        <div className="text-xs text-[#00FF41] mb-2 uppercase tracking-widest font-bold">
          [CALLBACK_DAEMON]
        </div>
        <h1 className="text-xl font-industrial font-bold uppercase mb-4 text-[#FFFFFF]">
          IDENTITY CONFIRMATION
        </h1>

        {error ? (
          <div>
            <div className="p-3 bg-[#000000] text-[#00FF41] border-[1px] border-[#00FF41] text-xs mb-4">
              [ERR]: {error}
            </div>
            <Button variant="terminal" size="sm" onClick={() => navigate("/")}>
              RETURN TO BASE
            </Button>
          </div>
        ) : (
          <div className="text-xs text-neutral-300 space-y-2">
            <div>&gt; {status}</div>
            <div className="w-full h-1 bg-[#000000] border-[1px] border-[#FFFFFF] mt-4">
              <div className="h-full bg-[#00FF41] animate-pulse" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

