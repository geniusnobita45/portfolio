# Backend Design Plan for Portfolio

**Goal**: Add a lightweight, maintainable backend to support dynamic functionality for the portfolio site, including:
1. Serving portfolio data (projects, skills, certificates) via a JSON API.
2. Handling the contact form submissions (email notification or storage).
3. Providing an admin endpoint to update data (optional future extension).
4. Deployable on a typical Node.js hosting platform (Vercel, Render, Railway, or self‑hosted).

---

## 1. Tech Stack
- **Runtime**: Node.js (v20) with **TypeScript** for type safety.
- **Web framework**: Express.js (lightweight, easy to extend).
- **Database**: SQLite via `better-sqlite3` (zero‑config, file‑based) – sufficient for a personal portfolio.
- **Email**: Nodemailer with a configurable SMTP transport (e.g., Gmail, SendGrid, Mailgun).
- **Static assets**: Served directly from the `public/` directory (the existing `index.html`, `styles.css`, `script.js`, images, etc.).
- **Environment**: Dotenv (`.env`) for secrets (SMTP credentials, admin token).
- **Testing**: Jest (unit tests for API routes).
- **Deployment**: Dockerfile for containerised deployment; also compatible with serverless platforms (Vercel/Netlify functions) if desired.

---

## 2. Project Structure
```
portfolio-backend/
│   package.json
│   tsconfig.json
│   .env.example
│   Dockerfile
│   README.md
│
├─ src/
│   ├─ index.ts               # Entry point – creates Express app
│   ├─ server.ts              # Starts HTTP server (port from env)
│   ├─ routes/
│   │   ├─ api.ts            # Aggregates all API routers
│   │   ├─ portfolio.ts      # GET /api/portfolio – returns JSON data
│   │   └─ contact.ts        # POST /api/contact – processes form
│   ├─ models/
│   │   ├─ db.ts             # SQLite connection & helpers
│   │   └─ contact.ts        # Optional DB schema for storing messages
│   ├─ services/
│   │   └─ mailer.ts        # Nodemailer wrapper
│   └─ middleware/
│       ├─ errorHandler.ts   # Central error handling
│       └─ auth.ts           # Simple token based admin auth (future)
│
├─ data/
│   └─ portfolio.json        # Source of static data (projects, skills...)
│
└─ public/
    ├─ index.html
    ├─ styles.css
    ├─ script.js
    └─ assets/               # images, icons, etc.
```

---

## 3. API Endpoints
| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/api/portfolio` | Returns the content of `data/portfolio.json` (projects, skills, timeline, etc.) | `{ projects: [], skills: [], certificates: [] }` |
| POST | `/api/contact` | Accepts `{ name, email, message }`. Sends an email to the site owner and optionally stores the message in SQLite. Returns `{ success: true }` or error. |
| GET | `/api/health` | Health check – returns `{ status: "ok" }`. |
| **Future** GET/POST `/api/admin/*` | Admin CRUD for portfolio data (protected by token). |

---

## 4. Database Schema (SQLite)
```sql
CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    received_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```
*We only need this table for optional persistence of contact form submissions.*

---

## 5. Environment Variables (`.env`)
```
# Server
PORT=3000
# Email (Nodemailer)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=super-secret-password
TO_EMAIL=owner@email.com            # Destination for contact form
# Optional admin token for future protected routes
ADMIN_TOKEN=xxxxxxxxxxxxxxxxxxxx
```
The repo will ship a `.env.example` with placeholders.

---

## 6. Implementation Steps
1. ✅ **Initialize repo** – `npm init -y`, add TypeScript, Express, better‑sqlite3, nodemailer, dotenv.
2. ✅ **Create folder layout** as shown above.
3. ✅ **Implement DB helper** (`src/models/db.ts`) to open a SQLite file (`data/portfolio.db`).
4. ✅ **Write API routes**:
   - ✅ `portfolio.ts` reads `data/portfolio.json` and returns it.
   - ✅ `contact.ts` validates payload, sends email via `services/mailer.ts`, inserts into DB.
5. ✅ **Add middleware** for JSON body parsing, error handling, and CORS (allow requests from same origin).
6. ✅ **Static file serving** – `app.use(express.static('public'))` to serve existing front‑end.
7. ✅ **Dockerfile** – multi‑stage build (node:lts‑alpine → copy compiled JS). Provide `docker run -p 3000:3000 -v $(pwd)/data:/app/data` command.
8. [ ] **Write unit tests** for API routes using SuperTest.
9. [ ] **Update front‑end** (optional) to fetch data from `/api/portfolio` instead of hard‑coding in HTML. For now, the back‑end can be used for the contact form only.
10. [ ] **Deploy** – push to GitHub, set up Render/ Railway/ Vercel with Dockerfile or Node build.

---

## 7. Security & Best Practices
- **Input validation**: Use `express-validator` or simple schema checks for the contact payload.
- **Rate limiting**: Apply `express-rate-limit` on `/api/contact` to prevent spam.
- **CORS**: Restrict origins to the domain where the front‑end is served.
- **Secret handling**: Never commit `.env`; add it to `.gitignore`.
- **HTTPS**: Ensure deployment platform provides TLS (most PaaS do).
- **Logging**: Minimal console logs; consider `pino` for structured logging.

---

## 8. Future Extensions (Optional)
- **Admin UI**: Small React/Vite admin panel behind `/admin` protected by token.
- **CMS integration**: Use a headless CMS (e.g., Sanity, Contentful) instead of static JSON.
- **Authentication**: JWT for admin actions.
- **Analytics**: Store page view events in SQLite or external service.
- **Server‑less**: Migrate API routes to Vercel/Netlify Functions for zero‑ops hosting.

---

## 9. Open Questions (for the user)
> [!IMPORTANT]
> 1. **Do you need persistence for contact messages** (store in DB) **or just email notifications**? just email notifications   
> 2. **Will you host the backend on a specific platform** (Docker container, Vercel serverless, Render, etc.)? render
> 3. **Do you want an admin UI now** to edit portfolio data, or will you continue editing the JSON manually?admin ui now
> 4. **Any additional API functionality** (e.g., blog posts, newsletter signup) you anticipate? no
db and memory will be stored in supabase
Please let me know your preferences so I can tailor the implementation accordingly.
