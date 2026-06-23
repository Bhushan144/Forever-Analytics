# Forever Analytics — User Behaviour Analytics for E-Commerce

A full-stack user analytics system integrated into a real e-commerce storefront. Tracks page views, clicks, product interactions, and search queries — then visualizes everything in an admin dashboard with session timelines, product funnels, and click heatmaps.

**Live Demo:**
- 🛍️ Storefront: [forever-analytics-frontend.vercel.app](https://forever-analytics-frontend.vercel.app)  
- 📊 Admin Dashboard: [forever-analytics-admin.vercel.app](https://forever-analytics-admin.vercel.app)  
  - Login: `levi@gmail.com` / `leviSquad`

> **Note:** The e-commerce store itself (product listing, cart, auth) was built earlier as a separate project. For this assignment, I integrated a complete analytics layer on top of it. Features like place-order, payment (Razorpay), and order management are not implemented — they weren't the focus here.

---

## For Reviewers

The quickest way to evaluate:

1. **Visit the [storefront](https://forever-analytics-frontend.vercel.app)** — browse products, search, add to cart. This generates real events.
2. **Click the ADMIN button** in the navbar (or go to the [admin panel](https://forever-analytics-admin.vercel.app) directly)
3. **Login** with `levi@gmail.com` / `leviSquad`
4. **Go to the Analytics tab** — you'll see your own session, journey timeline, and heatmap data.

The tracking SDK, session stitching logic, and all 6 analytics APIs are the core of this submission.

---

## Architecture Decisions

**Session-First design** — I don't store `session_duration` in the database. It's a derived value (`end_time - start_time`) calculated on read. Storing derived state leads to data anomalies when events arrive out of order or sessions get updated.

**Lazy-loaded journeys** — The sessions table fetches only summaries. The full event timeline is loaded on-demand when you expand a row. Fetching 50K raw events to render a 10-row table would be wasteful.

**Canvas-based heatmap** — I used native HTML5 Canvas with radial gradients and `globalCompositeOperation: 'multiply'` for thermal clustering. No third-party heatmap libraries, no iframes, no screenshots. Click coordinates are stored as viewport percentages (`x_percent`, `y_percent`) so they map correctly regardless of screen size.

**Compound indexes** — `{ page_url: 1, event_type: 1 }` for heatmap queries, `{ session_id: 1 }` for journey lookups, `{ start_time: -1 }` for session listing. These are critical for dashboard performance at scale.

---

## Assumptions & Trade-offs

- **Anonymous-only analytics.** I identify visitors using a first-party cookie (`cf_visitor_id`, 365-day expiry). I considered browser fingerprinting (screen size, timezone, user agent) and built the hash, but I store it passively — it's not used for visitor deduplication. For this assignment, the goal was useful analytics, not 100% user identification accuracy.

- **No real-time websockets.** The dashboard uses manual refresh buttons. For a production system I'd add websocket push or polling, but it wasn't needed here.

- **30-minute session timeout** is hardcoded. In production this would be configurable per-site.

- **Heatmap is viewport-normalized, not page-element-aware.** Clicks are mapped to percentage coordinates on a blank canvas. This works well for showing click density patterns but doesn't overlay on the actual page layout. A production heatmap would use DOM snapshots.

- **The storefront is not feature-complete.** Place order, payment integration (Razorpay), and order tracking are not implemented. The store has working product listing, cart, search, and auth — enough to generate real analytics data.

---

## What I Built

### Client-Side Tracking (`tracker.js`)

A vanilla JS SDK that auto-tracks user interactions without any login required:

- **`page_view`** — fires on every React Router navigation
- **`click`** — global listener captures every click with normalized `x_percent`/`y_percent` viewport coordinates
- **`product_view`** — when a user lands on a product page
- **`add_to_cart`** — when they add something to cart
- **`search`** — debounced (1s) tracking of search queries

Each event includes: `event_id`, `visitor_id`, `event_type`, `page_url`, `timestamp`, and a `metadata` object with event-specific data.

**Delivery:** Events are queued in-memory, batched every 5 seconds, and flushed via `fetch`. On tab close, `navigator.sendBeacon` ensures nothing is lost. A circuit breaker drops events after 5 consecutive failures to prevent memory leaks.

### Backend (Node.js + Express)

**3 MongoDB collections:**

| Collection | Purpose |
|---|---|
| `AnalyticsEvent` | Every raw event (source of truth) |
| `AnalyticsSession` | Pre-aggregated session summaries with counters |
| `AnalyticsVisitor` | Identity records with first/last seen timestamps |

**Session stitching** happens server-side: the backend finds the visitor's most recent session and extends it if the last activity was within 30 minutes. Otherwise, a new session is created. Event-type counters are incremented in real-time on the session document so the dashboard never needs to scan raw events for totals.

**APIs:**

| Endpoint | What it does |
|---|---|
| `POST /api/tracking/events` | Ingests event batches from the SDK |
| `GET /api/analytics/overview` | Totals + avg session duration (calculated on the fly) |
| `GET /api/analytics/sessions` | Paginated session list with pre-computed duration |
| `GET /api/analytics/sessions/:id` | Raw event timeline for a single session (lazy loaded) |
| `GET /api/analytics/products` | Most viewed products + view→cart conversion rate |
| `GET /api/analytics/search` | Top search queries by volume |
| `GET /api/analytics/heatmap?page_url=/` | Click coordinates for a specific page |

### Admin Dashboard (React + Vite)

Five tabs:

1. **Overview** — metric cards (visitors, sessions, page views, clicks, avg duration)
2. **Sessions** — paginated table with expandable row → shows the full user journey as a color-coded timeline
3. **Products** — funnel performance table with view→cart conversion rates
4. **Search** — top search queries ranked by volume
5. **Heatmap** — select a page URL, see a thermal canvas of click density

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend (storefront) | React 19, React Router, Tailwind CSS 4, Vite |
| Admin dashboard | React 19, Axios, Tailwind CSS 4, Vite |
| Backend | Node.js, Express 5, Mongoose, JWT (cookie-based auth) |
| Database | MongoDB Atlas |
| Hosting | Frontend + Admin on Vercel, Backend on Render |

---

## Local Setup

```bash
# Clone
git clone https://github.com/Bhushan144/Forever-Analytics.git
cd Forever-Analytics

# Backend
cd backend
npm install
# Create .env with: MONGODB_URI, DB_NAME, JWT_SECRET_KEY, JWT_TOKEN_EXPIRY, CLOUDINARY_*, NODE_ENV=development
npm run dev

# Frontend (new terminal)
cd frontend
npm install
# Create .env with: VITE_BACKEND_URL=http://localhost:3000
npm run dev

# Admin (new terminal)
cd admin
npm install
# Create .env with: VITE_BACKEND_URL=http://localhost:3000
npm run dev
```

Seed an admin account: `node backend/seed.js` (reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from backend `.env`)

