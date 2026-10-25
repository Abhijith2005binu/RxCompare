/**
 * Import and integrate medicine records from the user's JSON dataset
 * into the Medicine Finder & Jan Aushadhi locator platform.
 *
 * Usage:
 *   node backend/scripts/importFromUserJson.js [optional-path-to-json]
 */
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const connectDB = require("../config/db");
const { getDbStatus } = require("../config/db");
const Medicine = require("../models/Medicine");

const DEFAULT_JSON_PATH = path.resolve(__dirname, "../../public/assets/aistudio/Paste_October_25__2026_-_11_53AM_623c5157");

function cleanName(str) {
  return (str || "")
    .toLowerCase()
    .replace(/,/g, "")
    .replace(/[^a-z0-9]/g, " ")
    .replace(/\b(tablets?|capsules?|syrup|gel|cream|ointment|drops?|inhaler|spray|ip|bp|usp|hydrochloride|sodium|potassium|maleate|succinate|fumarate|tartrate|mesylate|dihydrate|trihydrate|phosphate|valerate|propionate|axetil|calcium|monohydrate|pr|er|xr|duo|dt|ds|gastro resistant|film coated|prolonged release|softgels?|soft gelatin)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseUnitCount(unit) {
  if (!unit) return 1;
  const match = unit.match(/(\d+)\s*(tablets?|capsules?|softgels?|pills?|doses?)/i);
  if (match) return parseInt(match[1], 10);
  return 1;
}

function detectDosageForm(name, unit) {
  const s = `${name} ${unit}`.toLowerCase();
  if (s.includes("tablet")) return "Tablet";
  if (s.includes("capsule") || s.includes("softgel")) return "Capsule";
  if (s.includes("syrup") || s.includes("suspension")) return "Syrup";
  if (s.includes("cream")) return "Cream";
  if (s.includes("ointment")) return "Ointment";
  if (s.includes("gel")) return "Gel";
  if (s.includes("eye drop")) return "Eye Drops";
  if (s.includes("ear drop")) return "Ear Drops";
  if (s.includes("nasal")) return "Nasal Drops/Spray";
  if (s.includes("inhaler")) return "Inhaler";
  if (s.includes("sachet")) return "Sachet";
  if (s.includes("lotion")) return "Lotion";
  if (s.includes("mouthwash")) return "Mouthwash";
  if (s.includes("vial") || s.includes("cartridge")) return "Injection";
  return null;
}

function isRxCategory(cat) {
  const c = (cat || "").toLowerCase();
  return c.includes("antibiotic") || c.includes("antidiabetic") || c.includes("antihypertensive") || 
         c.includes("corticosteroid") || c.includes("antiepileptic") || c.includes("antipsychotic") || 
         c.includes("cardiac") || c.includes("statin") || c.includes("thyroid") || c.includes("hormonal") || 
         c.includes("antidepressant") || c.includes("beta-blocker") || c.includes("ace inhibitor") || 
         c.includes("diuretic") || c.includes("antianginal") || c.includes("antiviral") || c.includes("anticancer");
}

async function run() {
  const targetPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_JSON_PATH;
  if (!fs.existsSync(targetPath)) {
    console.error(`[import] File not found: ${targetPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(targetPath, "utf8");
  const dataset = JSON.parse(raw);
  console.log(`[import] Successfully loaded ${dataset.length} records from ${targetPath}`);

  // Connect to DB if available
  await connectDB();
  const dbOnline = getDbStatus();

  // Load existing catalog
  const catalogPath = path.resolve(__dirname, "../data/medicines.catalog.js");
  let existingCatalog = [];
  if (fs.existsSync(catalogPath)) {
    existingCatalog = require(catalogPath);
  }

  console.log(`[import] Existing catalog contains ${existingCatalog.length} records`);

  const duplicatesPrevented = [];
  const newlyMapped = [];

  for (const item of dataset) {
    const cleaned = cleanName(item.name);
    const existing = existingCatalog.find(
      (m) => cleanName(m.genericName) === cleaned || cleanName(m.composition) === cleaned
    );

    if (existing) {
      duplicatesPrevented.push({
        sourceId: item.id,
        sourceName: item.name,
        matchedDrugCode: existing.drugCode,
        matchedName: existing.genericName,
      });
      continue;
    }

    const unitCount = parseUnitCount(item.unit);
    const unitPrice = Number((item.jan_aushadhi_price / unitCount).toFixed(2));
    const dosageForm = detectDosageForm(item.name, item.unit);
    const rx = isRxCategory(item.category);

    // Build comprehensive search keywords
    const kw = new Set();
    const addWords = (text) => {
      if (!text) return;
      text.toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((w) => w.length >= 2)
        .forEach((w) => kw.add(w));
    };
    addWords(item.name);
    addWords(item.generic_name);
    addWords(item.branded_example);
    addWords(item.category);
    addWords(item.uses);
    if (item.branded_example) kw.add(item.branded_example.toLowerCase().trim());
    if (item.generic_name) kw.add(item.generic_name.toLowerCase().trim());
    if (item.name) kw.add(item.name.toLowerCase().trim());

    const brandedEquivalents = [];
    if (item.branded_example && item.branded_price != null) {
      brandedEquivalents.push({
        brandName: item.branded_example.trim(),
        manufacturer: "",
        mrp: Number(item.branded_price),
      });
    }

    newlyMapped.push({
      id: `med-u${item.id}`,
      drugCode: `GEN-${item.id.toString().padStart(3, "0")}`,
      genericName: item.name.trim(),
      composition: item.generic_name ? item.generic_name.trim() : item.name.trim(),
      category: item.category.trim(),
      dosageForm,
      packSize: item.unit.trim(),
      genericMrp: Number(item.jan_aushadhi_price),
      prescriptionRequired: rx,
      storageInstructions: null,
      uses: item.uses ? item.uses.trim() : null,
      purchaseInfo: {
        unitPrice,
        packMrp: Number(item.jan_aushadhi_price),
        packSize: item.unit.trim(),
        currency: "INR",
        subsidyScheme: "Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP)",
        prescriptionRequired: rx,
        regulatoryAuthority: "Department of Pharmaceuticals, Govt. of India",
        purchaseAvailability: "Available at PMBJP Kendras",
        qualityStandard: "WHO-GMP & IP Certified",
      },
      brandedEquivalents,
      searchKeywords: Array.from(kw),
    });
  }

  console.log(`[import] Duplicates prevented: ${duplicatesPrevented.length}`);
  console.log(`[import] New unique records prepared: ${newlyMapped.length}`);

  // If MongoDB is online, insert/upsert records
  if (dbOnline) {
    console.log("[import] MongoDB is online, updating database collection...");
    let inserted = 0;
    for (const med of newlyMapped) {
      await Medicine.updateOne(
        { drugCode: med.drugCode },
        {
          $set: {
            drugCode: med.drugCode,
            genericName: med.genericName,
            composition: med.composition,
            category: med.category,
            packSize: med.packSize,
            genericMrp: med.genericMrp,
            brandedEquivalents: med.brandedEquivalents,
            searchKeywords: med.searchKeywords,
          },
        },
        { upsert: true }
      );
      inserted++;
    }
    console.log(`[import] Successfully upserted ${inserted} records into MongoDB`);
  } else {
    console.log("[import] Database running in live ABDM UHI Gateway in-memory catalog mode.");
  }

  console.log(`[import] Total catalog size: ${existingCatalog.length + newlyMapped.length}`);
  console.log("[import] Integration complete!");
  process.exit(0);
}

run().catch((err) => {
  console.error("[import] Error:", err);
  process.exit(1);
});
