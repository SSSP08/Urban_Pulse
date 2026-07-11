# UrbanPulse AI
### AI-Powered Smart Traffic & Parking Management System

---

## 1. Project Overview
**UrbanPulse AI** is a state-of-the-art interactive smart cities telemetry simulation dashboard designed for high-density municipal corridors. In metropolitan hubs like Hyderabad, India, drivers face daily bottlenecks resulting from inefficient parking management, cascading traffic signal delays, and lack of real-time multi-modal traffic data coordination.

UrbanPulse AI solves this problem by coordinating traffic signals, parking lot availability, and active route congestion under one unified system. Utilizing the **Google Gemini API**, it provides adaptive parking suggestions and corridor delay explanations, demonstrating how cities can reduce emissions, save commute hours, and prioritize emergency responders (e.g. 108 corridor preemption waves) through intelligent, connected municipal infrastructure.

---

## 2. Key Features

- **Smart Parking Management**: Custom cluster markers render local parking areas. Tapping a location displays covered parking options, spot capacity, EV charging metrics, and rates in a sleek side drawer.
- **Live Parking Availability**: Automatic simulated changes dynamically fluctuate parking spot numbers on the fly, representing live parking check-in/out telemetry.
- **Traffic Congestion Visualization**: Hyderabad municipal corridors are overlaid with high-performance polylines color-coded by congestion level (LOW, MEDIUM, HIGH).
- **Dynamic Traffic Signal Simulation**: Traffic signals at critical junctions (e.g. Cyber Towers, Gachibowli Circle) adaptively rotate timing phases stochastically depending on local congestion thresholds.
- **AI-Powered Parking Recommendations**: Integrates **Google Gemini API** (`gemini-3.5-flash`) client-side to calculate current space availability, travel time, and congestion to generate optimal parking selections with confidence ratings.
- **Interactive Route Recommendation**: Selecting any parking location dynamically generates a grid-like street path complete with glow styling and a midpoint HUD display showing estimated travel time (ETA) and traffic state.
- **Emergency Vehicle Priority Mode (108 Mode)**: Activating 108 Emergency Mode overrides the local network to lock traffic signals to continuous green priority waves, draw a flashing red priority corridor route, and call Gemini to output a mathematical optimization summary justifying the route safety.
- **Live Background Simulation**: Isolated asynchronous loops run on independent cadences to simulate realistic urban patterns without blocking map user interactions.
- **Responsive Modern UI**: Dark glassmorphic HUD overlays adjust automatically across mobile, tablet, and widescreen layouts.

---

## 3. Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide icons, Framer Motion
- **Interactive Maps**: Leaflet, React Leaflet, OpenStreetMap (CartoDB Dark Matter / Voyager styles)
- **State Management**: Zustand
- **AI Integration**: Google Gen AI SDK (`@google/genai`)

---

## 4. System Architecture

- **UI Layer**: Displays search filters, drawers, and overlay cards. Uses glassmorphic styles matching municipal control centers.
- **Map Layer**: Renders tile layers and layers for corridors, intersections, search bounds, and active GPS routes.
- **Parking & Traffic Modules**: Houses spatial coordinates (polylines/points) and simulations for parking spots and road speeds.
- **Emergency Module**: Modifies app state to establish green-wave signals and flash emergency corridors.
- **AI Recommendation Engine**: Packages data snapshots into structured prompt grids and handles API communication/JSON parsing.
- **State Management**: Zustand coordinates selected pins, active cities, and layout states cleanly.

---

## 5. Project Structure

```
├── public/                 # Static assets and site icons
├── src/
│   ├── app/                # Next.js App router routes and layout
│   │   └── api/            # API endpoints
│   ├── components/         # Reusable React components
│   │   ├── ai/             # AI recommendation card HUD panel
│   │   ├── common/         # Leaflet wrapper and theme provider
│   │   ├── emergency/      # Emergency Status alert HUD overlay
│   │   ├── map/            # Leaflet layers (Traffic, Parking, Signals, Routes)
│   │   ├── parking/        # Filters and side drawer panel
│   │   └── shell/          # Search HUD and sidebar container components
│   ├── data/               # Spatial coordinates and initial datasets
│   ├── lib/                # Route generators, simulation logic, and AI services
│   ├── store/              # Zustand global state slices
│   └── types/              # TypeScript interface definitions
├── tsconfig.json           # TypeScript configuration
└── tailwind.config.ts      # Tailwind styling rules
```

---

## 6. Installation Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [NPM](https://www.npmjs.com/) or another package manager

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/urbanpulse-ai.git
   cd urbanpulse-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory (see [Environment Variables](#7-environment-variables) below).

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 7. Environment Variables

Create a file named `.env.local` in the root of the project and add your Gemini API key:

```env
# Google Gemini API configuration
NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy...your_gemini_api_key...
```

*Note: The `NEXT_PUBLIC_` prefix is required to make the key accessible client-side in Next.js.*

---

## 8. How It Works

```
[Search Destination]
        ↓
[View Traffic Congestion]
        ↓
[Click Parking Marker] ────→ [AI Recommends Best Parking Option]
        ↓                                 ↓
[Generate Live Route] 🔀 [Draw Priority corridor & pre-empt signals (108 Mode)]
```

1. **Search**: Search for smart parking yards via the navigation search bar.
2. **View Congestion**: Road segments display live speeds via color codes.
3. **AI Recommendation**: Gemini identifies the most convenient parking space with high availability, low pricing, and low approach traffic.
4. **Interactive Routing**: A custom polyline highlights the route, showing the ETA.
5. **Emergency Override**: Activating Emergency Mode preempts signals to green, displays an optimal AI safety route explanation, and triggers pulsing visual warning sirens.

---

## 9. Screenshots

### 1. Smart Cities Control Console
*Control console HUD with live Hyderabad map, traffic lines, and signal countdowns.*

### 2. Live Route Navigation
*Dynamic color-coded route drawing and ETA popups.*

### 3. Automated 108 Preemption Corridors
*Flashing emergency wave routes, green-wave signal locks, and AI mathematical corridor explanations.*

---

## 10. Future Scope

- **IoT Sensor Integration**: Connect real physical geomagnetic sensors to represent actual live parking space status.
- **Municipal API Sourcing**: Feed official city traffic feeds directly to map layers.
- **CCTV Video Analytics**: Use edge computing visual models at traffic intersections to dynamically calculate density and adjust signals.
- **EV Smart Charger Reservations**: Let users reserve EV charging points directly through the recommendation panel.
- **Predictive ML Analytics**: Forecast grid traffic patterns 30 minutes in advance.

---

## 11. Contributors
- *Contributor Name Placeholder 1*
- *Contributor Name Placeholder 2*

---

## 12. License
This project is licensed under the [MIT License](LICENSE) — see the LICENSE file for details.
