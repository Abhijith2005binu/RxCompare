
## RxCompare

Prescription-to-Generic Medicine Price Comparator — SDG 3 (Good Health & Well-Being).

A user types a **branded** medicine name from their prescription; the app finds the
**Jan Aushadhi generic equivalent**, shows the price gap, and lists the nearest
Jan Aushadhi Kendra from a static seeded store list.

Stack: MongoDB · Express · React (Vite) · Node — plain JavaScript, no TypeScript.

```
jan-aushadhi-comparator/
├── backend/     Express API + Mongoose models + seed/import scripts
└── frontend/    React (Vite) single-page app
```

## Quick start

**1. Backend**
```bash
cd backend
cp .env.example .env        # edit MONGO_URI if not using local default
npm install
npm run seed                # loads sample medicines + stores into MongoDB
npm run dev                 # http://localhost:5000
```

**2. Frontend** (separate terminal)
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

The Vite dev server proxies `/api/*` to `http://localhost:5000`, so no CORS
config is needed locally.

## API

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/medicines/search?q=crocin` | Search by brand name, generic name, or composition |
| GET | `/api/medicines` | Full catalog |
| GET | `/api/medicines/:id` | One medicine with all branded equivalents |
| GET | `/api/stores` | Full static store list |
| GET | `/api/stores/nearby?lat=..&lng=..&limit=5` | Nearest stores, Haversine distance, computed in-app |

## About the seed data — read before your demo/report

`backend/data/medicines.seed.js` ships with **16 sample formulations**
(Paracetamol, Atorvastatin, Metformin, Azithromycin, etc.) so the app is
demoable immediately. The generic MRPs are approximate figures pulled from
public Jan Aushadhi price references, and the branded MRPs are approximate
market prices for well-known brands of the same molecule — they are **not**
a live scrape and will drift from current prices.

`backend/data/stores.seed.js` ships with 10 sample Kerala Kendra entries,
coordinates approximate — swap in verified addresses before submission.

### Swapping in the real data.gov.in dataset

1. Go to data.gov.in and search **"Janaushadhi"** or **"PMBJP price list"** —
   the Ministry of Chemicals & Fertilizers publishes the generic product +
   MRP list as a downloadable CSV. (You can also pull the live list from
   `janaushadhi.gov.in`'s product list page.)
2. Open the CSV once and check its actual column headers — data.gov.in
   exports vary by release.
3. Update `COLUMN_MAP` at the top of `backend/scripts/importFromCsv.js` to
   match those headers.
4. Run:
   ```bash
   cd backend
   node scripts/importFromCsv.js /path/to/downloaded.csv
   ```
   This upserts every row into the `Medicine` collection by `drugCode`.
5. That government list only contains the **generic** side (no branded
   prices). Add `brandedEquivalents` for whichever molecules you want to
   feature — either edit `Medicine` documents directly in MongoDB Compass /
   `mongosh`, or extend the importer with a second curated CSV of brand
   name + MRP pairs (NPPA's price data is a reasonable source).
6. For the store list, use the PMBJP Kendra locator on `janaushadhi.gov.in`
   to pull verified addresses + coordinates for whichever district(s) your
   report covers, and replace `backend/data/stores.seed.js`.

## Why this angle, for your report

Most student health projects are trackers (symptom logs, medication
reminders). This is a **cost-comparison decision tool**: it turns a
prescription's brand name directly into "here's the government-subsidised
identical drug, here's how much you save, here's where to buy it" — closing
the gap between the Jan Aushadhi scheme existing and people actually using
it. Out-of-pocket medicine spend is one of the largest drivers of health-
related financial hardship in India, and JAS generics are frequently sold at
a small fraction of branded prices for the same molecule, so a lookup tool
like this has direct, immediate utility rather than being a monitoring
dashboard nobody opens twice.

## Suggested next steps (v2 ideas)

- OCR/text extraction from an uploaded prescription photo to pre-fill the search box
- Multi-drug "prescription basket" — total savings across an entire prescription
- Filter Kendra list by state/district instead of geolocation only
- Admin route to manage `brandedEquivalents` without touching MongoDB directly
