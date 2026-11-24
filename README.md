# SmartPark LPU – Where Did I Park?
**Course:** INT335 Design Thinking  
**Problem Statement:** P07 – Where Did I Park?  
**Prototype Name:** SmartPark LPU  
**Author / Team:** Student Prototype for Lovely Professional University  

---

## 📌 Project Overview
In a large university campus like Lovely Professional University (LPU), students, faculty, and visitors frequently lose track of where they parked their two-wheeler or four-wheeler among hundreds of vehicles across expansive parking zones.

**SmartPark LPU** is a lightweight, responsive, and intuitive web solution developed following the **Design Thinking** methodology:
- **Empathize & Define:** Students face frustration, wasted time, and anxiety attempting to locate vehicles after long classes or mall visits.
- **Ideate & Prototype:** A low-friction, non-GPS-reliant, zero-login system where students select their destination, pick an available zone and parking row, save it to persistent local storage with 1 click, and retrieve clear walking guidance later.
- **Test:** Functional prototype testing simulated zone capacities, slot allocations, and instant vehicle retrieval.

---

## 🎨 Design System
- **Color Palette:**
  - **Dark Green (`#0a2318`, `#12372a`):** Primary headers, accents, campus brand identity.
  - **Light/Mint Green (`#10b981`, `#ecfdf5`, `#34d399`):** Interactive selections, available spots, and CTAs.
  - **Clean White (`#ffffff`, `#f8fafc`):** Surface cards, high-contrast readable typography.
  - **Status Accents:** Emerald Green (Available), Amber (Nearly Full), Rose Red (Full).
- **Icons & Cards:** Scalable vector graphics (SVG) for parking badges, cars, pins, walking icons, and time indicators.
- **Responsive Layout:** Optimized with CSS Flexbox & CSS Grid for smartphones, tablets, laptops, and desktop monitors.

---

## 🚀 Key Features

### 1. Home Page (`index.html`)
- **Title & Tagline:** "SmartPark LPU – Park Smarter. Find Your Vehicle Faster."
- **Destination Selector:** Dynamic dropdown featuring:
  - Academic Block (Blocks 34–38)
  - Central Library
  - University Mall (UniMall)
- **Demo Parking Zones:**
  - **Zone A – FULL (0 spots available):** Highlighted in red with disabled state.
  - **Zone B – AVAILABLE (24 spots available):** Selectable with green border highlight.
  - **Zone C – NEARLY FULL (3 spots available):** Selectable with amber warning badge.
- **Dynamic Walking Times:** Walking times dynamically calculate and update across all zones based on the selected campus destination.
- **Interactive Parking Row Selector:**
  - When an available zone (e.g. Zone B or Zone C) is selected, a parking bay grid opens with selectable rows (e.g., `B-01`, `B-04`, `B-07`, `B-10` or `C-01`, `C-02`, `C-03`).
  - Occupied slots are clearly disabled and marked.
- **Save Details Flow:**
  - Prominent **"Save Details"** button.
  - Stores destination, zone, row number, timestamp, and optional vehicle details into `localStorage`.
  - Displays instant toast alert: *"Location saved successfully!"*
  - Automatically redirects smoothly to `saved.html`.
- **Revisit Detection Banner:** If a user returns to the home page with an existing parked spot, an active vehicle banner appears with 1-click access to "Find Vehicle" or "Clear".

### 2. Saved Location Confirmation Page (`saved.html`)
- Displays success checkmark and confirmation message.
- Issues a **Digital Smart Parking Pass** showing:
  - Destination name
  - Parking zone
  - Row number
  - Timestamp of parking
  - Estimated walking distance and route hint
- Direct navigation options:
  - **"Find My Vehicle Now"** (navigates to `find.html`)
  - **"Back to Home"**
  - **"Update Location"**

### 3. Find My Vehicle Page (`find.html`)
- Automatically recalls saved parking details from `localStorage`.
- Prominently showcases:
  - Header: *"You parked in this location!"*
  - Large display of Destination, Parking Zone, and Row Number.
  - Walking time calculation.
- **Visual Campus Wayfinder Schematic:**
  - Graphical node-to-node route diagram illustrating the path from the selected building to the parked vehicle slot.
  - Step-by-step turn guidance instructions.
- **Session Controls:**
  - **"Update / Change Location"** button.
  - **"I Left Parking / Clear Spot"** button.
  - **"Back to Home"** button.
- Graceful empty state with guidance if visited without any saved spot.

---

## 🛠️ Technology Stack
- **HTML5:** Semantic, accessible markup.
- **CSS3:** Custom properties (CSS variables), CSS Grid, Flexbox, keyframe animations, responsive media queries. Zero external CSS frameworks required.
- **Vanilla JavaScript (ES6+):** Pure client-side logic using `localStorage`, dynamic DOM manipulation, and URL parameter handling. No external JS libraries or node dependencies needed.

---

## 💻 How to View & Run Locally

### Option 1: Double-click to open in any web browser
Simply double-click `index.html` or open it directly in Chrome, Safari, Edge, or Firefox.

### Option 2: Run with Python local server
Run this in the terminal:
```bash
python3 -m http.server 8080
```
Then visit [http://localhost:8080](http://localhost:8080).

---

## 🚀 How to Deploy on Vercel

This is a pure static web app (HTML5, CSS3, ES6 JavaScript) with zero build steps or external dependencies. It deploys to Vercel in under 1 minute:

### Option A: Via GitHub (Recommended)
1. Initialize git and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for SmartPark LPU"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/smartpark-lpu.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your `smartpark-lpu` repository.
4. Framework Preset: Select **"Other"** (or keep default). Root directory: `./`.
5. Click **"Deploy"**!

### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## ⚠️ Academic Disclaimer
Parking availability counts and walking times are simulated sample data for academic demonstration. This project is a student prototype developed for **INT335 Design Thinking (Problem Statement P07: Where Did I Park?)** and is not connected to Lovely Professional University's live parking infrastructure. No real GPS tracking or live sensor feeds are required.
