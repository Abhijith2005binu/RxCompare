require("dotenv").config();
const connectDB = require("../config/db");
const Medicine = require("../models/Medicine");
const Store = require("../models/Store");
const medicines = require("../data/medicines.seed");
const stores = require("../data/stores.seed");

async function run() {
  await connectDB();

  console.log("[seed] clearing existing collections...");
  await Medicine.deleteMany({});
  await Store.deleteMany({});

  console.log(`[seed] inserting ${medicines.length} medicines...`);
  await Medicine.insertMany(medicines);

  console.log(`[seed] inserting ${stores.length} stores...`);
  await Store.insertMany(stores);

  console.log("[seed] done.");
  process.exit(0);
}

run().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
