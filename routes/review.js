const express= require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema }= require("../schema.js");
// const Review = require("../models/review.js");
// const Listing = require("../models/listing.js");
const reviewControllers = require("../controllers/review.js");

const validateReview =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
 
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}

// const {
//     validateReview,
//     isLoggedIn,
//     isReviewAuthor,} = require("../middleware.js");
//     console.log("isLoggedIn:", isLoggedIn);
// console.log("validateReview:", validateReview);



//reviews
router.post("/",
    // isLoggedIn,
    // validateReview,
    wrapAsync(reviewControllers.createReview));

//review delete route
router.delete("/:reviewId",
    // isLoggedIn,
    // isReviewAuthor,
    wrapAsync(reviewControllers.destroyReview));

module.exports = router;