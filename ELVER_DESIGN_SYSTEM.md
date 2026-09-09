# ELVER — Design System

## Design Direction
ELVER should feel like a modern marine intelligence / sonar operations product.

**Minimal · Technical · Calm · Precise · Trustworthy**

Avoid:
- gaming-dashboard aesthetics
- generic SaaS templates
- excessive sci-fi effects
- complicated GIS interfaces

## Visual Hierarchy
1. Sonar imagery + detections
2. Detection information
3. Metadata/navigation/statistics

The user should immediately understand what needs attention.

## Colors
Default: dark interface.

Base:
- Deep navy / near-black background
- Slightly lighter panels
- Neutral borders

Accent:
- Cyan / teal for primary interaction

Semantic:
- Green = confirmed/success
- Red = rejected/error
- Amber = attention/priority
- Gray = unavailable/inactive

No gradients. No excessive glow. No 3D effects.

## Typography
Use **Inter** or another clean sans-serif.

Use:
- strong page titles
- semibold section headings
- regular body text
- muted metadata
- clear prominent numbers

Use sentence case. Avoid unnecessary ALL CAPS.

## Spacing
Use a consistent 4px base scale:

**4 / 8 / 12 / 16 / 24 / 32 px**

Prefer generous whitespace.

## Cards
- Subtle border
- Moderate radius
- Minimal/no shadow
- One clear purpose

Avoid cards inside cards unless necessary.

## Buttons
Primary:
- Accent background
- Main action

Secondary:
- Neutral/outline

Danger:
- Reject

Review actions should be visually distinct.

## Badges

Confidence:
**91%**

Priority:
**High / Medium / Low**

Status:
**AI Detected / Confirmed / Rejected**

Do not imply confidence is a calibrated probability unless the model is calibrated.

## Analysis Screen

Recommended structure:

```text
┌────────────────────────────────────────────────────┐
│ ELVER                         Survey #024           │
├────────────────────────────────────────────────────┤
│                                                    │
│                 SONAR VIEW                        │
│                                                    │
│            [ detection boxes ]                     │
│                                                    │
├──────────────────────┬─────────────────────────────┤
│ DETECTIONS            │ SELECTED TARGET            │
│ Fishing Gear   91%   │ Fishing Gear               │
│ Debris         84%   │ 91% confidence              │
│ Anomaly        61%   │ HIGH PRIORITY               │
│                      │ [ Confirm ] [ Reject ]      │
└──────────────────────┴─────────────────────────────┘
```

The sonar viewer should dominate the page.

## Sonar Viewer
Support:
- fit image
- zoom
- pan if practical
- bounding boxes
- detection selection

Selected detection:
- highlighted box
- highlighted list item

Do not cover important sonar content with large overlays.

## Map
Use a simple map.

Only display real coordinates from metadata/backend.

If unavailable:

**Location unavailable**

## Accessibility
Ensure:
- readable contrast
- visible focus states
- keyboard-accessible buttons
- meaningful labels
- status not communicated by color alone

## Responsive
Desktop-first because sonar analysis benefits from screen space.

Support tablet widths.

On smaller screens:
- stack panels
- keep sonar viewer usable
- move detection details below the viewer

## Product Feel
Professional enough for a survey operator, simple enough for a first-time user.

Rule:

> If a feature doesn't help detect, verify, locate or report an anomaly, it probably doesn't belong in the MVP.
