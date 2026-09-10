# ELVER — Frontend Technical Architecture, Features & Team Reference Guide

## 1. Executive Summary & Product Vision

**ELVER** is a specialized, web-based marine intelligence platform designed for **AI-assisted side-scan sonar image analysis**. 

### Primary Goal
To streamline underwater sonar analysis by combining computer vision anomaly detection with an **operator-first, human-in-the-loop verification workflow**.

### Core Workflow Sequence
$$\text{Upload Sonar Imagery} \longrightarrow \text{AI Anomaly Detection} \longrightarrow \text{Interactive Waterfall Review} \longrightarrow \text{Operator Verification (Confirm/Reject)} \longrightarrow \text{Geospatial Mapping} \longrightarrow \text{IHO Compliance Report Export}$$

---

## 2. Technology Stack & Key Libraries

| Layer | Technology | Purpose / Rationale |
| :--- | :--- | :--- |
| **Framework** | **React 18 (TypeScript)** | Strongly-typed UI component library for component reusability and bug prevention. |
| **Build System** | **Vite 5.4** | Lightning-fast HMR (Hot Module Replacement) and optimized production bundler. |
| **Routing** | **React Router DOM v6** | Client-side routing with nested layouts (`AppShell`) and dynamic workspace params (`/surveys/:id`). |
| **Styling** | **Tailwind CSS v3** | Custom design tokens (Light Sand, Marine/Sky Blue, Soft Pastel Green, Espresso Text). |
| **Class Utilities** | `clsx` + `tailwind-merge` | Safe conditional class merging for active tabs, badges, and button states. |
| **Geospatial Mapping** | **Leaflet & React-Leaflet** | Lightweight, high-performance map canvas with custom SVG markers and popups. |
| **Icons** | **Lucide React** | Consistent, technical hydrographic icon set (`Radar`, `Compass`, `Crosshair`, `Ruler`, etc.). |

---

## 3. UI/UX & Design Aesthetics

### Color Palette & Design System
* **Workspace Background (`#F7F2E8` / `bg-sand-100`)**: Warm Light Sand tone reducing glare compared to pure white.
* **Canvas Viewport (`#141009` / `bg-sand-900`)**: Dark contrast background optimized for displaying acoustic sonar waterfall images.
* **Accent & Actions (`#0284C7` / `sky-600`)**: Professional marine blue for navigation, active selections, and secondary actions.
* **Status Indicators**:
  * 🟢 **Soft Pastel Green (`emerald-600`)**: Human-Confirmed Target / Validated.
  * 🟡 **Amber (`amber-500`)**: Pending Review / Operator Action Required.
  * 🔴 **Rose (`rose-600`)**: Human-Rejected Target (false positive / natural acoustic shadow).

### Typography
* **UI Interface**: `Inter` for clean legibility across dashboards and inspector panels.
* **Telemetry & Coordinates**: `JetBrains Mono` for sonar frequencies, WGS-84 coordinates, slant-range calculations, and target IDs.

---

## 4. Application Architecture & Service Layer

```
src/
├── types/
│   └── index.ts               # Core data models (Survey, SonarImage, Detection, BoundingBox, Location)
├── services/
│   └── surveyService.ts       # Decoupled API abstraction service layer (Async Promises)
├── mocks/
│   ├── mockData.ts            # Realistic hydrographic seed datasets (ghost nets, shipwrecks, debris)
│   └── sampleImages.ts        # Dynamic SVG sonar image generator for realistic canvas testing
├── components/
│   ├── layout/                # Navigation & AppShell layout framing
│   ├── common/                # Shared badges (Confidence, Priority, Status) & Feedback states
│   ├── workspace/             # SonarViewer canvas, DetectionList, DetectionDetails inspector
│   ├── map/                   # Leaflet MapView component with custom markers
│   ├── reports/               # Audit ReportTable with CSV/JSON/GeoJSON exporters
│   └── upload/                # Drag-and-Drop file ingestion dropzone
└── pages/
    ├── Dashboard.tsx          # High-level metrics, active transects table, needs-review queue
    ├── SurveyList.tsx         # Full survey catalog with search, status filters, and creation links
    ├── NewSurvey.tsx          # Upload pipeline, transducer configuration, and AI simulation
    ├── AnalysisWorkspace.tsx  # 3-column main analysis workspace (List | Sonar/Map | Inspector)
    ├── Location.tsx           # Full-screen geospatial anomaly map with GeoJSON exporter
    └── Reports.tsx            # IHO S-44 compliance logbook and regulatory report generator
```

### Key Architectural Choice: Decoupled API Abstraction
The frontend communicates exclusively with `surveyService.ts`. All methods (`getSurveys`, `uploadImage`, `analyzeImage`, `updateDetectionStatus`) return async `Promise` objects.

> **Team Advantage**: When backend FastAPI endpoints (`/api/surveys`, `/api/images/...`) are ready, **zero React component UI code needs to be modified**. Only the internal implementation of `surveyService.ts` changes from local memory to `fetch`/`axios` calls.

---

## 5. Detailed Feature Breakdown

### 1. Dashboard Overview (`Dashboard.tsx`)
* **Instrument Metrics Strip**: Displays live counts for Active Surveys, Targets Mapped, Pending Reviews, and Operator-Confirmed Targets.
* **Recent Hydrographic Transects Table**: Displays survey runs with date, ping/tile count, target count, review status, and direct "Open Workspace" routing.
* **Active Swath Waterfall Card**: Visual simulation of an active side-scan sonar waterfall feed displaying nadir line, tow speed (3.8 kn), and frequency (455 kHz).
* **Needs-Review Triage Panel**: Highlights high-priority AI detections awaiting operator verification, complete with thumbnail crop preview and one-click workspace entry.

### 2. New Survey Ingestion & Upload (`NewSurvey.tsx` & `UploadDropzone.tsx`)
* **Metadata Intake**: Captures Survey Designation, Acquisition Date, Acoustic Transducer model (EdgeTech, Klein, Kongsberg), and Towfish Altitude.
* **Drag-and-Drop Dropzone**: File ingestion for high-resolution side-scan sonar image files (`.png`, `.jpg`, `.geotiff`), with upload progress bar and file validation.
* **Staged Telemetry Table**: Lists ready-to-analyze sonar strips with slant-range correction indicators and coordinate swaths.
* **AI Processing Simulator**: Animates multi-step model inference (contrast enhancement, reverberation filtering, candidate detection, priority scoring) before automatically opening the workspace.

### 3. Analysis Workspace (`AnalysisWorkspace.tsx`, `SonarViewer.tsx`, `DetectionDetails.tsx`)
The centerpiece screen of the application utilizing a responsive **3-Column Grid**:

1. **Left Column — Detection List (`DetectionList.tsx`)**:
   * Filterable by status (`All`, `Pending AI`, `Confirmed`, `Rejected`) and class name search.
   * Selection highlight synchronization with the center viewport and right inspector.

2. **Center Column — Sonar Viewport Canvas (`SonarViewer.tsx`)**:
   * **Port & Starboard Range Scale**: Vertical distance tick marks (-50m Port to +50m Starboard).
   * **Nadir Blind Zone Line**: Central overlay representing towfish path and acoustic nadir.
   * **Interactive AI Bounding Boxes**: Positioned via percentage-based coordinates (`det.bbox`) with precision corner reticles and hover class labels.
   * **Image Controls Bar**: Contrast gain slider, colormap inversion toggle (dark/light sonar palette), pan/caliper tool selectors, and zoom percentage controls (75% - 250%).
   * **Acoustic Waveform Strip**: Displays TVG (Time-Varying Gain) profile, frequency (410 kHz Chirp), ping rate (12 Hz), and swath width.

3. **Right Column — Target Inspector (`DetectionDetails.tsx`)**:
   * Displays AI confidence percentage badge and priority level.
   * **Geographic Coordinates**: Displays WGS-84 Latitude/Longitude or an explicit **"Location unavailable"** message when GPS metadata is absent (no invented coordinates).
   * **Estimated Physical Dimensions**: Object width/height measurements in meters.
   * **Human-in-the-Loop Actions**: Soft Pastel Green **Confirm Target** button and Rose **Reject Target** button.
   * **Operator Notes**: Editable textarea for adding hydrographic notes (saved in real time to the survey state).

### 4. Geospatial Anomaly Map (`Location.tsx` & `MapView.tsx`)
* **Interactive Leaflet Map**: Plotting georeferenced anomaly markers colored by priority level (Red = High, Amber = Medium, Green = Low).
* **Survey Filtering**: Filter map markers by specific survey run or verification status.
* **Target Dossier Side Panel**: Inspect clicked map pins without leaving the spatial view.
* **GeoJSON Exporter**: Generates standard GeoJSON feature collections for direct loading into ESRI ArcGIS or QGIS software.

### 5. Reports & IHO Compliance (`Reports.tsx` & `ReportTable.tsx`)
* **Logbook Register**: Displays survey runs with signed verification badges and SHA-256 immutability checksums.
* **Report Table**: Structured tabular view with inline search, filter pills, and coordinates.
* **Multi-Format Export**: Export options for **CSV**, **JSON**, and **GeoJSON** files.

---

## 6. Team FAQ & Cross-Questioning Guide

### Q1: "Why don't we show AI confidence as 100% certainty?"
> **Answer**: In hydrographic and maritime survey operations, AI models assist operators but cannot legally replace human sign-off. Presenting confidence as a probability (e.g., 89% AI Certainty) reinforces the **Human-in-the-Loop** model. The operator must review acoustic shadow geometry and explicitly click **Confirm** or **Reject**.

### Q2: "What happens if a sonar image has no GPS header metadata?"
> **Answer**: ELVER explicitly displays **"Location unavailable"** in yellow with an alert icon. Per product requirements, **we never invent or fake coordinates** if telemetry is missing, as bad coordinates in marine charts create navigation hazards.

### Q3: "How does the frontend handle connecting to our upcoming backend?"
> **Answer**: The frontend is built on a clean service boundary (`surveyService.ts`). All component pages consume data via async promises. Connecting to FastAPI will involve swapping mock functions with standard HTTP requests without touching any UI component layouts.

### Q4: "Why did we choose Tailwind CSS with a custom Sand/Marine color system instead of default dark mode or bootstrap?"
> **Answer**: Maritime survey operators often work in environments with varying ambient light (dark sonar control booths vs bright bridge rooms). The warm **Light Sand theme (`#F7F2E8`)** reduces glare, while keeping the main **Sonar Canvas viewport dark (`#141009`)**, maximizing acoustic image contrast where it matters most.

### Q5: "How are bounding boxes rendered accurately on different screen sizes?"
> **Answer**: Bounding box metrics are stored as percentage offsets (`x`, `y`, `width`, `height` relative to the image dimensions). This ensures boxes scale fluidly whether viewed on a high-res laptop monitor, tablet, or external sonar bridge display.

---

## 7. Summary of Deliverables & Verification

| Requirement | Implementation Status | Verified Component |
| :--- | :--- | :--- |
| **Survey Creation & Upload** | ✅ Implemented | [`NewSurvey.tsx`](file:///c:/Users/rsark/OneDrive/Desktop/Elever/src/pages/NewSurvey.tsx), [`UploadDropzone.tsx`](file:///c:/Users/rsark/OneDrive/Desktop/Elever/src/components/upload/UploadDropzone.tsx) |
| **AI Sonar Viewer & Bounding Boxes** | ✅ Implemented | [`SonarViewer.tsx`](file:///c:/Users/rsark/OneDrive/Desktop/Elever/src/components/workspace/SonarViewer.tsx) |
| **Human Review (Confirm / Reject)** | ✅ Implemented | [`DetectionDetails.tsx`](file:///c:/Users/rsark/OneDrive/Desktop/Elever/src/components/workspace/DetectionDetails.tsx) |
| **Geospatial Map View** | ✅ Implemented | [`MapView.tsx`](file:///c:/Users/rsark/OneDrive/Desktop/Elever/src/components/map/MapView.tsx), [`Location.tsx`](file:///c:/Users/rsark/OneDrive/Desktop/Elever/src/pages/Location.tsx) |
| **CSV / JSON / GeoJSON Export** | ✅ Implemented | [`ReportTable.tsx`](file:///c:/Users/rsark/OneDrive/Desktop/Elever/src/components/reports/ReportTable.tsx) |
| **API Contract Decoupling** | ✅ Implemented | [`surveyService.ts`](file:///c:/Users/rsark/OneDrive/Desktop/Elever/src/services/surveyService.ts) |
