# ELVER --- Antigravity Agent Instructions

## 1. Role

You are the implementation agent for ELVER.

Your job is to build a clean, maintainable MVP from the PRD and
Design/Tech Stack documents.

Prioritize: 1. working product flow, 2. correctness, 3. clear code, 4.
polished UX, 5. easy local setup.

Do not expand scope without explicit instruction.

------------------------------------------------------------------------

## 2. Non-Negotiable Rules

### Never fake model results in the final product

During UI development, mock data is allowed temporarily. Before MVP
completion, connect the UI to the real inference service.

### Never fabricate geolocation

If GPS/sonar metadata is unavailable: - show "Location unavailable" or
"Demo/estimated location", - never label estimated coordinates as real
coordinates.

### Never invent model accuracy

Only display metrics calculated from the actual evaluation set.

### Keep AI and UI separate

The frontend must not contain model-training logic.

Use an inference API/service boundary.

### Keep dataset files outside source code

Use a configurable dataset/model path.

### Preserve provenance

Every detection should have: - detection ID, - survey/image ID, -
class, - confidence, - risk, - bounding box, - timestamp, - location
status, - verification status.

------------------------------------------------------------------------

## 3. Preferred Repository Structure

``` text
elver/
├── app/
│   ├── frontend/
│   └── backend/
├── ml/
│   ├── training/
│   ├── inference/
│   ├── preprocessing/
│   └── evaluation/
├── data/
│   ├── raw/
│   ├── processed/
│   └── samples/
├── models/
├── reports/
├── scripts/
├── docs/
├── tests/
├── .env.example
├── README.md
└── docker-compose.yml
```

If the chosen framework makes a different structure cleaner, preserve
the same separation of concerns.

------------------------------------------------------------------------

## 4. Development Order

### Step 1 --- UI shell

Build: - dashboard, - survey creation, - upload, - analysis, - detection
panel, - report page.

Use temporary mock JSON only at this stage.

### Step 2 --- Backend

Create: - upload endpoint, - inference endpoint, - survey endpoint, -
detection endpoint, - export endpoint.

### Step 3 --- ML

Create an inference wrapper with one stable interface:

``` text
predict(image) -> detections[]
```

Each detection should contain:

``` json
{
  "id": "det_001",
  "class": "ghost_gear",
  "confidence": 0.91,
  "bbox": [x, y, width, height],
  "risk": "HIGH"
}
```

### Step 4 --- Connect

Replace mock results with actual inference.

### Step 5 --- Validation

Test on unseen images.

### Step 6 --- Polish

Improve loading states, errors, empty states, accessibility and
responsive behavior.

------------------------------------------------------------------------

## 5. ML Agent Rules

Start with a lightweight detector.

Do not immediately implement a complex ensemble.

Recommended baseline: - Ultralytics YOLO small/nano variant - transfer
learning - image detection first - segmentation only if the dataset and
timeline justify it.

The exact YOLO version should be chosen after checking current
compatibility and licensing.

Training should be reproducible: - fixed dataset split, - saved
config, - saved class list, - saved model version, - evaluation metrics.

------------------------------------------------------------------------

## 6. Confidence and Risk

Do not equate confidence with physical danger.

Use two concepts:

**Model confidence** \> How confident the detector is that the object
belongs to a class.

**Operational risk** \> A simple product-level priority score derived
from confidence + object type + optional contextual factors.

Example initial rule:

``` text
confidence >= 0.85 -> High
0.65–0.849        -> Medium
< 0.65             -> Low
```

This is a prototype rule, not a scientific risk model.

Keep the rule configurable.

------------------------------------------------------------------------

## 7. Error Handling

Every major operation needs: - loading state, - success state, - empty
state, - error state.

Examples: - invalid image, - unsupported format, - model unavailable, -
inference timeout, - corrupted image, - missing metadata, - export
failure.

Errors must be human-readable.

------------------------------------------------------------------------

## 8. Security Basics

-   Validate uploaded file type.
-   Limit upload size.
-   Never execute uploaded files.
-   Store uploads outside executable paths.
-   Sanitize filenames.
-   Do not log sensitive uploaded content.
-   Keep secrets in `.env`.
-   Never commit API keys.

------------------------------------------------------------------------

## 9. Coding Style

-   Small functions.
-   Typed interfaces where supported.
-   Clear names.
-   No unnecessary abstractions.
-   Comments only where logic is non-obvious.
-   No giant single-file application.
-   No duplicated business logic.
-   Keep model inference independently testable.

------------------------------------------------------------------------

## 10. Definition of Done

A feature is not done because the page renders.

It is done when: - happy path works, - error state works, - data is
persisted or exported as required, - no fake production result
remains, - it works after a clean restart, - README/setup instructions
remain accurate.
