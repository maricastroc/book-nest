<h1 align="center">
  <br>
  <img src="public/assets/favicon.svg" alt="Book Nest" width="40">
  <br>
  Book Nest
  <br>
</h1>

<h4 align="center">A fullstack book tracking platform with explainable, evaluated recommendations.</h4>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-recommendation-engine">Recommendation Engine</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-testing">Testing</a> •
  <a href="#-license">License</a>
</p>

<p align="center">
  Discover books, track what you're reading, rate and review, follow other readers, and get <strong>explainable, evaluated recommendations</strong> tailored to your taste. A single fullstack Next.js app (Pages Router) — UI, REST API routes, the database layer (Prisma + PostgreSQL) and authentication all in one deployment.
</p>

<p align="center">
  🔗 <strong>Live demo:</strong> <a href="https://book-nest.marianacastro.dev">book-nest.marianacastro.dev</a>
</p>

<p align="center">
  <img src="docs/screenshots/home-desktop.png" alt="Book Nest" width="800" />
</p>

<br/>

## ✨ Features

**Reading & tracking**
- Track books with four statuses: read, reading, want to read, and did not finish
- A personal library grouped by status, with per-status counts
- Reading insights — total pages read and distinct authors explored, plus a status breakdown donut

**Ratings & reviews**
- Rate books (1–5★) and write reviews
- Upvote / downvote other readers' reviews to surface the most helpful ones
- Community feed of the latest ratings across the platform

**Discovery**
- **"Recommended for you"** — up to 4 books tailored to each reader, each with a reason chip (see [Recommendation engine](#-recommendation-engine))
- Explore books by category, with debounced real-time search
- Popular and trending rails, and a featured cover story for guests

**Social**
- Follow / unfollow readers, with followers & following lists
- A readers directory to discover other users and visit their profiles

**Book submission**
- Submit new books by ISBN — the app enriches them by fetching technical data from the **Google Books** and **Open Library** APIs
- A guided multi-step submission wizard
- **Moderation flow**: submissions are `PENDING` until an admin approves or rejects them

**Experience**
- Fully responsive, with a mobile sidebar and adaptive navigation
- Edit your profile — name and avatar — with a built-in image cropper
- Animated page and component transitions (Framer Motion)
- Pagination and debounced search on book and reader listings

**Auth**
- Sign in with **Google**, **GitHub**, or email + password (credentials)
- Sessions handled by NextAuth with a custom Prisma adapter — see [Authentication](#-authentication)

---

## 🖼️ Screenshots

<table>
  <tr>
    <td align="center" width="62%"><strong>Desktop</strong></td>
    <td align="center" width="38%"><strong>Mobile</strong></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/home-desktop.png" alt="Home — Desktop" /></td>
    <td rowspan="2" valign="top"><img src="docs/screenshots/library-mobile.png" alt="Library — Mobile" /></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/explore-desktop.png" alt="Explore — Desktop" /></td>
  </tr>
</table>

---

## 🧱 Tech Stack

**Framework & language**
- [Next.js 15](https://nextjs.org/) (Pages Router) · [React 18](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/)

**Frontend**
- [Tailwind CSS v4](https://tailwindcss.com/) for styling
- [Radix UI](https://www.radix-ui.com/) primitives (dialog, dropdown, checkbox) + [Font Awesome](https://fontawesome.com/)
- [Framer Motion](https://www.framer.com/motion/) for transitions
- [SWR](https://swr.vercel.app/) + [Axios](https://axios-http.com/) for data fetching
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for forms and validation
- [react-hot-toast](https://react-hot-toast.com/) for notifications, [react-cropper](https://github.com/react-cropper/react-cropper) for avatar cropping

**Backend & data**
- Next.js API routes (REST) on [PostgreSQL](https://www.postgresql.org/) via [Prisma 6](https://www.prisma.io/)
- [NextAuth.js v4](https://next-auth.js.org/) (Google, GitHub, Credentials) with a custom Prisma adapter and `bcrypt`
- [@vercel/og](https://vercel.com/docs/functions/og-image-generation) for dynamic Open Graph images

**Tooling**
- [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/) for tests
- ESLint + Prettier

---

## 🧠 Recommendation engine

The "Recommended for you" rail isn't a popularity list — it's a small ranking system that is **explainable** (it tells you why) and **measured** (its quality is tested, not assumed). The scoring logic lives in a pure, dependency-free module ([`src/lib/recommendation/score.ts`](src/lib/recommendation/score.ts)) so it can be unit-tested and evaluated offline without a database.

A book's score blends two signals, each normalized to `[0, 1]` so the weights actually mean what they say (`0.6 · quality + 0.4 · affinity`):

- **Quality — a Bayesian-damped rating.** A raw average is a trap: a book with a single 5★ would outrank a book with 200 ratings at 4.6. So instead of the mean, each book gets a Bayesian estimate (the "true Bayesian" / IMDB weighted rating):

  ```
  (C · m + Σ ratings) / (C + n)
  ```

  where `m` is the global mean rating and `C` is a prior strength. With few ratings the score sits near the global mean; as ratings accumulate it converges to the book's real average. This is what neutralizes cold-start hype.

- **Affinity — a share of demonstrated taste.** From the books a user rated 4★+, I build a probability distribution over categories (summing to 1). A candidate's affinity is the summed weight of the categories it shares with that distribution — so a book in your two favorite genres scores far higher than one in a genre you've touched once.

**It explains itself.** Each recommendation carries structured reasons (`Because you like Fantasy & Adventure`, `Highly rated by readers (4.4★)`), rendered as a chip on the book card — so the rail is legible instead of a black box.

**It's evaluated, not asserted.** A leave-one-out hold-out test ([`src/tests/lib/recommendation/score.test.ts`](src/tests/lib/recommendation/score.test.ts)) builds synthetic users with known tastes, hides a book each would love, drops it into a pool of distractors (off-taste hits, on-taste duds, cold-start hype, noise), and checks whether the ranker surfaces it. Over 400 deterministic trials it reports **hit-rate@4 ≈ 0.85** and **MRR ≈ 0.77**, against a random baseline of ~0.15 — turning "I built a recommender" into "I measured my recommender". Run it with `npm test`.

---

## 🏛️ Architecture

Book Nest is a **single fullstack Next.js deployment** — no separate API service:

```
Browser ──> book-nest.marianacastro.dev   (Next.js · Vercel)
   │
   ├── SWR/Axios ──> /api/* route handlers        (REST, same origin)
   │                     │
   │                     └── Prisma ──> PostgreSQL
   │
   └── ISBN submission ──> Google Books API · Open Library API   (external enrichment)
```

The API routes under `src/pages/api` own all data access through Prisma. The ranking logic is deliberately kept as a **pure module** (`src/lib/recommendation`) so the API route only fetches data and feeds plain objects into it — which is what makes the ranker testable without a database.

### 🔐 Authentication

Auth is handled by **NextAuth.js v4** with a **JWT session strategy** and a **custom Prisma adapter** ([`src/lib/auth/prisma-adapter.ts`](src/lib/auth/prisma-adapter.ts)):

1. Users sign in via **Google** or **GitHub** OAuth, or with **email + password** (Credentials provider), where passwords are hashed with `bcrypt`.
2. The custom adapter persists users, accounts and sessions to PostgreSQL, and links OAuth accounts to existing users.
3. Protected API routes read the session server-side with `getServerSession` before touching the database.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js 24+](https://nodejs.org/) and npm
- A **PostgreSQL** database (local or hosted)
- Optional: Google / GitHub OAuth credentials for social login

### 1. Clone & install
```bash
git clone https://github.com/maricastroc/book-nest
cd book-nest
npm install
```

### 2. Configure the environment
Copy the example file and fill in the values:
```bash
cp .env.example .env
```
```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/booknest"

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# GitHub OAuth
GITHUB_ID=
GITHUB_SECRET=

# NextAuth
NEXTAUTH_SECRET=

# Used for OG image generation
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up the database
Generate the Prisma client and apply migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing

Tests run on [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/), split into three projects (see [`jest.config.ts`](jest.config.ts)):

- **`lib`** — the recommendation engine: Bayesian rating, category affinity, ranking, the human-readable reasons, and a leave-one-out hold-out evaluation that measures ranking quality (hit-rate@4 / MRR)
- **`api`** — API route handlers (ratings, books, profile, categories, reading status…), exercised with mocked requests
- **`components`** — UI components (book card, star rating, search bar, pagination, empty states) in a jsdom environment

```bash
npm test          # run the full suite
npm run test:watch  # watch mode
```

Coverage is collected into `coverage/`.

---

## 📦 Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run the test suite |
| `npm run test:watch` | Run tests in watch mode |

---

## 📝 Engineering decisions

A few decisions worth calling out:

- **Explainable, evaluated recommendations.** The ranking is a pure, dependency-free module that blends a Bayesian-damped community rating with a category-affinity signal, explains *why* each book was picked, and is validated by an offline hold-out test — so ranking quality is measured, not assumed.
- **Pure core, thin I/O boundary.** Scoring logic is kept free of Prisma so the API route only fetches data and feeds plain objects into the ranker. That separation is exactly what makes the algorithm unit-testable without a database.
- **Typed, `any`-free source.** The `src/` tree avoids `any`, deriving request/response shapes from Prisma's generated types and using a typed mock helper for the API tests.
- **React Context + SWR for state.** SWR owns server data and revalidation; Context holds cross-cutting UI state — separating "what the server says" from "what the user is looking at".
- **External enrichment for book submissions.** New books are hydrated from the Google Books and Open Library APIs from just an ISBN, keeping the submission form short while filling in rich metadata.

---

## 📄 License

Released under the [MIT License](LICENSE). You're free to use, study, fork and build on this code — **as long as the original copyright and license notice are kept**. Reuse it and learn from it; don't strip the attribution and present it as your own.

© 2025–2026 Mariana Castro
