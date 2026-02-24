# Andrea Sessa — Photo Portfolio

A minimal, dark-themed photography portfolio built with Next.js. Features a masonry grid layout, individual photo detail pages with camera metadata, and support for Amazon Photos share links.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)

---

## Features

- **Masonry grid** — responsive CSS columns layout that displays photos at their natural aspect ratio
- **Photo detail pages** — side-by-side view with the image on the left and metadata (title, location, description, camera/lens/settings) on the right
- **Amazon Photos proxy** — API route that resolves Amazon Photos share links to displayable image URLs
- **Dark minimal design** — `#0c0c0c` background, Playfair Display italic headings, subtle hover effects
- **Page transitions** — fade-in animation when navigating to detail pages
- **Fully static** — pages are pre-rendered at build time via `generateStaticParams`

## Tech Stack

| Layer       | Technology                          |
| ----------- | ----------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack) |
| UI          | React 19, Tailwind CSS v4           |
| Typography  | Geist Sans, Playfair Display        |
| Language    | TypeScript 5                        |
| Runtime     | Bun (Docker) / Node.js (local)      |

## Getting Started

### Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker

```bash
docker compose up --build
```

The app will be available at [http://localhost](http://localhost) (port 80).

## Project Structure

```
src/
├── app/
│   ├── api/image/     # Proxy route for Amazon Photos share links
│   ├── photo/[id]/    # Individual photo detail pages
│   ├── globals.css    # Dark theme, fade animation
│   ├── layout.tsx     # Root layout with font loading
│   └── page.tsx       # Homepage with masonry grid
├── data/
│   └── photos.ts      # Photo data (URLs, titles, camera info)
└── lib/
    └── image.ts        # Image URL helpers (proxy detection)
```

## Adding Photos

Edit `src/data/photos.ts` to add or modify photos:

```typescript
{
  id: "my-photo",
  title: "Sunset Over the Alps",
  description: "A golden evening captured at 3,000 meters.",
  url: "https://images.unsplash.com/photo-...",
  // or an Amazon Photos share link:
  // url: "https://www.amazon.it/photos/share/...",
  camera: "Sony A7R IV",
  lens: "24-70mm f/2.8 GM",
  settings: "f/8 · 1/250s · ISO 100",
  location: "Dolomites, Italy",
}
```

Both direct image URLs and Amazon Photos share links are supported. Share links are resolved server-side via the `/api/image` proxy route.

## License

All photographs are copyrighted. Code is available for personal use.
