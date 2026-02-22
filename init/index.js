require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const dbURL = process.env.ATLAS_KEY;

if (!dbURL) {
  console.error("❌ Error: ATLAS_KEY is undefined. Check your .env file.");
  process.exit(1);
}

async function main() {
  try {
    await mongoose.connect(dbURL);
    console.log("✅ MongoDB connection established");

    await Listing.deleteMany({});
    console.log("✅ Cleared existing listings");

    const listings = initData.data.map((obj) => ({
      ...obj,
      image: {
        url: obj.image.url,
        filename: obj.image.filename || "listingimage"
      }
    }));

    await Listing.insertMany(listings);
    console.log(`✅ Database seeded with ${listings.length} listings`);
    
    await mongoose.connection.close();
    console.log("✅ Database connection closed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

main();
