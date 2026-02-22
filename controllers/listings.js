const Listing = require("../models/listing.js");

module.exports.index = async (req, res, next) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.searchListing = async (req, res) => {
  const { place } = req.query;

  if (!place || place.trim() === "") {
    req.flash("error", "Please enter the place");
    return res.redirect("/listings");
  }

  const listings = await Listing.find({ title: { $regex: place, $options: "i" } });

  if (listings.length === 0) 
    {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/index.ejs", { allListings: listings });
};

module.exports.renderNew = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing Not Found !");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res) => {
  const listingData = req.body.listing;
  const url = req.file.path;
  const filename = req.file.filename;
  const newListing = new Listing(listingData);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Added !");
  res.redirect("/listings");
};

module.exports.renderEdit = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing Not Found !");
    return res.redirect("/listings");
  }

  const originalImage = listing.image.url.replace("/upload", "/upload/w_250/h_300");
  res.render("listings/edit.ejs", { listing, originalImage });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing.owner._id.equals(res.locals.curr._id)) {
    req.flash("error", "You are not authenticated to do this operation!");
    return res.redirect(`/listings/${id}`);
  }

  const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

  if (req.file) {
    const url = req.file.path;
    const filename = req.file.filename;
    updatedListing.image = { url, filename };
    await updatedListing.save();
  }

  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "Not authorized to delete this listing");
    return res.redirect(`/listings/${id}`);
  }

  await listing.deleteOne();
  req.flash("success", "Listing Deleted !");
  res.redirect("/listings");
};
