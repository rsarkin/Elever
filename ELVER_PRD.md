# ELVER --- Product Requirements Document (PRD)

**Project:** ELVER\
**SIH Problem:** SIH26057 --- AI-Powered Automated Underwater Marine
Debris and Anomaly Detection System using Side-Scan Sonar Imagery\
**Document:** MVP Product Requirements\
**Status:** Ready for implementation\
**Primary MVP user:** Marine survey operator / port or maritime survey
team

------------------------------------------------------------------------

## 1. Product Vision

ELVER turns side-scan sonar imagery into actionable underwater-anomaly
information.

**Core loop:**

> Upload → Analyze → Detect → Review → Locate → Report

ELVER is not intended to replace a marine surveyor. It is an AI co-pilot
that screens sonar imagery, highlights potential man-made underwater
objects, gives confidence/risk information, and prepares structured
reports for human verification.

------------------------------------------------------------------------

## 2. Problem

Manual inspection of large side-scan sonar surveys is slow, repetitive
and prone to missed targets. Natural seabed structures, acoustic shadows
and sonar noise can resemble artificial objects.

SIH26057 expects a system that can: - detect/segment man-made underwater
objects, - reduce false positives, - provide confidence scores, - geotag
detections, - generate structured reports, - provide a usable dashboard.

------------------------------------------------------------------------

## 3. MVP Goal

Build one reliable end-to-end workflow rather than many incomplete
features.

### MVP user journey

1.  User opens ELVER.
2.  User creates a survey.
3.  User uploads a supported sonar image.
4.  ELVER preprocesses the image.
5.  AI detects candidate objects/anomalies.
6.  Results appear as boxes/masks over the sonar image.
7.  User selects a detection.
8.  ELVER shows class, confidence, risk and estimated size.
9.  User confirms or rejects the detection.
10. If coordinates are available, ELVER shows the location on a map.
11. User exports a CSV/JSON report.

------------------------------------------------------------------------

## 4. MVP Features

### P0 --- Must work

-   Sonar image upload
-   Image preview
-   AI inference
-   Bounding boxes for object detections
-   Class label
-   Confidence score
-   Risk score: Low / Medium / High
-   Detection list
-   Detection detail panel
-   Human verification: Confirm / Reject
-   Map view when coordinates exist
-   CSV/JSON export
-   Survey history
-   Basic statistics: total detections and risk counts

### P1 --- Useful if time allows

-   Multiple image upload
-   Batch inference
-   Image zoom/pan
-   Confidence threshold slider
-   Detection filtering
-   Before/after preprocessing view
-   PDF-style report
-   Detection status: Unverified / Confirmed / Rejected

### P2 --- Roadmap, not MVP

-   Fisherman reporting
-   Port-specific workspaces
-   Live sonar streaming
-   XTF/JSF parsing
-   AUV integration
-   Edge deployment
-   Offline-first operation
-   Recovery-team assignment
-   Long-term marine hazard database
-   Continuous model retraining

------------------------------------------------------------------------

## 5. Initial Detection Scope

Do not promise every type of marine debris.

The first model should use classes supported by the final audited
dataset.

Preferred initial scope:

1.  Ghost / derelict fishing gear where sufficient labelled data exists
2.  Man-made underwater object / debris
3.  Shipwreck or large artificial object if the dataset supports it
4.  Other anomaly

**Important:** final classes must be locked only after dataset auditing.
If a class has too few reliable examples, merge it into a broader class
or leave it for Phase 2.

Natural rocks, seabed structures and empty seabed should be used heavily
as background/hard-negative examples even if they are not displayed as
positive classes.

------------------------------------------------------------------------

## 6. Non-Goals

The MVP will NOT: - claim perfect ghost-net detection, - claim
real-world geolocation when GPS/sonar metadata is unavailable, -
automatically dispatch cleanup teams, - replace expert marine
interpretation, - require paid cloud AI APIs, - require a live AUV, -
build a native mobile app, - build a full GIS platform.

------------------------------------------------------------------------

## 7. Users

### Primary

Marine survey operator / analyst.

### Secondary

Ports, marine survey companies, environmental agencies and conservation
organizations.

### Ecosystem / future

Fishermen can contribute field reports such as lost gear or observed
hazards. Ports can supply sonar surveys and use the results for
underwater hazard screening. These are ecosystem roles, not separate MVP
applications.

------------------------------------------------------------------------

## 8. Success Criteria

A successful MVP should allow a judge to complete the following in under
2 minutes:

**Upload sonar → run detection → inspect a target → see confidence/risk
→ verify it → view location → export report.**

Technical success: - Real trained inference path exists. - Model results
are not hard-coded. - Test images are separated from training data. -
False positives are visibly considered. - Coordinates are labelled as
actual or estimated. - Reports contain traceable detection IDs.

Product success: - User understands what to do without explanation. -
The analysis screen is the visual centerpiece. - UI feels like a
professional marine-survey tool rather than a generic CRUD dashboard.

------------------------------------------------------------------------

## 9. Future Ecosystem

ELVER can grow into:

**Sonar survey → AI screening → human verification → hazard database →
port/authority action → cleanup/recovery → field feedback → better
training data.**

Fishermen: - report lost gear/hazards, - provide field observations, -
benefit from verified hazard information.

Ports/survey companies: - upload survey data, - review targets, -
generate survey reports, - build historical hazard records.

Conservation/cleanup: - consume verified locations, - prioritize
recovery operations, - mark recovered objects.

------------------------------------------------------------------------

## 10. Pitch Positioning

Recommended one-line description:

> **ELVER is an AI co-pilot for side-scan sonar surveys that detects
> potential underwater hazards, scores and geolocates them, and converts
> sonar data into actionable reports.**

Avoid saying: \> "ELVER automatically detects all marine debris."

Prefer: \> "ELVER automatically screens sonar surveys for potential
man-made underwater anomalies and keeps a human expert in the loop."

------------------------------------------------------------------------

## 11. MVP Acceptance Checklist

-   [ ] Upload works
-   [ ] Supported image formats are documented
-   [ ] Model loads successfully
-   [ ] Inference runs on real model weights
-   [ ] Detections are rendered over the original image
-   [ ] Confidence is shown
-   [ ] Risk calculation is deterministic and documented
-   [ ] User can confirm/reject
-   [ ] Location is shown only when supported by metadata
-   [ ] CSV/JSON export works
-   [ ] Survey can be revisited
-   [ ] Demo dataset is stored separately from production code
-   [ ] README explains setup and limitations
