# Andrea Sessa — Photo Portfolio

A minimal, dark-themed photography portfolio built with Next.js. Features a masonry grid layout, individual photo detail
pages with camera metadata, Amazon Photos proxy, and a secure admin dashboard backed by PostgreSQL.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?logo=postgresql)

---

## Features

- **Masonry grid** — responsive CSS columns layout that displays photos at their natural aspect ratio
- **Photo detail pages** — side-by-side view with the image on the left and metadata (title, location, description,
  camera/lens/settings) on the right
- **Amazon Photos proxy** — API route that resolves Amazon Photos share links to displayable image URLs
- **Dark minimal design** — `#0c0c0c` background, Playfair Display headings, subtle hover effects
- **Page transitions** — fade-in animation when navigating to detail pages
- **Admin dashboard** — secure login, add/edit/delete photos, all data stored in PostgreSQL
- **CLI scripts** — bootstrap DB schema, create admin users
- **Dynamic rendering** — pages fetch photo data from the database

## Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Framework  | Next.js 16 (App Router, Turbopack) |
| UI         | React 19, Tailwind CSS v4          |
| Typography | Geist Sans, Playfair Display       |
| Language   | TypeScript 5                       |
| Database   | PostgreSQL 18                      |
| Auth       | iron-session, bcryptjs             |
| Runtime    | Bun (Docker) / Node.js (local)     |

## Getting Started

### 1. Environment Setup

Copy the example env file and edit your secrets:

```bash
cp .env.local.example .env.local
```

- `DATABASE_URL` — PostgreSQL connection string (default:
  `postgresql://postgres:postgres@localhost:5432/photo_portfolio`)
- `SESSION_SECRET` — at least 32 chars, generate with `openssl rand -base64 32`

### 2. Install dependencies

```bash
npm install
```

### 3. Bootstrap the database

Create tables for admin users and photos:

```bash
npm run db:bootstrap
```

### 4. Create an admin user

Add a user for dashboard login:

```bash
npm run db:create-admin
```

You can also pass username/password as arguments:

```bash
npm run db:create-admin alice mypassword
```

### 5. Start the app

```bash
npm run dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) to log in.

### Docker

```bash
docker compose up --build
```

The app will be available at [http://localhost](http://localhost) (port 80).

## Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard, login, API routes
│   ├── api/image/       # Proxy route for Amazon Photos share links
│   ├── photo/[id]/      # Individual photo detail pages
│   ├── globals.css      # Dark theme, fade animation
│   ├── layout.tsx       # Root layout with font loading
│   └── page.tsx         # Homepage with masonry grid
├── lib/
│   ├── db.ts            # PostgreSQL connection & photo CRUD
│   ├── session.ts       # Session management (iron-session)
│   └── image.ts         # Image URL helpers (proxy detection)
├── scripts/
│   ├── bootstrap-db.mjs # CLI: create tables
│   └── create-admin.mjs # CLI: add admin user
```

## Admin Dashboard

- Visit `/admin` to log in
- Add new photos (URL, title, description, location, camera, lens, settings, film, sort order)
- Photos are stored in the database and displayed on the main grid
- Delete photos directly from the dashboard
- Secure session-based authentication

## Amazon Photos Support

Both direct image URLs and Amazon Photos share links are supported. Share links are resolved server-side via the
`/api/image` proxy route.

## License

All photographs are copyrighted. Code is available for personal use.
