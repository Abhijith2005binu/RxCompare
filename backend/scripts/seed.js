require("dotenv").config();
const connectDB = require("../config/db");
const Medicine = require("../models/Medicine");
const Store = require("../models/Store");
const User = require("../models/User");
const medicines = require("../data/medicines.seed");
const stores = require("../data/stores.seed");

async function run() {
  await connectDB();

  console.log("[seed] clearing existing collections...");
  await Medicine.deleteMany({});
  await Store.deleteMany({});
  await User.deleteMany({});

  console.log(`[seed] inserting ${medicines.length} medicines...`);
  const insertedMeds = await Medicine.insertMany(medicines);

  console.log(`[seed] inserting ${stores.length} stores...`);
  await Store.insertMany(stores);

  console.log("[seed] creating default admin and demo user accounts...");
  const admin = new User({
    name: "Dr. A. Verma (Admin)",
    email: "admin@rxcompare.org",
    password: "Admin@123",
    role: "admin",
  });
  await admin.save();

  const patient = new User({
    name: "Ramesh Sharma",
    email: "patient@rxcompare.org",
    password: "Patient@123",
    role: "user",
    savedMedicines: [insertedMeds[0]._id, insertedMeds[1]._id],
  });
  await patient.save();

  console.log("[seed] default accounts created:");
  console.log("  - Admin: admin@rxcompare.org / Admin@123");
  console.log("  - Patient: patient@rxcompare.org / Patient@123");
  console.log("[seed] done.");
  process.exit(0);
}

run().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});
