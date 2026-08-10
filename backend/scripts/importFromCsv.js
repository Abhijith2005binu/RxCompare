/**
 * Import the REAL Jan Aushadhi / PMBJP generic price list downloaded from
 * data.gov.in into the Medicine collection.
 *
 * Usage:
 *   node scripts/importFromCsv.js /path/to/janaushadhi-price-list.csv
 *
 * Expected/likely CSV columns (data.gov.in exports vary slightly by
 * release — open the CSV first and adjust the COLUMN_MAP below to match
 * the actual header names in your download):
 *   Drug Code, Generic Name, Unit Size, MRP, Group
 *
 * This script only populates the generic side (drugCode, genericName,
 * composition, packSize, genericMrp, category). It does NOT set
 * brandedEquivalents, because the government generic list has no branded
 * data — after importing, run scripts/attachBrands.js (or edit records
 * directly) to add brand name + MRP pairs for the molecules you want to
 * demo, using NPPA data or a manually curated CSV of brand MRPs.
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const connectDB = require("../config/db");
const Medicine = require("../models/Medicine");

// Adjust these keys to match your actual CSV header row exactly.
const COLUMN_MAP = {
  drugCode: "Drug Code",
  genericName: "Generic Name",
  packSize: "Unit Size",
  genericMrp: "MRP",
  category: "Group",
};

async function run() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: node scripts/importFromCsv.js <path-to-csv>");
    process.exit(1);
  }

  const raw = fs.readFileSync(path.resolve(csvPath), "utf8");
  const records = parse(raw, { columns: true, skip_empty_lines: true, trim: true });

  console.log(`[import] parsed ${records.length} rows from ${csvPath}`);

  await connectDB();

  let upserted = 0;
  let skipped = 0;

  for (const row of records) {
    const drugCode = row[COLUMN_MAP.drugCode];
    const genericName = row[COLUMN_MAP.genericName];
    const genericMrp = parseFloat(row[COLUMN_MAP.genericMrp]);

    if (!drugCode || !genericName || Number.isNaN(genericMrp)) {
      skipped++;
      continue;
    }

    await Medicine.updateOne(
      { drugCode },
      {
        $set: {
          drugCode,
          genericName,
          composition: genericName,
          packSize: row[COLUMN_MAP.packSize] || "N/A",
          genericMrp,
          category: row[COLUMN_MAP.category] || "Uncategorized",
        },
        $setOnInsert: { brandedEquivalents: [], searchKeywords: [] },
      },
      { upsert: true }
    );
    upserted++;
  }

  console.log(`[import] upserted ${upserted}, skipped ${skipped} malformed rows.`);
  console.log("[import] Now add brandedEquivalents for the medicines you want to demo.");
  process.exit(0);
}

run().catch((err) => {
  console.error("[import] failed:", err);
  process.exit(1);
});
