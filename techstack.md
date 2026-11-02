**Core Framework & Hosting**
* **Framework:** React 18+ bundled with Vite for ultra-fast Hot Module Replacement (HMR) and optimized client-side builds.
* **Hosting:** Vercel, Netlify, or Cloudflare Pages hooked directly to the GitHub repository for continuous deployment.

**3D Engine & Scroll Effects**
* **3D Library:** Three.js paired with React Three Fiber (R3F).
* **Scroll Animations:** GSAP (GreenSock) Core + GSAP ScrollTrigger plugin. This is mandatory to bind the Three.js camera movements to the browser's native scrollbar.

**Data & Authentication**
* **Database:** Google Sheets API.
* **Authentication:** Firebase Authentication (specifically configured for Phone Number OTP and Email Link OTP).

**Styling**
* **CSS:** Tailwind CSS. The `tailwind.config.js` must overwrite default settings to disable rounded corners (`borderRadius: { none: '0' }`) and enforce the custom pure black/neon green palette.