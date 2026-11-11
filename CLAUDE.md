# meorisok: build spec

A small, cozy web app that pulls tasks from my Notion Kanban databases into one place. Single user (me), password-protected, hosted on Vercel. Also a portfolio piece, so it needs a public demo mode, a design-system page, and a good README.

Build it end to end by following the phases at the bottom. Read this whole file first. Ask me before changing anything under "Decisions already made."

---

## Decisions already made

| Area | Decision |
|---|---|
| Name | **meorisok** (always lowercase) |
| Sources | Notion databases only, for now. Easy to add more via one config file. |
| Launch databases | Wander Kanban, Plumbob protector to-do list |
| Features | Unified read view, Today / This Week focus, edit status back to Notion, group by project, filter by tag |
| Concept | Cozy cafe. Tasks are order tickets. |
| Look | Clean, minimal-cute. Strawberry milk pink + cream + cocoa. |
| Access | Me only, one password. Notion token stays server-side. |
| Data freshness | Fetch live on page load, short server cache, manual refresh button |
| Purpose | Portfolio quality: demo mode, /design page, README, case-study notes |
| Stack | Next.js (App Router) + TypeScript + Tailwind, deployed on Vercel |

## Voice and copy

Down-to-earth, short, a little warm. No buzzwords. Examples:
- Empty Today view: "Nothing on the stove. Go get a snack."
- Refresh button: "Refresh" (not "Synchronize")
- Error: "Couldn't reach Notion. Try again in a sec."

Keep UI text to plain direct verbs.

All UI text is lowercase (headings, tabs, buttons, labels, empty states, toasts). Ticket content (task titles, project names, dates, priority, phase) keeps its own casing.

---

## The cafe metaphor

Status names are a display layer only. Notion keeps its own labels.

| Canonical key | Cafe label | Matches Notion status (case-insensitive) | Meaning |
|---|---|---|---|
| `backlog` | Menu | Backlog | Someday, not committed |
| `this_week` | Order Up | This Week | Committed for this week |
| `doing` | Brewing | Doing | In progress now |
| `done` | Enjoyed | Done | Finished |

Each task renders as a small **order ticket** card: title, project chip, due date, optional priority dot and phase tag.

Projects are "tabs" or "menus" in the UI copy where it fits, but keep the word "project" in filters for clarity.

---

## Data sources

Both are Notion databases in my workspace. Use the **data source IDs** below. Before coding, check the current Notion API docs: querying databases changed around the 2025-09-03 API version (data sources). Use the current approach and pin the `Notion-Version` header.

### 1. Wander Kanban
- Data source ID: `41405125-09c4-80c1-acc9-000b03e4f2ee`
- Properties: `Name` (title), `Status` (status: Backlog, This Week, Doing, Done), `Due Date` (date), `Assignee` (person)
- No priority or phase.

### 2. Plumbob protector: to-do list
- Data source ID: `40605125-09c4-809c-adb2-000b286d021f`
- Properties: `Name` (title), `Status` (status: backlog, this week, doing, done), `Due Date` (date), `Person` (person), `Priority` (select: P1, P2, P3), `Phase` (select: Research, Build, Test, Report)

### Config file (the only place to add a source)

Create `meorisok.config.ts`:

```ts
export const sources = [
  {
    id: "wander",
    label: "Wander",
    dataSourceId: "41405125-09c4-80c1-acc9-000b03e4f2ee",
    color: "berry",           // token name from the design system
    props: { title: "Name", status: "Status", due: "Due Date" },
  },
  {
    id: "plumbob",
    label: "Plumbob protector",
    dataSourceId: "40605125-09c4-809c-adb2-000b286d021f",
    color: "matcha",
    props: {
      title: "Name", status: "Status", due: "Due Date",
      priority: "Priority", phase: "Phase",
    },
  },
] as const;
```

Optional props (`priority`, `phase`) may be missing on a source. The UI must handle that without errors.

### Normalized task shape

```ts
type Task = {
  id: string;            // Notion page id
  sourceId: string;      // from config
  title: string;
  status: "backlog" | "this_week" | "doing" | "done";
  notionStatusName: string; // original label, needed for write-back
  due: string | null;    // ISO date
  priority?: "P1" | "P2" | "P3";
  phase?: string;
  url: string;           // link back to the Notion page
};
```

Handle pagination (databases can exceed 100 rows). Unknown status labels fall back to `backlog` and log a warning.

---

## Features

### Views (top-level tabs)
1. **Today**: tasks that are Brewing, due today, or overdue (not Enjoyed). Overdue tasks get a small "late" marker. Sort by due date, then priority.
2. **This Week**: Order Up tasks plus anything due in the next 7 days. Group by day.
3. **Board**: four columns (Menu, Order Up, Brewing, Enjoyed) combining all projects. Enjoyed column shows only the last 14 days by default, with a toggle for all.

### Filters (persist in URL query params)
- Project chips (multi-select, uses the color for each source)
- Priority (only shown if any visible task has one)
- Text search on title
- On phones the filter bar folds behind a "filters" button with an active count

### Edit status back to Notion
- On the Board: drag a ticket to another column (keyboard: the grip on each ticket). Everywhere: a checkbox that moves it to Enjoyed (unchecking moves it to Order Up). No status menu on tickets.
- Optimistic update, then `PATCH` through a server route that updates the page's status property to the **exact Notion label** the source uses (e.g. `This Week` in Wander, `this week` in plumbob). Look up the label from the source's own schema, not a hardcoded string.
- If the write fails, roll back the card and show the error copy.
- Only status is editable. No other fields are writable in v1.

### Refresh
- Fetch on load. Server cache 60 seconds (`unstable_cache` or fetch revalidate). A "Refresh" button busts the cache and refetches. Show "Updated 2 min ago".

### Demo mode
- `/demo` is public and uses fake tasks from `lib/demoData.ts`. Same UI, all write-backs are local only (state in memory).
- Real data lives behind login. The demo must never call Notion.

---

## Access and security

- One password in env var `MEORISOK_PASSWORD`. Login page posts to a server route, which sets a signed, httpOnly, secure cookie (use `jose` with `SESSION_SECRET`). Cookie lasts 30 days.
- Next.js middleware protects everything except `/login`, `/demo`, `/design`, static assets.
- Simple login rate limit (in-memory is fine for one user): 5 attempts per 10 minutes per IP.
- `NOTION_TOKEN` is only read in server code. Never import the Notion client in a client component. Never return the token or raw Notion errors to the browser.
- Add `.env.example` with placeholder values and `.env.local` to `.gitignore` before the first commit.

### Env vars
```
NOTION_TOKEN=            # internal integration secret
MEORISOK_PASSWORD=
SESSION_SECRET=          # 32+ random chars
```

### One-time setup I need to do by hand (tell me exactly when)
1. Create a Notion internal integration (notion.so/profile/integrations), read content + update content, no user info needed.
2. Open each of the two databases in Notion, then "..." menu, then Connections, then add the integration. Without this the API returns 404.
3. Copy the secret into `.env.local`.
4. Create the Vercel project from the GitHub repo and paste the same env vars there.

---

## Design system

Build tokens first, then components. Put them in CSS variables (`app/tokens.css`) and map them in Tailwind. Document everything on a public `/design` page.

### Color tokens

| Token | Hex | Use |
|---|---|---|
| `--cream-50` | `#FFF9F3` | page background |
| `--cream-100` | `#FFF1E6` | cards, panels |
| `--cream-200` | `#F6E3D3` | borders, dividers |
| `--milk-pink-100` | `#FFE3EA` | soft fills, hover |
| `--milk-pink-300` | `#FFB8CA` | tags, highlights |
| `--milk-pink-500` | `#F28AA6` | primary accent, buttons |
| `--berry-600` | `#D2587E` | pressed, links |
| `--cocoa-900` | `#3B2622` | primary text |
| `--cocoa-700` | `#5B3F39` | headings on pink |
| `--cocoa-500` | `#8A6B63` | secondary text |
| `--matcha-400` | `#A9C9A4` | second project color |
| `--butter-300` | `#F7DC9A` | third project color, "late" marker |
| `--sky-300` | `#B9D8EC` | fourth project color |

Project colors cycle through berry, matcha, butter, sky. **Check contrast**: body text must pass WCAG AA (4.5:1) on its background. Adjust hexes if any pair fails and record the final values on `/design`. Dark mode is a stretch goal (phase 6), not v1.

### Type
- Display / headings: **Fraunces** (soft, warm serif), weights 600-700
- UI / body: **Nunito**, weights 400-700
- Load with `next/font`. Scale: 12 / 14 / 16 / 20 / 28 / 40.

### Shape and space
- Radius: 12px cards, 999px chips and buttons, 20px panels
- Spacing: 4px base (4, 8, 12, 16, 24, 32, 48)
- Shadow: one soft shadow, `0 2px 0 var(--cream-200)` plus a faint blur. Flat and sticker-like, not heavy.
- Order ticket: cream-100 card, dashed top border like a receipt edge, small notch cutouts on the sides (CSS radial-gradient mask).

### Motion
- 150-200ms ease-out for hover and drag. Ticket "slides onto the pass" when it lands in a column. Respect `prefers-reduced-motion`.

### Mascot
- One small original SVG: a round little cup with a face and steam. Used in the header, the empty states, and a tiny happy bounce when a task moves to Enjoyed. Keep it simple, two or three shapes, uses only palette colors. No existing characters or brands.

### Components to build (and show on /design)
Button, Chip (project, priority, phase), TaskTicket, BoardColumn, StatusMenu, ViewTabs, FilterBar, EmptyState (with mascot), Toast, Skeleton ticket, LoginCard.

---

## Project structure

```
meorisok/
  CLAUDE.md
  README.md
  meorisok.config.ts
  .env.example
  app/
    layout.tsx
    page.tsx                  # redirects to /today
    (app)/today/page.tsx
    (app)/week/page.tsx
    (app)/board/page.tsx
    login/page.tsx
    demo/                     # public, fake data
    design/page.tsx           # public design system page
    api/tasks/route.ts        # GET (cached), POST ?refresh=1
    api/tasks/[id]/status/route.ts   # PATCH
    api/login/route.ts
    tokens.css
  lib/
    notion.ts                 # server only
    normalize.ts              # Notion page to Task, status mapping
    demoData.ts
    session.ts
  components/
  middleware.ts
```

---

## Phases (do these in order, commit after each, stop and show me after phases 2 and 5)

**Phase 0: Setup.** `create-next-app` (TS, Tailwind, App Router), git init, `.gitignore`, `.env.example`, install `@notion/client` (check the current package name: `@notionhq/client`), `jose`. Confirm it runs.
- Done when: dev server loads a blank page.

**Phase 1: Design tokens + /design page.** `tokens.css`, fonts, Tailwind mapping, and a `/design` page showing colors (with contrast ratios), type, radii, spacing, and each component as I build it.
- Done when: `/design` renders the full token set and passes AA on text pairs.

**Phase 2: Components with demo data.** Build TaskTicket, chips, board columns, tabs, filters, empty states, mascot. Wire the three views to `lib/demoData.ts` at `/demo`. Drag-and-drop on Board (use `@dnd-kit/core`), local state only.
- Done when: `/demo` works end to end on desktop and phone width. **Stop and show me.**

**Phase 3: Notion read.** `lib/notion.ts`, `normalize.ts`, `GET /api/tasks` with pagination and 60s cache, refresh button. Use the real two sources through config. Handle a source failing without breaking the other (show a small banner "Plumbob protector didn't load").
- Done when: my real tasks appear in Today, This Week, and Board.

**Phase 4: Notion write.** `PATCH /api/tasks/[id]/status`, optimistic UI, rollback on failure, using the source's own status labels.
- Done when: dragging a card in the app changes the status in Notion, and the reverse shows up after Refresh.

**Phase 5: Auth.** Login page, signed cookie, middleware, rate limit. Verify `/demo` and `/design` stay public and everything else redirects to `/login`. **Stop and show me.**
- Done when: `curl` to `/api/tasks` without a cookie returns 401.

**Phase 6: Polish + deploy.** Loading skeletons, error states, reduced-motion, keyboard access for status menu, favicon from the mascot, metadata. README (what it is, screenshots, setup, how to add a source, design decisions). Deploy to Vercel and set env vars. Optional: dark mode tokens.
- Done when: the live URL works behind the password and `/demo` works publicly.

---

## Quality checks before calling anything done

- `npm run build` and `npm run lint` pass.
- No `NOTION_TOKEN` in the client bundle (search the `.next` output).
- Test a database with a missing optional property, an empty database, and a status label that isn't in the map.
- Tab through the whole UI with the keyboard.
- Check at 375px width.

## Out of scope for v1

Creating tasks, editing titles or dates, other task tools (Jira, Trello, GitHub), multi-user accounts, notifications, mobile app.

## Ideas for later

Add Jira as a second source type, a "what to do now" nudge using due date and priority, dark mode, a weekly recap card, installable PWA.

## Working style

Keep changes small and show me diffs I can follow. When there are real design choices (layout, copy, animation), give me two or three options instead of picking one silently. Plain, short commit messages.
