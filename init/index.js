const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// Use Atlas URL from environment or fallback to local
require("dotenv").config({ path: "../.env" });
const MONGO_DB = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/WonderPlace";

main()
  .then(() => {
    console.log("✅ Connected to database:", MONGO_DB.includes('mongodb.net') ? 'Atlas' : 'Local');
  })
  .catch((err) => {
    console.log("❌ Connection failed:", err);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(MONGO_DB);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
...obj,
owner:"67edff0ec068534534669a68",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
    process.exit(0);
  } catch (err) {
    console.error("Error initializing database:", err);
    process.exit(1);
  }
};

initDB();