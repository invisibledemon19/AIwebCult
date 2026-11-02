# AIwebCult

> **"Delete the busywork. Deploy the machine."**

Industrial-grade brutalist web architecture with real-time 3D WebGL data pipelines, zero rounded corners, and pure execution speed.

---

## Technical Architecture

- **Frontend Core:** React 18 + Vite (Client-Side Rendering)
- **Routing:** React Router DOM v6
- **3D Graphics Engine:** Three.js + React Three Fiber (R3F)
- **Scroll Synchronization:** GSAP Core + GSAP ScrollTrigger plugin (scrub-bound camera trajectory)
- **Styling & Geometry:** Tailwind CSS v3 (Strict 0px border-radius, pure black `#000000`, stark white `#FFFFFF`, terminal green `#00FF41`)
- **Authentication:** Firebase v10 Modular SDK (Passwordless Phone Number OTP & Email Link OTP)
- **Database / Ingestion:** Google Sheets API via Google Apps Script Web App middleware (zero credentials in client build)

---

## Directory Structure

```
├── .env.example                     # Environment template
├── index.html                       # HTML shell + reCAPTCHA container
├── vite.config.js                   # Code-splitting config (Three.js, GSAP, Firebase chunks)
├── tailwind.config.js               # Radius-wiped Tailwind tokens & 4px block shadows
├── src/
│   ├── main.jsx                     # Application bootstrap
│   ├── App.jsx                      # Routing, WebGL Canvas & Preloader lifecycle
│   ├── index.css                    # Universal 0px reset, terminal scrollbar
│   ├── firebase.js                  # Modular Firebase Auth (Phone/Email Link OTP)
│   ├── sheetsService.js             # Google Apps Script dispatch client
│   ├── components/
│   │   ├── Loader.jsx               # Terminal boot sequence with 0ms snap-out
│   │   ├── Button.jsx               # Arcade physics button + 100ms micro-glitch
│   │   ├── AuthModal.jsx            # Split-screen White / Terminal Green modal
│   │   └── CanvasScene.jsx          # R3F wireframe monolith with ScrollTrigger camera binding
│   └── pages/
│       ├── Home.jsx                 # Landing page with scroll-driven section transitions
│       └── AuthCallback.jsx         # Verification route for passwordless email sign-in
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your Firebase and Google Apps Script endpoints:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Production Build
```bash
npm run build
```
The output will be generated into `dist/` with chunk isolation for Three.js, GSAP, and Firebase.
