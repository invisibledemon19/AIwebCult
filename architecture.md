**System Architecture & Data Flow**
* **Frontend Rendering:** Client-Side Rendering (CSR) via React and Vite. Routing managed by React Router. 
* **3D Asset Management:** React Three Fiber (R3F) handles the WebGL canvas. The canvas is initialized only after the initial DOM paint to prioritize perceived load speed. 
* **Backend via Google Sheets:** The React frontend makes HTTP POST requests to a secure Google Apps Script Web App URL (or a serverless Cloudflare Worker). This middleware authenticates the request and pushes the form entries, reviews, and contact data into Google Sheets.
* **Authentication Flow:** Firebase Auth manages the passwordless Email/Phone OTP flow entirely on the client side. Once Firebase issues the authentication token, the user session is cached in local storage, and the UID is passed to the Google Sheets middleware to log the user signup.

**Performance & SEO**
* **Media:** All images converted to WebP with explicit height/width attributes.
* **Build Optimization:** Vite's Rollup bundler config must explicitly code-split the massive Three.js and GSAP libraries to prevent bloated JS payloads on the initial load.
* **SEO Management:** React Helmet handles dynamic injection of canonical tags, unique meta descriptions, and JSON-LD schema (FAQ and Breadcrumbs) into the `<head>`.