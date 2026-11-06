# Yogi Suria — One Thread (Website Clone)

An exact, high-performance clone of [ysuriadesign.co](https://ysuriadesign.co/), the award-winning 2026 portfolio of **Yogi Suria** (Design Engineer & Motion Designer). Nominated on Awwwards ("Site of the Day").

Built using the **latest Next.js 16+, React 19, Tailwind CSS v4, Three.js, Web Audio API, custom GLSL shaders, and pnpm**.

---

## ⚡ Tech Stack (Latest Versions)

- **Package Manager:** pnpm 12.18.0
- **Framework:** Next.js 16.4.5 (App Router with Turbopack)
- **UI Library:** React 19.3.1 & React DOM 19.3.1
- **Styling:** Tailwind CSS 4.0.17 & PostCSS
- **3D Graphics:** Three.js 0.180.0
- **Audio:** Web Audio API (Synthesizers, Convolver Reverb, Biquad Filter Bank)
- **Typography:** Geist Variable Font (`/fonts/geist-latin-var.woff`)
- **Icons:** Lucide React 1.70.0

---

## ✨ Reverse-Engineered Features

1. **"Tying the thread" Preloader & Audio Gate:**
   - Accurate 0–100% progress gauge.
   - Dual entry modes: *"Enter with sound"* or *"Enter muted"*.
   - Responsive transition into the 3D journey.

2. **Continuous 3D Catmull-Rom Spline ("The Thread"):**
   - Procedural 3D tube geometry running along a helical spatial trajectory.
   - Interactive pluck and oscillation dynamics responding to cursor movement (`cursorAway`).
   - Custom vertex & fragment shaders simulating traveling luminescence waves, glowing heads, and volumetric fog.

3. **Rigged 3D Humanoid Figure (`/models/figure.v2.glb`):**
   - Real-time procedural bone articulation (head tracking, breathing, upper arm drift).
   - Dynamic lighting with soft shadows and custom specular highlights.

4. **Procedural Web Audio Engine:**
   - Multi-track ambient soundplayer with chapter-specific resonant lowpass filter cutoff frequencies (`480Hz`, `850Hz`, `1700Hz`, `520Hz`, `1300Hz`, `2400Hz`, `15000Hz`).
   - Procedural impulse response reverb (`Wy`) and pink/brown noise atmospheric soundscape.
   - Sub-bass sine oscillator (41.2Hz) and 5.3Hz LFO atmospheric soundscape.
   - Sub-bass sine oscillator (41.2Hz) and 5.3Hz LFO aura tremolo.
   - Full interactive SFX suite: card hover, modal open/close, clicks, chapter titles, seams, and release bursts.

5. **Six Dynamic Chapters:**
   - **01 One person:** Staggered letter-by-letter reveal animation.
   - **02 Design as we know it is dead:** Dramatic pause and tonal transition.
   - **03 A new frame of mind:** Interactive floating disciplines.
   - **04 The work:** 3D interactive floating project cards for **P2P.org**, **Kelp DAO**, **RedStone**, and **LI.FI · Jumper**.
   - **05 Shipped:** Milestone statistics ($6B → $10B TVL, $990M → $2B TVL).
   - **06 What’s next:** 130+ clients, 40+ networks.

6. **Glassmorphic Project Media Modal:**
   - Autoplaying HTML5 videos and high-res imagery carousel.
   - Full thumbnail navigation strip, next/prev arrow buttons, and keyboard controls (`Escape`, `ArrowLeft`, `ArrowRight`).

7. **Interactive UI Overlays:**
   - Smooth desktop custom pointer with spring-interpolated trailing ring.
   - Left chapter progress rail with SVG fill meter.
   - Fullscreen slide-out chapter index menu.
   - Sound toggle button with persistent state.
   - Floating Awwwards Nominee badge.
   - Responsive footer with "Begin again ↑" smooth rewind.

8. **Complete Visual & 3D Shaders Pipeline:**
   - **Chapter 00 Sanctuary:** 8 procedurally carved basalt monoliths in an orbiting ring with floating basalt shards and crystal egg encasing the humanoid figure.
   - **Chapter 01 Monolith Terrain:** Cracked stone terrain with 420 procedural rubble rocks.
   - **Chapter 02 Volcanic Plain:** Volcanic lava plain with 14 basalt columns and 3D floating discipline tags with leader lines.
   - **Chapter 03 Ember Grassland:** 22,000 blades of glowing ember-tipped grass, 1,100 swirling ember particles, 1,200 floating dust motes, and 4 curved interactive 3D project cards.
   - **Chapter 04 Dunes & Golden Gate:** 460x460 desert dunes with glittering quartz highlights and the golden gate portal.
   - **Chapter 05 Cybernetic Core:** 300 descending fiber optic cables and 70 arched suspension cables with traveling light pulses and LED matrix displays.
   - **Custom Post-Processing:** Liquid lens distortion, chromatic aberration, volumetric fog, bokeh depth-of-field, and bloom.
   - **Complete Verification:** Verified end-to-end with Chrome DevTools Protocol across all chapters, audio toggles, work modal, and footer.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run the Development Server
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to experience the website.

### 3. Production Build
```bash
pnpm run build
pnpm run start
```
