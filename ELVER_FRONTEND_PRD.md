# ELVER — Frontend PRD

## Goal
Build a minimal professional web dashboard for ELVER, an AI-assisted underwater sonar analysis platform.

Core flow:

**Upload → Analyze → Detect → Review → Locate → Report**

## Primary User
Marine survey operator / sonar analyst.

The user must be able to:
1. Create a survey
2. Upload sonar imagery
3. Run analysis
4. View AI detections
5. Inspect a detection
6. Confirm or reject it
7. View location when available
8. Export a report

## MVP Screens

### 1. Dashboard
Show:
- Total surveys
- Images analyzed
- Total detections
- Confirmed detections
- High-priority detections
- Recent surveys
- Recent/high-priority detections

Keep it simple. Avoid unnecessary charts.

### 2. New Survey / Upload
Show:
- Survey name
- Optional date/source
- Drag-and-drop upload
- Selected files
- Upload progress
- Analyze button

States:
- Empty
- Uploading
- Ready
- Error
- Analyzing

### 3. Analysis — MAIN SCREEN
Show:
- Large sonar image
- Detection bounding boxes
- Detection list
- Selected detection details

Selected detection:
- Object class
- Confidence
- Priority
- Status
- Dimensions if available
- Latitude/longitude if available
- Notes
- Confirm
- Reject

Status:
- AI Detected
- Confirmed
- Rejected

Important: AI confidence must not be presented as certainty.

### 4. Map
Show confirmed detections when valid coordinates exist.

Marker details:
- Object class
- Priority
- Confidence
- Status

If coordinates are unavailable:
**Location unavailable**

Never invent coordinates.

### 5. Reports
Show:
- Survey summary
- Detection count
- Confirmed/rejected counts
- Detection table
- Export CSV
- Export JSON

## Navigation
Keep it minimal:

**Dashboard | Surveys | Reports**

A survey opens its Analysis view.

## Reusable Components
- AppShell
- Navigation
- StatCard
- UploadDropzone
- SurveyCard
- SonarViewer
- DetectionBox
- DetectionList
- DetectionDetails
- ConfidenceBadge
- PriorityBadge
- StatusBadge
- ReviewActions
- MetadataPanel
- MapView
- ReportTable
- EmptyState
- LoadingState
- ErrorState
- Toast

## UX Principles
- Minimal: every element needs a purpose.
- Operator-first: important information is immediately visible.
- Sonar-first: the sonar image is the visual centerpiece.
- Human control: Confirm / Reject must be obvious.
- Trust: distinguish AI prediction from human-confirmed result.
- Fast: minimize unnecessary navigation and clicks.

## Required States
Every major feature needs:
- Loading
- Empty
- Success
- Error

Examples:
- No surveys
- No detections
- Analysis in progress
- Analysis failed
- Location unavailable
- No confirmed detections

## MVP Boundaries

Build:
- Image upload
- Survey creation
- AI result visualization
- Confidence
- Priority
- Human review
- Location display
- Basic map
- CSV/JSON export
- Survey history

Do not build yet:
- Live sonar streaming
- AUV control
- Fisherman mobile app
- Autonomous retraining
- Complex GIS
- Ocean credits
- Blockchain
- Full professional sonar-format parser
- Enterprise administration

## Development Rule
Build frontend with mock JSON first. Later replace the mock service with FastAPI without changing the UI architecture.

## Definition of Done
A user can:

**Create survey → Upload image → Analyze → View detections → Select detection → Confirm/Reject → View location → Export report**
