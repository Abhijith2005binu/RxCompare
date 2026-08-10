/**
 * SAMPLE seed data — 16 common formulations, enough to demo full search →
 * compare → save-amount flow end to end.
 *
 * genericMrp values are approximate PMBJP/Jan Aushadhi MRPs pulled from
 * public JAS price references. brandedEquivalents MRPs are approximate
 * market prices for well-known brands of the same molecule/pack size,
 * pulled from public price comparisons (not live/scraped).
 *
 * >>> REPLACE THIS FILE before submission/deployment. <<<
 * Real generic price + drug code data: data.gov.in dataset
 *   "Janaushadhi Product List with MRP" (search that title on data.gov.in),
 *   or the live PMBJP product list at https://janaushadhi.gov.in
 * Real branded MRPs aren't in one government dataset — pair the generic
 * list with NPPA's Scheduled/Non-Scheduled formulation price data, or a
 * manually curated CSV of the brand names your report will feature.
 *
 * See scripts/importFromCsv.js for a loader that replaces this file with
 * the actual downloaded CSV once you have it.
 */

module.exports = [
  {
    drugCode: "JA0001",
    genericName: "Paracetamol 500mg",
    composition: "Paracetamol 500mg",
    category: "Pain Relief",
    packSize: "15 tablets",
    genericMrp: 8.5,
    brandedEquivalents: [
      { brandName: "Crocin 500", manufacturer: "GSK", mrp: 28 },
      { brandName: "Dolo 650 (650mg, comparable line)", manufacturer: "Micro Labs", mrp: 32 },
      { brandName: "Calpol", manufacturer: "GSK", mrp: 26 },
    ],
    searchKeywords: ["crocin", "dolo", "calpol", "paracetamol", "fever tablet"],
  },
  {
    drugCode: "JA0002",
    genericName: "Atorvastatin 10mg",
    composition: "Atorvastatin Calcium 10mg",
    category: "Cardiac",
    packSize: "10 tablets",
    genericMrp: 8.5,
    brandedEquivalents: [
      { brandName: "Atorva 10", manufacturer: "Zydus", mrp: 95 },
      { brandName: "Storvas 10", manufacturer: "Sun Pharma", mrp: 118 },
      { brandName: "Lipitor 10", manufacturer: "Pfizer", mrp: 152 },
    ],
    searchKeywords: ["atorva", "storvas", "lipitor", "atorvastatin", "cholesterol tablet"],
  },
  {
    drugCode: "JA0003",
    genericName: "Atorvastatin 20mg",
    composition: "Atorvastatin Calcium 20mg",
    category: "Cardiac",
    packSize: "10 tablets",
    genericMrp: 15,
    brandedEquivalents: [
      { brandName: "Atorva 20", manufacturer: "Zydus", mrp: 145 },
      { brandName: "Storvas 20", manufacturer: "Sun Pharma", mrp: 212 },
    ],
    searchKeywords: ["atorva 20", "storvas 20", "atorvastatin 20"],
  },
  {
    drugCode: "JA0004",
    genericName: "Metformin 500mg",
    composition: "Metformin Hydrochloride 500mg",
    category: "Diabetes",
    packSize: "20 tablets",
    genericMrp: 12,
    brandedEquivalents: [
      { brandName: "Glycomet 500", manufacturer: "USV", mrp: 40 },
      { brandName: "Glucophage 500", manufacturer: "Merck", mrp: 65 },
    ],
    searchKeywords: ["glycomet", "glucophage", "metformin", "diabetes tablet"],
  },
  {
    drugCode: "JA0005",
    genericName: "Amlodipine 5mg",
    composition: "Amlodipine Besylate 5mg",
    category: "Cardiac",
    packSize: "10 tablets",
    genericMrp: 6,
    brandedEquivalents: [
      { brandName: "Amlong 5", manufacturer: "Micro Labs", mrp: 38 },
      { brandName: "Norvasc 5", manufacturer: "Pfizer", mrp: 55 },
    ],
    searchKeywords: ["amlong", "norvasc", "amlodipine", "bp tablet"],
  },
  {
    drugCode: "JA0006",
    genericName: "Azithromycin 500mg",
    composition: "Azithromycin 500mg",
    category: "Antibiotic",
    packSize: "3 tablets",
    genericMrp: 11.5,
    brandedEquivalents: [
      { brandName: "Azithral 500", manufacturer: "Alembic", mrp: 92 },
      { brandName: "Zithromax 500", manufacturer: "Pfizer", mrp: 132 },
    ],
    searchKeywords: ["azithral", "zithromax", "azithromycin", "antibiotic"],
  },
  {
    drugCode: "JA0007",
    genericName: "Pantoprazole 40mg",
    composition: "Pantoprazole Sodium 40mg",
    category: "Gastro",
    packSize: "10 tablets",
    genericMrp: 9,
    brandedEquivalents: [
      { brandName: "Pantop 40", manufacturer: "Aristo", mrp: 55 },
      { brandName: "Pan 40", manufacturer: "Alkem", mrp: 62 },
    ],
    searchKeywords: ["pantop", "pan 40", "pantoprazole", "acidity tablet"],
  },
  {
    drugCode: "JA0008",
    genericName: "Telmisartan 40mg",
    composition: "Telmisartan 40mg",
    category: "Cardiac",
    packSize: "10 tablets",
    genericMrp: 18,
    brandedEquivalents: [
      { brandName: "Telma 40", manufacturer: "Glenmark", mrp: 108 },
      { brandName: "Cresar 40", manufacturer: "Torrent", mrp: 112 },
    ],
    searchKeywords: ["telma", "cresar", "telmisartan", "bp tablet"],
  },
  {
    drugCode: "JA0009",
    genericName: "Omeprazole 20mg",
    composition: "Omeprazole 20mg",
    category: "Gastro",
    packSize: "10 capsules",
    genericMrp: 7,
    brandedEquivalents: [
      { brandName: "Omez 20", manufacturer: "Dr. Reddy's", mrp: 42 },
      { brandName: "Prilosec 20", manufacturer: "AstraZeneca", mrp: 95 },
    ],
    searchKeywords: ["omez", "prilosec", "omeprazole", "acidity capsule"],
  },
  {
    drugCode: "JA0010",
    genericName: "Amoxicillin 500mg",
    composition: "Amoxicillin Trihydrate 500mg",
    category: "Antibiotic",
    packSize: "10 capsules",
    genericMrp: 15,
    brandedEquivalents: [
      { brandName: "Mox 500", manufacturer: "Ranbaxy", mrp: 65 },
      { brandName: "Novamox 500", manufacturer: "Cipla", mrp: 72 },
    ],
    searchKeywords: ["mox", "novamox", "amoxicillin", "antibiotic capsule"],
  },
  {
    drugCode: "JA0011",
    genericName: "Cefuroxime Axetil 500mg",
    composition: "Cefuroxime Axetil 500mg",
    category: "Antibiotic",
    packSize: "10 tablets",
    genericMrp: 128.86,
    brandedEquivalents: [
      { brandName: "Zinnat 500", manufacturer: "GSK", mrp: 500 },
      { brandName: "Ceftum 500", manufacturer: "GSK", mrp: 480 },
    ],
    searchKeywords: ["zinnat", "ceftum", "cefuroxime", "antibiotic"],
  },
  {
    drugCode: "JA0012",
    genericName: "Losartan Potassium 50mg",
    composition: "Losartan Potassium 50mg",
    category: "Cardiac",
    packSize: "10 tablets",
    genericMrp: 10,
    brandedEquivalents: [
      { brandName: "Losar 50", manufacturer: "Unichem", mrp: 68 },
      { brandName: "Covance 50", manufacturer: "Torrent", mrp: 72 },
    ],
    searchKeywords: ["losar", "covance", "losartan", "bp tablet"],
  },
  {
    drugCode: "JA0013",
    genericName: "Cetirizine 10mg",
    composition: "Cetirizine Hydrochloride 10mg",
    category: "Allergy",
    packSize: "10 tablets",
    genericMrp: 3.5,
    brandedEquivalents: [
      { brandName: "Cetrizine (Cipla)", manufacturer: "Cipla", mrp: 20 },
      { brandName: "Zyrtec 10", manufacturer: "GSK", mrp: 35 },
    ],
    searchKeywords: ["zyrtec", "cetirizine", "allergy tablet"],
  },
  {
    drugCode: "JA0014",
    genericName: "Metoprolol Succinate 25mg",
    composition: "Metoprolol Succinate ER 25mg",
    category: "Cardiac",
    packSize: "10 tablets",
    genericMrp: 9,
    brandedEquivalents: [
      { brandName: "Metolar XL 25", manufacturer: "Sun Pharma", mrp: 58 },
      { brandName: "Betaloc 25", manufacturer: "AstraZeneca", mrp: 62 },
    ],
    searchKeywords: ["metolar", "betaloc", "metoprolol", "heart tablet"],
  },
  {
    drugCode: "JA0015",
    genericName: "Glimepiride 2mg",
    composition: "Glimepiride 2mg",
    category: "Diabetes",
    packSize: "10 tablets",
    genericMrp: 6.5,
    brandedEquivalents: [
      { brandName: "Amaryl 2", manufacturer: "Sanofi", mrp: 62 },
      { brandName: "Glimestar 2", manufacturer: "Mankind", mrp: 45 },
    ],
    searchKeywords: ["amaryl", "glimestar", "glimepiride", "diabetes tablet"],
  },
  {
    drugCode: "JA0016",
    genericName: "Alprazolam 0.25mg",
    composition: "Alprazolam 0.25mg",
    category: "Neuro/Psychiatric",
    packSize: "10 tablets",
    genericMrp: 4,
    brandedEquivalents: [
      { brandName: "Alprax 0.25", manufacturer: "Torrent", mrp: 18 },
      { brandName: "Restyl 0.25", manufacturer: "Sun Pharma", mrp: 20 },
    ],
    searchKeywords: ["alprax", "restyl", "alprazolam", "anxiety tablet"],
  },
];
