# A1 Landscape Architectural Sheet Studio

> High-precision web application for composing professional landscape A1 architectural presentation sheets (841 × 594 mm) and exporting print-ready vector PDFs with custom margins, dual title blocks, and dynamic photo collages.

## Features

- **Standard A1 Landscape**: True physical dimensions (841mm × 594mm) with 2cm left margin reserved for pin-up/binding and 1cm outer border.
- **Customizable 5cm Title Block**: Split into large project title and dynamic metadata fields (`[Label]: [Value]` or standalone lines).
- **Collage & Mosaic Engine**: Regular grid arrangements (2x3, 2x2, auto) and dynamic architectural mosaic templates (Hero Left, Hero Right, Hero Top, Asymmetric Quad, Asymmetric 5).
- **Photo Reordering & Rotation**: Move photos up/down and rotate in 90° increments.
- **Touch & Mobile Optimized**: 1-finger free pan and 2-finger pinch zoom on canvas, with responsive Split, Controls, and Canvas views.
- **Light & Dark Themes**: Fully switchable Geist/shadcn minimal aesthetic.
- **Vector-Sharp PDF Export**: Direct vector generation embedding native-resolution images and vector paths via `pdf-lib`.

## Tech Stack

- **Frontend**: Pure ECMAScript Modules (ESM) + Tailwind CSS
- **PDF Engine**: PDF-Lib (Client-Side Vector Renderer)
- **Deployment**: Vercel Static Hosting
