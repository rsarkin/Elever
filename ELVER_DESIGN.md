# ELVER --- Design System & UX Specification

## 1. Design Direction

ELVER should feel like:

> **Marine intelligence / sonar command center**

Not: - generic SaaS dashboard, - crypto dashboard, - gaming UI, - overly
futuristic sci-fi interface.

Visual character: - dark oceanic base, - high-contrast sonar imagery, -
restrained cyan/teal accents, - warning colors only for status, - clean
technical typography, - generous spacing, - minimal glass effects.

------------------------------------------------------------------------

## 2. UX Principle

The user should always understand:

**Where am I? → What did ELVER find? → How confident is it? → What
should I do next?**

------------------------------------------------------------------------

## 3. Core Navigation

``` text
ELVER
├── Overview
├── Surveys
├── Analysis
├── Detections
└── Reports
```

Keep navigation small.

------------------------------------------------------------------------

## 4. Main Dashboard

### Header

-   ELVER logo/name
-   current survey
-   New Survey button

### KPI cards

-   Surveys analyzed
-   Total detections
-   High-risk targets
-   Pending verification

### Recent surveys

Columns: - Survey - Date - Images - Detections - Status

Primary CTA: **Start New Survey**

------------------------------------------------------------------------

## 5. Upload Screen

Large drag-and-drop zone.

Copy:

> **Drop side-scan sonar imagery here**

Supporting text:

> PNG, JPG, JPEG supported for MVP.

Secondary: **Browse files**

Show: - filename, - file size, - image dimensions, - remove button.

Primary: **Analyze Survey**

------------------------------------------------------------------------

## 6. Analysis Screen --- Most Important Screen

Layout:

``` text
┌──────────────────────────────────────────────────────┐
│ Survey name                         12 detections     │
├────────────────────────────────────┬─────────────────┤
│                                    │ Detection #04   │
│                                    │                 │
│          SONAR VIEW                │ Ghost Gear      │
│                                    │ 91% confidence  │
│       [boxes / masks]              │ HIGH RISK       │
│                                    │                 │
│                                    │ Location        │
│                                    │ 18.52, 73.85    │
│                                    │                 │
│                                    │ [Confirm]       │
│                                    │ [Reject]        │
└────────────────────────────────────┴─────────────────┘
```

### Sonar canvas

Must support: - zoom, - pan, - fit-to-view, - detection highlight, -
selected detection state.

### Detection overlay

Each detection: - box/mask, - label, - confidence, - selected/unselected
state.

Do not put huge labels over the sonar image.

------------------------------------------------------------------------

## 7. Detection Detail

Display:

**Object** Ghost Gear

**Confidence** 91%

**Risk** HIGH

**Estimated dimensions** 2.4 m × 0.8 m

**Location** Latitude / Longitude when available.

**Status** Unverified / Confirmed / Rejected

Actions: - Confirm - Reject - Export

------------------------------------------------------------------------

## 8. Map

Use Leaflet with a configurable tile provider.

Requirements: - marker for detections, - selected marker, - risk-aware
marker styling, - popup with detection details, - fit map to detections.

Always show map attribution.

Do not depend on public OSM services for heavy production traffic.

------------------------------------------------------------------------

## 9. Reports Screen

Table:

  ID   Object     Confidence Risk   Location   Status
  ---- -------- ------------ ------ ---------- --------

Filters: - risk, - object, - verification status.

Actions: - Export CSV - Export JSON - Generate report

------------------------------------------------------------------------

## 10. Status System

Use three levels:

**HIGH** - urgent attention - strong model confidence or configured
high-priority object

**MEDIUM** - review recommended

**LOW** - low-priority candidate

Do not use color as the only indicator; include text/icons.

------------------------------------------------------------------------

## 11. Empty States

Example:

> **No detections yet**
>
> Upload a sonar image and run an analysis to see potential underwater
> anomalies.

------------------------------------------------------------------------

## 12. Loading State

Use an analysis progress state:

``` text
Preparing sonar image
      ↓
Enhancing image
      ↓
Running detection
      ↓
Scoring results
      ↓
Preparing report
```

Do not fake a precise percentage unless the backend provides actual
progress.

------------------------------------------------------------------------

## 13. Responsive Design

Desktop-first because sonar analysis benefits from a large canvas.

Minimum: - desktop 1280px+ - tablet usable - mobile view can be
simplified

The core analysis screen should not become unusable on smaller screens.

------------------------------------------------------------------------

## 14. Accessibility

-   keyboard navigable controls,
-   readable contrast,
-   visible focus states,
-   text labels for risk,
-   no color-only meaning,
-   alt text for non-decorative images,
-   clear error messages.

------------------------------------------------------------------------

## 15. Design Tokens

Suggested starting values:

``` text
Background: near-black navy
Surface: dark blue-gray
Primary: restrained cyan/teal
Text: off-white
Muted text: cool gray
High risk: red
Medium risk: amber
Low risk: green
```

Use one primary accent. Avoid rainbow dashboards.

------------------------------------------------------------------------

## 16. Brand

Name: **ELVER**

Possible descriptor: **Marine Intelligence**

Suggested product lockup:

> ELVER\
> Marine Intelligence

Avoid over-explaining the name in the UI.
