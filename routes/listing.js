// routes/listing.js
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isAllowed, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index & Create Listing
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// Search
router.get("/search", wrapAsync(listingController.searchListing));

// New Listing Form
router.get("/new", isLoggedIn, listingController.renderNew);

// Edit Form
router.get(
  "/:id/edit",
  isLoggedIn,
  isAllowed,
  wrapAsync(listingController.renderEdit)
);

// Show / Update / Delete
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isAllowed,
    upload.single("listing[image]"), 
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isAllowed,
    wrapAsync(listingController.destroyListing)
  );

module.exports = router;

