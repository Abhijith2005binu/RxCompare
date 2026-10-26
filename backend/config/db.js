const mongoose = require("mongoose");

let isConnected = false;

const DEFAULT_URI = "mongodb+srv://abhijithedayate779_db_user:ktzb9i8zkotQWOKq@cluster0.l4ibnky.mongodb.net/";//"mongodb://127.0.0.1:27017/rxcompare";

async function connectDB({ required = true } = {}) {
  const uri = process.env.MONGO_URI || DEFAULT_URI;

  mongoose.set("bufferCommands", false);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 20000 });
    isConnected = true;
    console.log(`[db] connected -> ${uri}`);
    return true;
  } catch (err) {
    isConnected = false;
    console.error(`[db] connection failed (${err.message})`);
    if (required) throw err;
    return false;
  }
}

function getDbStatus() {
  return isConnected && mongoose.connection.readyState === 1;
}

/**
 * Guard for routes that cannot work without the database.
 */
function requireDb(_req, res, next) {
  if (!getDbStatus()) {
    return res.status(503).json({
      success: false,
      error: "Database unavailable. Please start MongoDB and try again.",
    });
  }
  next();
}

module.exports = connectDB;
module.exports.getDbStatus = getDbStatus;
module.exports.requireDb = requireDb;
module.exports.DEFAULT_URI = DEFAULT_URI;
