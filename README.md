# Open Source Opportunity Finder

Discover open-source projects that match your interests, skill level, and contribution goals. Get personalized recommendations in under 30 seconds.

## Features

- **Smart Onboarding** — 5-step flow to capture your interests, experience, goals, languages, and time commitment
- **Personalized Recommendations** — Filtered issue cards with repo details, difficulty levels, and contributor-friendly labels
- **Explainability** — Every recommendation explains why it was suggested
- **README Intelligence** — Contribution guide detection, setup complexity, tech stack, and architecture analysis
- **Filters** — Difficulty, language, and beginner-friendly filters
- **User Accounts** — Sign up / sign in with persistent preferences stored in PostgreSQL
- **Preferences Editor** — Update your profile and change password anytime from the results page
- **Dark Mode First** — Premium developer-tool aesthetic

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, TypeScript, Tailwind CSS v4, ShadCN (base-mira) |
| Database | PostgreSQL 18 via Prisma 6 |
| Auth | JWT (jose) + bcryptjs, httpOnly cookies |
| Data Sources | GitHub API (details, issues, READMEs), Bright Data (trending discovery) |
| Proxy | Next.js 16 `proxy.ts` (middleware replacement) |

## Getting Started

### Prerequisites

- Node.js 24+
- Docker (for PostgreSQL) or a running PostgreSQL instance

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker run -d --name osof-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=osof \
  -p 5432:5432 \
  postgres:18
```

Or use an existing PostgreSQL instance and update `.env`.

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your database URL, session secret, and API keys:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/osof?schema=public"
SESSION_SECRET="your-random-secret-here"
BRIGHTDATA_API_KEY="your-brightdata-api-key"
GITHUB_TOKEN="your-github-personal-access-token"
```

A GitHub Personal Access Token is recommended for reliable scraping (5,000 req/hr vs 60 unauthenticated).

### 4. Run migrations

```bash
npx prisma migrate dev
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── change-password/route.ts
│   │   │   ├── reset-password/route.ts
│   │   │   ├── session/route.ts
│   │   │   ├── signin/route.ts
│   │   │   ├── signout/route.ts
│   │   │   └── signup/route.ts
│   │   ├── recommendations/route.ts
│   │   ├── scrape/route.ts
│   │   └── user/
│   │       └── preferences/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── account/
│   │   ├── preferences-editor.tsx
│   │   └── user-menu.tsx
│   ├── auth/
│   │   └── auth-modal.tsx
│   ├── landing/
│   │   └── hero.tsx
│   ├── onboarding/
│   │   ├── onboarding-flow.tsx
│   │   ├── progress-bar.tsx
│   │   ├── step-experience.tsx
│   │   ├── step-goals.tsx
│   │   ├── step-interests.tsx
│   │   ├── step-languages.tsx
│   │   └── step-time.tsx
│   ├── recommendations/
│   │   ├── empty-state.tsx
│   │   ├── filter-sidebar.tsx
│   │   ├── recommendation-card.tsx
│   │   ├── recommendation-grid.tsx
│   │   └── results-page.tsx
│   └── ui/              # ShadCN components
├── lib/
│   ├── auth-context.tsx
│   ├── brightdata.ts
│   ├── db.ts
│   ├── github-api.ts
│   ├── mock-data.ts
│   ├── readme-analyzer.ts
│   ├── scraper-pipeline.ts
│   ├── session.ts
│   ├── types.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── proxy.ts             # Next.js 16 middleware (auth protection)
├── docker-compose.yml
└── .env.example
```

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/signin` | No | Sign in |
| POST | `/api/auth/signout` | No | Sign out |
| GET | `/api/auth/session` | No | Get current session |
| POST | `/api/auth/change-password` | Yes | Change password |
| POST | `/api/auth/reset-password` | Yes | Reset password (requires session) |
| GET | `/api/recommendations` | Yes | Get issue recommendations with README intelligence |
| GET | `/api/scrape` | Yes | Trigger full scraper pipeline |
| POST | `/api/scrape` | Yes | Scrape a single repository |
| GET | `/api/user/preferences` | Yes | Get user preferences |
| PUT | `/api/user/preferences` | Yes | Update user preferences |

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String              // bcrypt hashed
  createdAt DateTime @default(now())
  preferences UserPreferences?
}

model UserPreferences {
  id              String   @id @default(cuid())
  userId          String   @unique
  interests       String   @default("[]")   // JSON array
  experienceLevel String?
  goals           String   @default("[]")   // JSON array
  languages       String   @default("[]")   // JSON array
  customLanguages String   @default("[]")   // JSON array
  timeCommitment  String?
  updatedAt       DateTime @updatedAt
}

model ScrapedRepo {
  id            Int      @id
  fullName      String   @unique
  owner         String
  name          String
  description   String?
  language      String?
  stars         Int      @default(0)
  forks         Int      @default(0)
  topics        String   @default("[]")   // JSON array
  license       String?
  defaultBranch String?
  pushedAt      DateTime?
  scrapedAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  issues        ScrapedIssue[]
  readme        ScrapedReadme?
}

model ScrapedIssue {
  id        Int      @id @default(autoincrement())
  repoId    Int
  repo      ScrapedRepo @relation(fields: [repoId], references: [id], onDelete: Cascade)
  number    Int
  title     String
  url       String
  labels    String   @default("[]")   // JSON array
  comments  Int      @default(0)
  author    String?
  createdAt DateTime?
  scrapedAt DateTime @default(now())
  @@unique([repoId, number])
}

model ScrapedReadme {
  id                   Int      @id @default(autoincrement())
  repoId               Int      @unique
  repo                 ScrapedRepo @relation(fields: [repoId], references: [id], onDelete: Cascade)
  rawContent           String
  hasContributionGuide Boolean  @default(false)
  setupComplexity      String   @default("unknown")
  techStack            String   @default("[]")   // JSON array
  architectureKeywords String   @default("[]")   // JSON array
  scrapedAt            DateTime @default(now())
}
```

## Docker Management

```bash
docker start osof-postgres   # start the database
docker stop osof-postgres    # stop the database
docker rm osof-postgres      # remove the container
```
