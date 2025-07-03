const Listing = require("../models/listing.js");
const Review= require("../models/review.js");

module.exports.addReview=async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  const newReview = new Review(req.body.review);
  newReview.author=req.user._id;

  listing.reviews.push(newReview); 
  await newReview.save();
  await listing.save();
  req.flash("success","New Review Added !");
  res.redirect(`/listings/${id}`);

};

module.exports.destroyReview=async(req,res)=>{
  let {id , reviewId}=req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  req.flash("success","Review Deleted !");
  res.redirect(`/listings/${id}`);
};