require("dotenv").config();  // ⬅️ This must be before any use of process.env
console.log("ATLAS_KEY:", process.env.ATLAS_KEY);  // Debug print

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const dbURL = process.env.ATLAS_KEY;

if (!dbURL) {
  console.error("❌ Error: ATLAS_KEY is undefined. Check your .env file.");
  process.exit(1);
}

// Database Connection
async function main() {
  try {
    await mongoose.connect(dbURL);
    console.log("✅ MongoDB connection established");

    // Initialize DB
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
      ...obj,
      owner: "6862837e86feaacb479aa39f",
    }));
    await Listing.insertMany(initData.data);
    console.log("✅ Database seeded with initial data");
    
    process.exit(0); // Exit successfully
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1); // Exit with error
  }
}

main();
