# 🌊 ELVER — Side-Scan Sonar AI & Geospatial Platform
### *Autonomous Seabed Anomaly & Ghost Fishing Gear Detection System*

[![Smart India Hackathon](https://img.shields.io/badge/Smart%20India%20Hackathon-SIH%202026-blueviolet?style=for-the-badge&logo=gov.in)](https://www.sih.gov.in/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=for-the-badge&logo=leaflet)](https://leafletjs.org/)
[![FastAPI Ready](https://img.shields.io/badge/FastAPI-Backend_Ready-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PyTorch YOLO](https://img.shields.io/badge/PyTorch-YOLOv8_v11-EE4C2C?style=for-the-badge&logo=pytorch)](https://pytorch.org/)

---

## 📌 Executive Summary (Smart India Hackathon — SIH)

**ELVER** is an end-to-end hydrographic AI and geospatial web platform developed for the **Smart India Hackathon (SIH)**. The platform solves a critical challenge in marine environment conservation and Blue Economy infrastructure: **detecting and mapping derelict fishing gear ("ghost nets", crab pots, submerged debris) from Side-Scan Sonar (SSS) acoustic data**.

By combining custom fine-tuned computer vision models (YOLOv8/v11 trained on side-scan sonar datasets) with an interactive **Human-in-the-Loop Operator Verification Dashboard**, ELVER enables hydrographic survey teams, port authorities, and ocean conservation NGOs to rapidly identify, triage, and export geolocated seabed anomaly reports.

---

## ✨ Key Features

* 📡 **Live Swath Waterfall Viewer**: Real-time side-scan sonar waterfall canvas displaying dual Port/Starboard channel acoustic backscatter, nadir telemetry (`Alt`, `Speed`), and automated target bounding boxes.
* 🗺️ **Geospatial Vector GIS Map**: Fully interactive OpenStreetMap GIS layer displaying geolocated target markers off the **Arabian Sea coastline (Alibaug & Mumbai Harbor)**. Supports instant pan/zoom, target selection, and responsive view expansion (`invalidateSize`).
* 🔍 **Human-in-the-Loop Triage Dossier**: Comprehensive verification panel allowing marine survey operators to validate or reject AI detections, inspect shadow height/width dimensional math, and modify priority classification.
* 📋 **Hydrographic Report & Export Engine**: Filter survey detections by risk status, export standardized **WGS-84 GeoJSON** spatial datasets for QGIS/ArcGIS, and generate vessel survey CSV reports.
* ⚡ **Decoupled FastAPI Service Architecture**: Built on an asynchronous service abstraction layer (`surveyService.ts`), allowing seamless plug-and-play connection to FastAPI backend endpoints without touching UI code.

---

## 🛠️ System Architecture

```
                               ┌─────────────────────────────────────────┐
                               │     Side-Scan Sonar (SSS) Towfish      │
                               │  Raw Acoustic Pings (455 / 900 kHz)    │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │   AI Inference Pipeline (YOLO PyTorch)  │
                               │  Ghost Net & Seabed Anomaly Detector    │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
                               ┌─────────────────────────────────────────┐
                               │     FastAPI REST API Service Layer      │
                               │  /api/surveys  /api/images/analyze      │
                               └────────────────────┬────────────────────┘
                                                    │
                                                    ▼
 ┌────────────────────────────────────────────────────────────────────────────────────────┐
 │                              ELVER React 18 Web Client                                 │
 ├────────────────────────────┬─────────────────────────────┬─────────────────────────────┤
 │   Swath Waterfall Feed     │  OpenStreetMap Vector GIS   │  Operator Verification GUI  │
 └────────────────────────────┴─────────────────────────────┴─────────────────────────────┘
```

---

## 💻 Tech Stack

| Layer | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18 + Vite** | High-performance component rendering & fast hot module replacement |
| **Language** | **TypeScript 5.5** | End-to-end type safety across survey models, detections, and API schemas |
| **Styling & UI** | **Vanilla CSS + Tailwind CSS** | Custom marine HUD theme, glassmorphism telemetry overlays, micro-animations |
| **Mapping Engine** | **Leaflet + OpenStreetMap** | Zero-cost open GIS mapping, custom divIcon sonar target pins, dynamic resize hook |
| **Icons & Visuals** | **Lucide React** | Sleek vector iconography |
| **Backend API (Contract)**| **FastAPI (Python)** | High-throughput REST API standard matching `ELVER_FRONTEND_API_CONTRACT.md` |
| **AI / CV Model** | **YOLOv8 / YOLOv11** | Fine-tuned on SSS datasets (*GhostVision / Crab Pot SSS Dataset*) |

---

## 🚀 Quick Start & Local Installation

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/rsarkin/Elever.git
cd Elever
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 🗺️ Geospatial & Location Data

The GIS module defaults to coastal survey areas in the **Arabian Sea**:
* **Alibaug Offshore Sector**: `18.641500° N, 72.812000° E` *(Derelict Net & Trap Candidates)*
* **Mandwa Channel**: `18.658000° N, 72.825000° E` *(Container Debris)*
* **Mumbai Harbor Entrance**: `18.915000° N, 72.805000° E` *(Sunken Vessel Anomaly)*

Exports generated from the map follow standard **GeoJSON (WGS-84)** format for direct import into QGIS, ArcGIS, or hydrographic survey suites (HYPACK, SonarWiz).

---

## 🏆 Smart India Hackathon (SIH) Impact & Vision

1. **Ocean Ecosystem Protection**: Ghost fishing gear continues to trap and kill marine life indefinitely. ELVER speeds up detection and clearance.
2. **Maritime Navigation Safety**: Submerged container structures and vessel wrecks pose hazards to coastal fishing vessels and harbor traffic.
3. **Blue Economy Empowerment**: Provides Indian survey firms, port trusts, and environmental agencies with a low-cost, open-source AI hydrographic dashboard.

---

## 📜 License

This project is created for **Smart India Hackathon (SIH)**. Distributed under the MIT License.
