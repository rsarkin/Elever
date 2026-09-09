# ELVER — Frontend API Contract

## Purpose
Define the data contract between the React frontend and FastAPI backend.

Develop against these contracts with mock data first. Backend should later return the same shapes.

## 1. Survey

```json
{
  "id": "survey_001",
  "name": "Test Survey 01",
  "date": "2026-09-09",
  "source": "Demo Dataset",
  "image_count": 12,
  "detection_count": 8,
  "confirmed_count": 5,
  "created_at": "2026-09-09T18:00:00Z"
}
```

## 2. Create Survey

**POST `/api/surveys`**

Request:
```json
{
  "name": "Test Survey 01",
  "date": "2026-09-09",
  "source": "Demo Dataset"
}
```

## 3. Upload Image

**POST `/api/surveys/{survey_id}/images`**

Use multipart/form-data.

Response:
```json
{
  "image_id": "image_001",
  "survey_id": "survey_001",
  "filename": "sonar_001.jpg",
  "status": "uploaded"
}
```

Status:
- uploaded
- analyzing
- analyzed
- failed

## 4. Analyze Image

**POST `/api/images/{image_id}/analyze`**

Response:
```json
{
  "image_id": "image_001",
  "status": "completed",
  "detections": [
    {
      "id": "det_001",
      "class_name": "fishing_gear",
      "confidence": 0.91,
      "priority": "high",
      "status": "ai_detected",
      "bbox": {
        "x": 420,
        "y": 180,
        "width": 120,
        "height": 95
      },
      "dimensions": {
        "width": null,
        "height": null
      },
      "location": {
        "latitude": null,
        "longitude": null
      },
      "notes": ""
    }
  ]
}
```

## 5. Detection

Required:
- id
- class_name
- confidence
- priority
- status
- bbox

Optional:
- dimensions
- location
- notes

Status:
```text
ai_detected
confirmed
rejected
```

Priority:
```text
high
medium
low
```

Confidence is 0–1 in the API.

Example:
```text
0.91
```

Frontend displays:
```text
91%
```

Do not call it a calibrated 91% probability unless the model is calibrated.

## 6. Review Detection

**PATCH `/api/detections/{detection_id}`**

Confirm:
```json
{
  "status": "confirmed",
  "notes": "Verified by operator"
}
```

Reject:
```json
{
  "status": "rejected",
  "notes": "Natural seabed formation"
}
```

## 7. Detection List

**GET `/api/surveys/{survey_id}/detections`**

Response:
```json
{
  "survey_id": "survey_001",
  "detections": []
}
```

## 8. Location

**GET `/api/detections/{detection_id}/location`**

Available:
```json
{
  "available": true,
  "latitude": 18.5204,
  "longitude": 73.8567
}
```

Unavailable:
```json
{
  "available": false,
  "latitude": null,
  "longitude": null
}
```

Frontend displays **Location unavailable** when unavailable.

## 9. Reports

**GET `/api/surveys/{survey_id}/report`**

Response:
```json
{
  "survey_id": "survey_001",
  "summary": {
    "images": 12,
    "detections": 8,
    "confirmed": 5,
    "rejected": 2,
    "pending": 1
  },
  "detections": []
}
```

Exports:
- `GET /api/surveys/{survey_id}/report.csv`
- `GET /api/surveys/{survey_id}/report.json`

## 10. Dashboard Summary

**GET `/api/dashboard/summary`**

```json
{
  "surveys": 3,
  "images_analyzed": 127,
  "detections": 18,
  "confirmed": 11,
  "high_priority": 4
}
```

## 11. Error Format

```json
{
  "error": {
    "code": "INVALID_FILE",
    "message": "Unsupported image format."
  }
}
```

Frontend shows a human-readable message and never exposes raw stack traces.

## 12. Mock Development

Use:

```text
src/
  mocks/
    surveys.ts
    detections.ts
    dashboard.ts
```

Do not hard-code detection data inside UI components.

Architecture:

```text
UI
 ↓
Service Layer
 ↓
Mock API   ← development
 ↓
FastAPI    ← integration
```

## 13. Responsibility Boundary

Frontend:
- presentation
- navigation
- interaction
- filtering
- visual states
- map display

Backend:
- file handling
- inference orchestration
- database
- metadata parsing
- detection persistence
- report generation

AI:
- image inference
- class
- confidence
- bounding boxes

Keep these responsibilities separated.
