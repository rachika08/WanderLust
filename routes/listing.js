const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require('../schema.js');//used for server side schema validation
const Listing = require("../models/listing.js");
const { equal } = require("joi");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});
const listingController = require("../controllers/listings.js");

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]') ,validateListing ,wrapAsync(listingController.createListing)
    )
    

// new route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm)
)

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))



// // index route
// router.get("/", wrapAsync(listingController.index));


// // show route
// router.get("/:id", wrapAsync(listingController.showListing));
// // create route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing)
// )




// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))

// // update
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))

// // delete
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

module.exports = router;