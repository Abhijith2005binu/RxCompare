const mongoose = require("mongoose");

let isConnected = false;

async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rxcompare";
  try {
    mongoose.set("bufferCommands", false);
    // Attempt connection with a short timeout so boot is fast if DB is offline
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    isConnected = true;
    console.log(`[db] connected -> ${uri}`);
  } catch (err) {
    isConnected = false;
    console.log(`[db] local database offline (${err.message}) -> Running on live ABDM / UHI Gateway Engine`);
  }
}

function getDbStatus() {
  return isConnected;
}

module.exports = connectDB;
module.exports.getDbStatus = getDbStatus;

