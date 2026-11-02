import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";
import CanvasScene from "./components/CanvasScene";
import AuthModal from "./components/AuthModal";
import Home from "./pages/Home";
import AuthCallback from "./pages/AuthCallback";

export const App = () => {
  const [is3DReady, setIs3DReady] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-[#000000] text-[#FFFFFF] font-mono selection:bg-[#00FF41] selection:text-[#000000]">
        {/* 1. Terminal Boot Preloader - Snaps out instantly with 0ms fade when WebGL is hydrated */}
        <Loader isReady={is3DReady} />

        {/* 2. R3F WebGL Canvas - Driven via GSAP ScrollTrigger camera bindings */}
        <CanvasScene onLoaded={() => setIs3DReady(true)} />

        {/* 3. React Router App Routing */}
        <Routes>
          <Route path="/" element={<Home onOpenAuth={() => setIsAuthOpen(true)} />} />
          <Route path="/auth-callback" element={<AuthCallback />} />
        </Routes>

        {/* 4. Split-Screen Brutalist Auth Modal (Firebase OTP + Google Sheets) */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={(user) => {
            console.info("[AUTH_SUCCESS] Logged in as:", user);
          }}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;

