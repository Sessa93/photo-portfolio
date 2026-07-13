# Andrea Sessa — Photo Portfolio

A minimal, dark-themed photography portfolio built with Next.js. Features a masonry grid layout, individual photo detail
pages with camera metadata, images served from a DigitalOcean Spaces CDN, and a secure admin dashboard backed by
PostgreSQL.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791?logo=postgresql)

---

## Features

- **Masonry grid** — responsive CSS columns layout that displays photos at their natural aspect ratio
- **Photo detail pages** — side-by-side view with the image on the left and metadata (title, location, description,
  camera/lens/settings) on the right
- **DigitalOcean Spaces CDN** — photos are served as direct image URLs from a DigitalOcean Spaces bucket via CDN
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
| Language   | TypeScript 6                       |
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
cp .env.example .env   # fill in real secrets — this file is gitignored
docker compose up --build
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard, login, API routes
│   ├── photo/[id]/      # Individual photo detail pages
│   ├── globals.css      # Dark theme, fade animation
│   ├── layout.tsx       # Root layout with font loading
│   └── page.tsx         # Homepage with masonry grid
├── lib/
│   ├── db.ts            # PostgreSQL connection & photo CRUD
│   └── session.ts       # Session management (iron-session)
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

## Image Hosting

Photos are served as direct image URLs from a DigitalOcean Spaces bucket, delivered via CDN at
`https://photo-portfolio-bucket.fra1.cdn.digitaloceanspaces.com`. Paste the full image URL into the admin form when
adding or editing a photo. Any other direct image URL works too.

## Deployment

Pushes to `main` deploy automatically to a DigitalOcean droplet via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. **check** — type-checks and lints.
2. **build** — builds the Docker image and pushes it to GHCR as `ghcr.io/sessa93/photo-portfolio:latest` (and
   `:sha-<commit>` for rollback reference).
3. **deploy** — SSHes into the droplet, logs in to GHCR with the run's own token, then runs
   `git reset --hard origin/main && docker compose pull && docker compose up -d`. The droplet only ever pulls a
   pre-built image — it never builds locally.

### One-time droplet setup

1. Install Docker Engine and the Compose plugin on the droplet.
2. Clone the repo somewhere on the droplet, e.g. `git clone git@github.com:Sessa93/photo-portfolio.git ~/photo-portfolio`.
3. `cd ~/photo-portfolio && cp .env.example .env`, then fill in real secrets (`SESSION_SECRET`, `OPENAI_API_KEY`, etc.) — `.env`
   is gitignored, so `git reset --hard` on future deploys never touches it.
4. `docker compose pull && docker compose up -d` once by hand to confirm it comes up (the image must already exist on
   GHCR — push to `main` at least once first, or `docker compose build` locally as a stopgap), then (if this is a
   fresh database) bootstrap the schema and an admin user — see [Getting Started](#getting-started) steps 3–4. Note
   `docker-compose.yml` no longer publishes Postgres's port to the internet; run those scripts locally against a
   temporary port mapping or SSH tunnel if the droplet's DB is empty.
5. Generate a dedicated SSH keypair for CI (`ssh-keygen -t ed25519 -f deploy_key -N ""`) and append `deploy_key.pub` to
   `~/.ssh/authorized_keys` on the droplet for the deploy user.

GHCR authentication on the droplet is handled automatically by the workflow each run (it logs in with the ephemeral
`GITHUB_TOKEN` before pulling) — no long-lived registry credentials need to be stored on the droplet. The package is
private by default; the deploying user just needs read access to this repo.

### GitHub configuration

Under the repo's **Settings → Secrets and variables → Actions**, add:

| Name                  | Type     | Value                                                |
|------------------------|----------|-------------------------------------------------------|
| `DROPLET_HOST`         | Secret   | Droplet IP or hostname                                |
| `DROPLET_USERNAME`     | Secret   | SSH user on the droplet                                |
| `DROPLET_SSH_KEY`      | Secret   | Private half of the deploy keypair (`deploy_key`)      |
| `DROPLET_PORT`         | Secret   | SSH port, if not 22 (optional)                         |
| `DEPLOY_PATH`          | Variable | Absolute path to the cloned repo, e.g. `/home/deploy/photo-portfolio` |

## License

All photographs are copyrighted. Code is available for personal use.
