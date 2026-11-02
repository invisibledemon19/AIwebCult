**Brand Identity & Aesthetics**
* **Name:** AIwebCult
* **Motto:** Delete the busywork. Deploy the machine.
* **Vibe:** Brutalist, anti-generic, industrial, and highly technical.
* **Color Palette:** Pure Black (#000000) for backgrounds, Stark White (#FFFFFF) for text/surfaces, and Terminal Green (#00FF41) for accents.
* **Constraints:** 0px border radius strictly enforced. No gradient blobs, soft shadows, purple colors, floating 3D shapes, or boilerplate SaaS UI components. Borders must be sharp 1px solid lines.

**UI & Interaction Rules**
* **Initial Loader:** A CSS-only terminal boot sequence or stark wireframe geometry on a pure black background. Snaps out of view instantly without soft fades once the React app mounts and the 3D canvas loads.
* **Tactile Buttons (Arcade Style):** Buttons feature a solid 4px block of Terminal Green drop shadow. On click, they mechanically depress (translate X/Y) to cover the shadow and flash inverted colors for 100ms.
* **Authentication Modal:** Split-screen layout. The left panel is stark white with sharp inputs for OTP. The right panel is solid Terminal Green featuring a raw, human-authored testimonial and flat monochrome client logos.

**3D Scroll Experience (Core Requirement)**
* **Environment:** Abstract wireframe monolith or dark data pipeline.
* **Scroll Mechanics:** GSAP ScrollTrigger must be deeply integrated. The camera's Z-axis depth, rotation, and field of view are strictly scrubbed to the user's vertical scroll position. The 3D object dynamically morphs or reveals internal mechanics as the user scrolls down the page.