const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_DB = "mongodb://127.0.0.1:27017/WonderPlace";

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
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