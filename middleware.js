const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require('./schema.js');//used for server side schema validation

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

// module.exports.saveRedirectUrl=(req,res,next)=>{
//     if(req.session.redirectUrl){
//         res.locals.redirectUrl=req.session.redirectUrl;
//     }
//     next();
// }

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.originalUrl) {
        req.session.redirectUrl = req.originalUrl;
    }
    next();
};


//edit button and delete btn will be visible but owner need to logged in to perform action
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}


module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}


module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};
