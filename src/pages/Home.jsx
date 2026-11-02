import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Button from "../components/Button";

gsap.registerPlugin(ScrollTrigger);

export const Home = ({ onOpenAuth }) => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Hero Content Recedes Mechanically on Scroll
      gsap.to("#hero-content", {
        y: -90,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero-section",
          start: "center center",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // 2. Divider Line Expands from Left
      gsap.fromTo(
        "#specs-divider",
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#pipeline-specs",
            start: "top 80%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // 3. System Constants Header Snaps Up
      gsap.fromTo(
        "#specs-header",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#pipeline-specs",
            start: "top 75%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // 4. Staggered Mechanical Slam Entrance for Cards
      gsap.fromTo(
        ".brutalist-card",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#pipeline-specs",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#000000] border-b-[1px] border-[#FFFFFF] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-industrial font-bold text-lg tracking-wider text-[#FFFFFF]">
            AIWEBCULT
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="terminal"
            size="sm"
            onClick={onOpenAuth}
          >
            SIGN UP
          </Button>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* SECTION 1: HERO */}
        <section
          id="hero-section"
          className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-6xl mx-auto py-24"
        >
          <div id="hero-content">
            <div className="font-mono text-xs md:text-sm tracking-widest uppercase mb-6 flex items-center space-x-3">
              <span className="text-[#00FF41] font-bold">&gt;&gt;</span>
              <span className="text-[#FFFFFF]">ENGINEERED FOR RAW SPEED</span>
              <span className="text-neutral-600">//</span>
              <span className="text-[#00FF41]">ZERO BLOAT</span>
            </div>

            <h1 className="font-industrial font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tighter uppercase leading-[0.95] mb-8 text-[#FFFFFF]">
              THE EFFICIENCY <br />
              <span className="text-[#00FF41]">PURIST.</span>
            </h1>

            <p className="font-mono text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl leading-relaxed mb-10">
              &ldquo;Delete the busywork. Deploy the machine.&rdquo;
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Button
                variant="terminal"
                size="lg"
                prefix="&gt;"
                onClick={onOpenAuth}
              >
                DEPLOY INFRASTRUCTURE
              </Button>

              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  const el = document.getElementById("pipeline-specs");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                SCROLL DATA PIPELINE
              </Button>
            </div>
          </div>
        </section>

        {/* SECTION 2: SPECIFICATIONS GRID */}
        <section
          id="pipeline-specs"
          className="min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 max-w-6xl mx-auto py-24"
        >
          <div id="specs-divider" className="h-[1px] w-full bg-[#FFFFFF] mb-6" />

          <div id="specs-header" className="mb-12">
            <span className="text-xs text-[#00FF41] uppercase tracking-widest">
              TELEMETRY &amp; CONSTRAINTS
            </span>
            <h2 className="text-3xl md:text-5xl font-industrial font-extrabold uppercase tracking-tight mt-2 text-[#FFFFFF]">
              SYSTEM CONSTANTS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="brutalist-card border-[1px] border-[#FFFFFF] bg-[#000000] p-6 shadow-[4px_4px_0px_0px_#FFFFFF] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer">
              <div className="text-xs text-[#00FF41] mb-2 font-mono">01 // GEOMETRY</div>
              <h3 className="text-xl font-industrial font-bold uppercase mb-3">0PX STRICT RADIUS</h3>
              <p className="text-xs text-neutral-400 font-mono leading-relaxed">
                Zero border radius across every container, button, and input element. Soft shadows and pill shapes are permanently eliminated.
              </p>
            </div>

            <div className="brutalist-card border-[1px] border-[#00FF41] bg-[#000000] p-6 shadow-[4px_4px_0px_0px_#00FF41] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer">
              <div className="text-xs text-[#00FF41] mb-2 font-mono">02 // DATA ENGINE</div>
              <h3 className="text-xl font-industrial font-bold uppercase mb-3">SERVERLESS SHEETS</h3>
              <p className="text-xs text-neutral-400 font-mono leading-relaxed">
                Direct Google Sheets API ingestion via Google Apps Script Web App. Zero backend maintenance overhead for high-velocity pipelines.
              </p>
            </div>

            <div className="brutalist-card border-[1px] border-[#FFFFFF] bg-[#000000] p-6 shadow-[4px_4px_0px_0px_#FFFFFF] active:translate-x-[2px] active:translate-y-[2px] cursor-pointer">
              <div className="text-xs text-[#00FF41] mb-2 font-mono">03 // GRAPHICS</div>
              <h3 className="text-xl font-industrial font-bold uppercase mb-3">R3F + GSAP</h3>
              <p className="text-xs text-neutral-400 font-mono leading-relaxed">
                Off-thread 3D monolith rendering. Scrub-synchronized camera timelines locked directly to user scroll position with zero CLS.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: CALL TO ACTION FOOTER */}
        <section className="min-h-[50vh] flex flex-col justify-center items-center px-6 text-center border-t-[1px] border-[#FFFFFF] bg-[#000000] py-20">
          <div className="text-xs text-[#00FF41] uppercase tracking-widest mb-3">
            [READY FOR DIRECT INTEGRATION]
          </div>
          <h2 className="text-3xl sm:text-5xl font-industrial font-extrabold uppercase mb-8 max-w-2xl text-[#FFFFFF]">
            INITIALIZE YOUR CLIENT PORTAL SESSION
          </h2>
          <Button
            variant="terminal"
            size="lg"
            onClick={onOpenAuth}
          >
            ENTER AUTHENTICATED GATEWAY
          </Button>
        </section>
      </main>
    </>
  );
};

export default Home;

