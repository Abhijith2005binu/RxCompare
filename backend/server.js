require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const medicineRoutes = require("./routes/medicines");
const storeRoutes = require("./routes/stores");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/medicines", medicineRoutes);
app.use("/api/stores", storeRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`[server] listening on http://localhost:${PORT}`));
});
