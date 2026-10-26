# RxCompare

> **Prescription-to-Generic Medicine Price Comparator & Live Jan Aushadhi Kendra Stock Finder**
> Aligned with **UN Sustainable Development Goal 3: Good Health & Well-Being**
> Modelled on the **ABDM / UHI (Ayushman Bharat Digital Mission – Unified Health Interface)** protocol

RxCompare is a MongoDB-backed web application. A user types a **branded** medicine name from their prescription; the app finds the generic equivalent, shows purchase details (subsidised generic MRP, pack size, prescription requirement, branded market comparisons and the saving), and locates nearby **Jan Aushadhi Kendras** with live stock.

Customers can order medicines, subscribe to restock alerts, and track orders. Medical shop owners can register their Kendra (including pinning the exact shop location on a map), verify their email, and manage inventory once an administrator approves the application.

**Stack:** Express.js · MongoDB / Mongoose · Node.js · Vite (vanilla JavaScript UI) · Nodemailer · Leaflet / OpenStreetMap · JWT auth in an httpOnly cookie

---

## Project Layout

```
RxCompare/
├── backend/
│   ├── config/               MongoDB connection + status helpers
│   ├── data/                 Seed data (medicines source + Kendra records)
│   ├── middleware/           Auth guards, validation, logging, error handling
│   ├── models/               User, Kendra, KendraApplication, Medicine, Inventory,
│   │                         Order, StockAlert, Counter
│   ├── routes/               /api/auth, /api/medicines, /api/stores, dashboard APIs
│   ├── scripts/seed.js       Seeds catalog, users, Kendras, inventory, orders, alerts
│   ├── services/             UHI gateway, dashboards, Nodemailer email
│   ├── utils/                JWT helpers, verification tokens, Haversine distance
│   └── server.js             Express app + SPA fallback
├── frontend/
│   ├── src/
│   │   ├── api.js            Cookie-aware API client
│   │   ├── main.js           Router, auth flows, map picker, dashboards, cart
│   │   └── style.css         Design system (light + dark themes)
│   └── index.html            Single-page app views
├── .env.example              Environment template
├── package.json              Root workspace runner
└── README.md
```

---

## Quick Start

### 1. Prerequisites

- **Node.js** v18+
- **MongoDB Atlas** cluster (or a local MongoDB 8.x instance for offline development)
- A modern browser (Leaflet and OpenStreetMap tiles require internet access)

Install the workspace dependencies from the repository root:

```bash
npm install
```

### 2. Configure the environment

Copy `.env.example` to `.env` in the repository root and adjust if needed:

```bash
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/rxcompare?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-string
APP_URL=http://localhost:3000

ADMIN_NAME=Dr. Rajesh Varma
ADMIN_EMAIL=admin@rxcompare.gov.in
ADMIN_PASSWORD=Admin@12345
ADMIN_DESIGNATION=Chief PMBJP Network Administrator

# Leave SMTP_* blank to use Nodemailer's automatic Ethereal test inbox.
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM="Jan Aushadhi RxCompare <no-reply@rxcompare.gov.in>"
```

- With blank `SMTP_*` values, Nodemailer creates an Ethereal inbox and prints a preview URL.
- The verification link is **always** printed to the server console, so development works without an inbox.
- The server refuses to start if MongoDB is unreachable.

### 3. Seed the database

```bash
npm run seed
```

This resets the RxCompare collections and seeds the medicine catalog, 12 Jan Aushadhi Kendras, per-Kendra inventory, demo accounts, orders and a stock alert.

### 4. Run the app

```bash
npm run dev
```

- Frontend + API: **http://localhost:3000**
- The root script builds the Vite app, then starts Express on port `3000`. Express serves `frontend/dist` and falls back to `index.html` for SPA routes such as `/login`, `/owner-login` and `/register`.

To run the two workspaces separately:

```bash
cd backend && npm run dev      # nodemon, port 3000
cd frontend && npm run dev     # Vite dev server on 5173, /api proxied to 3000
```

---

## Accounts & Authentication

### Seeded demo accounts

| Role | Email | Password | State |
|---|---|---|---|
| Customer | `ramesh.sharma@gmail.com` | `Customer@123` | Active, verified |
| Customer | `priya.nair@example.com` | `Customer@123` | Active, verified |
| Kendra owner | `parel.kendra@pmbjp.in` | `Owner@123` | Approved (`PMBJK02001`) |
| Kendra owner | `anita.kendra@pmbjp.in` | `Owner@123` | Email verified, awaiting admin approval |
| Kendra owner | `debashis.pharma@gmail.com` | `Owner@123` | Email verified, awaiting admin approval |

### Kendra owner login

Owners use the dedicated owner entry point at `/owner-login`, or the **Kendra Owner** tab on the public `/login` page. The site header and footer link directly to it. After sign-in, owners are routed to the Kendra Portal at `/kendra`; pending owners see their application status there.

### Dedicated administrator login

The administrator is **hardcoded from environment variables**, not stored in MongoDB. The admin sign-in page exists **only** at:

```
http://localhost:3000/admin-login
```

Default credentials:

```
admin@rxcompare.gov.in / Admin@12345
```

- There is no admin link anywhere in the public navigation.
- The public `/login` page rejects the admin email with `ADMIN_URL_REQUIRED`.
- Admin sessions are JWT payloads with `role: "admin"` and `sub: "admin"`.

### Registration and verification flow

1. **Customer** registers at `/register` → an unverified user row is created → a Nodemailer verification email is sent.
2. **Kendra owner** registers at `/register` → user + `KendraApplication` rows are created in `awaiting_verification`, including `location.lat` / `location.lng` from the map picker.
3. Following the emailed link opens `/verify-email?token=...` → `POST /api/auth/verify-email` marks the user verified. Owner applications move to `pending`.
4. Sign-in compares the password against the bcrypt hash in MongoDB on every attempt. Registration passwords must be at least 8 characters and include an uppercase letter, a lowercase letter, a number and a special character (enforced in the browser and by the API).
5. An administrator approves the application at `/admin`, which creates/activates the `Kendra`, seeds its inventory rows and activates the owner account. The decision is committed before optional inventory seeding and email delivery.
6. Approved owners manage stock, per-Kendra prices, categories and orders at `/kendra`; customers use `/account` for orders and restock alerts.

JWTs are stored in the httpOnly `rx_token` cookie with a 7-day lifetime. Passwords are hashed with bcrypt.

### Email configuration

- Blank `SMTP_*` → Ethereal test account; the API returns `emailPreviewUrl` outside production.
- Provide `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` to send through a real mailbox.
- Non-production registration and resend responses also include `devVerificationUrl`, and the link is logged to the console.

---

## API Reference

All responses are JSON. Protected endpoints require the `rx_token` cookie (or an `Authorization: Bearer <token>` header) and return `401` when unauthenticated or `403` when the role is wrong.

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register/customer` | Public | Create a customer account and send verification email |
| `POST` | `/api/auth/register/kendra` | Public | Create a Kendra owner + application (requires `lat`/`lng`) |
| `POST` | `/api/auth/verify-email` | Public | Verify an email token (`{ token }`) |
| `POST` | `/api/auth/resend-verification` | Public | Send a fresh verification link |
| `POST` | `/api/auth/login` | Public | Customer / Kendra owner sign-in |
| `POST` | `/api/auth/admin-login` | Public | Hardcoded administrator sign-in |
| `POST` | `/api/auth/logout` | Public | Clear the auth cookie |
| `GET` | `/api/auth/me` | Session | Current user profile |

Error codes the UI handles: `EMAIL_EXISTS`, `EMAIL_EXISTS_UNVERIFIED`, `EMAIL_NOT_VERIFIED`, `KENDRA_REJECTED`, `ADMIN_URL_REQUIRED`, `TOKEN_INVALID`.

### Medicines (`/api/medicines`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/medicines/search?q={term}` | Public | Search generic name, brand, composition, category, drug code, keywords |
| `GET` | `/api/medicines` | Public | Full generic catalog |
| `GET` | `/api/medicines/:id` | Public | One medicine by stable id / drug code |
| `GET` | `/api/medicines/:id/kendras?lat=&lng=&inStockOnly=&city=&limit=` | Public | Kendras stocking a medicine with live units and distance |
| `POST` | `/api/medicines` | Admin | Create a medicine |
| `PUT` | `/api/medicines/:id` | Admin | Update a medicine |
| `DELETE` | `/api/medicines/:id` | Admin | Delete a medicine |

### Stores (`/api/stores`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/stores` | Public | All active Jan Aushadhi Kendras |
| `GET` | `/api/stores/nearby?lat=&lng=&limit=&medicineId=&inStockOnly=&city=` | Public | Nearest Kendras (Haversine) |
| `GET` | `/api/stores/:id` | Public | Single Kendra by `kendraCode` |
| `POST` | `/api/stores` | Admin | Manually create a Kendra |

### Dashboards, orders and alerts

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | Admin | Network KPIs |
| `GET` | `/api/admin/applications?status=` | Admin | Kendra applications (`awaiting_verification` hidden by default) |
| `POST` | `/api/admin/applications/:id/approve` | Admin | Approve application and activate Kendra |
| `POST` | `/api/admin/applications/:id/reject` | Admin | Reject application (`{ reason }`) |
| `GET` | `/api/admin/orders` | Admin | All network orders |
| `GET` | `/api/admin/users?role=` | Admin | Registered customers / Kendra owners |
| `DELETE` | `/api/admin/users/:id` | Admin | Delete an account (owner deletion also removes their Kendra, inventory and alerts) |
| `GET` | `/api/kendra/inventory/:kendraCode` | Owner (own) / Admin | Catalog joined with live stock, categories and selling price |
| `PUT` | `/api/kendra/inventory/:kendraCode/:medicineId` | Owner (own) / Admin | Update units, stock flag and per-Kendra price |
| `POST` | `/api/kendra/inventory/:kendraCode` | Owner (own) / Admin | Add a medicine formulation (new categories allowed) |
| `GET` | `/api/kendra/orders/:kendraCode` | Owner (own) / Admin | Orders for one Kendra |
| `PUT` | `/api/kendra/orders/:orderId/status` | Owner (own) / Admin | `placed → confirmed → ready → completed` (or `cancelled`) |
| `POST` | `/api/orders/quote` | Customer | Price a cart, compare all active Kendras and return the best-price option |
| `POST` | `/api/orders` | Customer | Place an order (stock is validated against MongoDB first) |
| `GET` | `/api/orders/my` | Customer | Signed-in customer's orders |
| `POST` | `/api/stock-alerts` | Customer | Subscribe to an out-of-stock alert |
| `GET` | `/api/stock-alerts/my` | Customer | Signed-in customer's alerts |

Health and network status: `GET /api/health` and `GET /api/uhi/status`.

---

## Data Model

- **User** — name, email (unique), bcrypt `passwordHash`, role (`customer` / `kendra_owner`), phone, address, status, `emailVerified`, verification token hash/expiry, `kendraCode`, `kendraName`.
- **Kendra** — `kendraCode` (public id), store details, `location.lat/lng`, status (`active` / suspended).
- **KendraApplication** — owner application lifecycle: `awaiting_verification` → `pending` → `approved` / `rejected`, license and address details, map coordinates.
- **Medicine** — stable public `id` (e.g. `med-001`), `drugCode`, generic name, composition, category, pack, generic MRP, branded equivalents, purchase info.
- **Inventory** — per-Kendra stock keyed by `kendraCode` + `medicineId`, units, batch, expiry and an optional per-Kendra selling `price` (falls back to the catalog generic MRP).
- **Order** — `orderNumber` (e.g. `ORD-9404`), customer snapshot, Kendra snapshot, items, totals, payment and status history.
- **StockAlert** — customer restock subscription; flipping a Kendra stock row back to in-stock marks matching alerts `notified`.
- **Counter** — atomic sequence for order numbers.

---

## Architecture Highlights

1. **MongoDB is the source of truth.** Medicines, Kendras, inventory, users, applications, orders and alerts are all persisted and queried — there is no in-memory fallback.
2. **Role-based isolation.** `requireRole` and `requireKendraAccess` prevent an owner from reading or mutating another Kendra's inventory and orders.
3. **Server-side identity.** Orders and alerts take the customer identity from the session, not from the browser payload.
4. **Request logging, validation and centralised errors.** `middleware/logger.js`, `middleware/validate.js` and `middleware/errorHandler.js` provide consistent `400` / `404` / `409` / `500` responses.
5. **Geospatial search without paid APIs.** `utils/geo.js` computes Haversine distance; Leaflet + OpenStreetMap are used only for the shop-location picker and address lookup (Nominatim).
6. **Single-service deployment.** `npm run dev` builds the SPA and serves it from Express, including the `/admin-login` route.

---

## Security Notes

- Admin credentials live in `.env`; commit only `.env.example`.
- Admin authentication is intentionally separate from the user database and only reachable at `/admin-login`.
- Cookies are `httpOnly` and `sameSite=lax`; `secure` is enabled when `NODE_ENV=production`.
- Verification tokens are stored hashed and expire after 24 hours.
- Replace the default `JWT_SECRET` and admin password before deploying.
