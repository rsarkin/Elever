# ELVER --- Technical Stack & Free Resources

## 1. Architecture

Recommended MVP architecture:

``` text
Browser
   │
   ▼
Frontend
   │ REST/JSON
   ▼
Backend API
   │
   ├── Image preprocessing
   ├── ML inference
   ├── Detection/risk logic
   ├── Metadata handling
   └── Report generation
   │
   ▼
SQLite / local storage
```

Keep the architecture simple enough to run locally.

------------------------------------------------------------------------

## 2. Frontend

### Recommended

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   shadcn/ui
-   Lucide icons
-   Recharts for simple charts
-   Leaflet + React-Leaflet for maps

Why: - free/open-source tooling, - fast development, - easy component
reuse, - good for vibe coding, - strong ecosystem.

------------------------------------------------------------------------

## 3. Backend

### Recommended

-   Python
-   FastAPI
-   Uvicorn
-   Pydantic
-   Python Multipart uploads

Why: - natural fit for computer vision, - easy ML integration, - typed
API schemas, - fast local development.

------------------------------------------------------------------------

## 4. Computer Vision

Recommended baseline: - OpenCV - Pillow - NumPy

Use these for: - grayscale conversion, - normalization, - resizing, -
contrast enhancement, - denoising where justified, - image metadata
handling.

Do not over-process images before the baseline model is evaluated.

------------------------------------------------------------------------

## 5. ML

### Baseline

Ultralytics YOLO, using a lightweight detection model.

Official docs: https://docs.ultralytics.com/

The current Ultralytics Python API supports custom training, validation,
prediction and export to formats including ONNX and TensorRT.

Use transfer learning rather than training from scratch.

### Optional later

-   U-Net / segmentation
-   DeepLab
-   Mask R-CNN
-   RF-DETR
-   transformer-based models

Only add these after a baseline has been measured.

------------------------------------------------------------------------

## 6. Training Environment

### Free options

Primary: - Google Colab free tier when available - Kaggle notebooks when
available

Local: - CPU inference is acceptable for MVP testing. - NVIDIA GPU is
useful but not mandatory for UI/backend development.

Training should produce: - `best.pt` - class map - dataset config -
metrics - confusion matrix - validation images

------------------------------------------------------------------------

## 7. Inference

Initial: - PyTorch/Ultralytics model locally.

Optional deployment: - ONNX Runtime

Future: - TensorRT on NVIDIA Jetson.

Do not optimize for edge hardware until the detector is accurate enough
to justify it.

------------------------------------------------------------------------

## 8. Database

### MVP

SQLite.

Store: - surveys, - uploaded image references, - detections, -
verification status, - coordinates, - report metadata.

Future: - PostgreSQL + PostGIS for real deployment.

------------------------------------------------------------------------

## 9. File Storage

MVP: - local `uploads/` directory.

Future: - S3-compatible object storage.

Do not introduce cloud storage just because it is available.

------------------------------------------------------------------------

## 10. Maps

### Frontend

Leaflet.

### Data

OpenStreetMap.

Important: OSM data is free, but the public OSM tile servers have usage
policies and are not intended as unlimited production infrastructure.

For a competition prototype with modest traffic, use an appropriate tile
provider and attribution. Make the tile URL configurable.

OSM policies: https://operations.osmfoundation.org/policies/tiles/

If geocoding is needed, do not blindly integrate public Nominatim into a
high-volume or generic search/autocomplete feature. The public Nominatim
service has strict usage limits and policies.

Nominatim policy:
https://operations.osmfoundation.org/policies/nominatim/

------------------------------------------------------------------------

## 11. APIs

### Required external APIs

None.

This is deliberate.

The core product must work offline/local after the model and dataset are
installed.

### Optional

Map tile provider API/service.

### Avoid for MVP

-   paid AI APIs,
-   external computer-vision inference APIs,
-   unnecessary geocoding APIs,
-   paid map APIs.

The AI model should be ours/fine-tuned locally.

------------------------------------------------------------------------

## 12. Datasets

### A. GhostVision / Ghost Pot Side-Scan Sonar Detection Dataset

Source:
https://huggingface.co/datasets/PINGEcosystem/sss-crab-pot-detection-ds

Current dataset page reports: - 6,674 images - consumer-grade Humminbird
side-scan sonar - derelict crab-pot detection - JSONL annotations - data
from Delaware Inland Bays / Delaware Bay

Use as an important ghost-gear-related dataset, but do not treat crab
pots as identical to ghost nets.

Check the current repository license and dataset card before
redistribution or commercial use.

### B. Kaggle Side-Scan Sonar Object Detection Challenge

Source:
https://www.kaggle.com/competitions/side-scan-sonar-object-detection-challenge/data

The current Kaggle page describes grayscale side-scan sonar images with
bounding-box and class labels.

The competition rules govern use, so review them before incorporating
the data into a public/commercial release.

### C. Roboflow Side Scan Sonar Dataset

Source: https://universe.roboflow.com/dae-hyeok-lee/side-scan-sonar

Current page reports: - 550 images - object detection - classes: Ship,
Plane - CC BY 4.0

Useful primarily as supplementary SSS object data, not as marine-debris
data.

### D. AI4Shipwrecks / other research datasets

Before adding any research dataset to the training pipeline, verify: -
download access, - license, - label type, - sensor, - coordinate
metadata, - compatibility with our class taxonomy.

Do not merge datasets blindly.

------------------------------------------------------------------------

## 13. Dataset Strategy

Use a master taxonomy.

Example:

``` text
0 = ghost_gear
1 = man_made_debris
2 = shipwreck
3 = other_anomaly
```

Only create a class if there are enough high-quality labelled examples.

Keep: - source dataset, - original class, - normalized class, - image
ID, - annotation provenance.

Example:

``` text
source: ghostvision
original_class: Crab-Pot
normalized_class: ghost_gear
```

Do not erase original labels.

------------------------------------------------------------------------

## 14. Hard Negatives

Collect and retain examples of: - rocks, - seabed ridges, - sand
ripples, - acoustic shadows, - vegetation, - noise, - sonar artifacts.

These are essential for reducing false positives.

------------------------------------------------------------------------

## 15. Data Split

Recommended starting point:

``` text
70% train
20% validation
10% test
```

But split by survey/mission/location where possible, not random
near-duplicate image patches.

This prevents leakage between almost-identical sonar frames.

------------------------------------------------------------------------

## 16. Data Augmentation

Use carefully: - horizontal/vertical flips only if physically
appropriate, - small rotations, - brightness/contrast changes, - mild
noise, - blur, - scale/crop.

Do not use aggressive transformations that destroy sonar geometry.

------------------------------------------------------------------------

## 17. Geolocation

MVP priority:

### Level 1

Use real GPS metadata when available.

### Level 2

Store image/sonar metadata separately and show "Location unavailable" if
absent.

### Level 3

Implement XTF/JSF parsing later.

Never infer precise latitude/longitude from an image alone unless the
necessary survey geometry/metadata exists.

------------------------------------------------------------------------

## 18. Report Schema

Example:

``` json
{
  "survey_id": "survey_001",
  "detections": [
    {
      "id": "det_001",
      "class": "ghost_gear",
      "confidence": 0.91,
      "risk": "HIGH",
      "bbox": {
        "x": 120,
        "y": 220,
        "width": 84,
        "height": 55
      },
      "latitude": null,
      "longitude": null,
      "location_status": "unavailable",
      "verification": "unverified"
    }
  ]
}
```

------------------------------------------------------------------------

## 19. Model Evaluation

At minimum record: - precision, - recall, - mAP, - confusion matrix, -
false positives, - inference latency.

For the SIH demo, show actual validation/test metrics.

Never claim: \> "95% accurate"

unless that exact metric has been measured and defined.

------------------------------------------------------------------------

## 20. Deployment

### MVP

Local development: - frontend, - FastAPI, - model, - SQLite.

### Demo

One laptop is enough.

### Future edge

-   ONNX
-   TensorRT
-   NVIDIA Jetson

Ultralytics supports export to ONNX/TensorRT. Use this only after model
quality is acceptable.

------------------------------------------------------------------------

## 21. Optional Free Developer Tools

-   GitHub --- source control
-   GitHub Actions --- basic CI
-   VS Code --- development
-   Google Colab --- training
-   Kaggle --- datasets/notebooks
-   CVAT --- annotation
-   Label Studio --- annotation
-   Roboflow --- optional dataset visualization/annotation; check
    plan/licensing before relying on hosted features
-   Docker --- reproducible local environment

------------------------------------------------------------------------

## 22. Environment Variables

Example:

``` env
MODEL_PATH=./models/best.pt
DATABASE_URL=sqlite:///./elver.db
UPLOAD_DIR=./uploads
MAX_UPLOAD_MB=50

MAP_TILE_URL=
MAP_ATTRIBUTION=

CORS_ORIGINS=http://localhost:5173
```

Never commit secrets.

------------------------------------------------------------------------

## 23. Free-First Principle

The MVP should have **zero mandatory paid APIs**.

The only external dependency that may be needed for the demo is map tile
access.

Everything else should run locally: - frontend, - backend, -
preprocessing, - inference, - database, - report generation.

------------------------------------------------------------------------

## 24. Recommended Build Stack --- Final

  Layer              Choice
  ------------------ -------------------------------------
  Frontend           React + TypeScript + Vite
  Styling            Tailwind CSS
  UI                 shadcn/ui
  Icons              Lucide
  Charts             Recharts
  Map                Leaflet
  Backend            FastAPI
  ML                 Ultralytics YOLO baseline
  CV                 OpenCV + Pillow
  Numerical          NumPy
  Validation         scikit-learn + model metrics
  Database           SQLite
  ORM                SQLAlchemy
  Reports            Python CSV/JSON; optional ReportLab
  Training           Colab / Kaggle
  Model deployment   PyTorch first, ONNX later
  Version control    Git + GitHub
  Annotation         CVAT / Label Studio
  Container          Docker optional

------------------------------------------------------------------------

## 25. Important Licensing Note

"Free to download" does not automatically mean "free for every use."

Before public release: - check each dataset license, - check each model
license, - check competition rules, - preserve attribution, - do not
redistribute restricted datasets, - document source and license for
every training source.

ELVER should maintain a `DATA_SOURCES.md` file recording provenance and
license decisions.
