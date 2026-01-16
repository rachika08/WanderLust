const express=require("express");
const router=express.Router({ mergeParams: true });
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require('../schema.js');//used for server side schema validation
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn , isReviewAuthor,saveRedirectUrl}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");



// review rout-post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId",saveRedirectUrl,isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports=router;