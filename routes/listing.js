const express=require ("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema }= require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn }= require("../middleware.js");
const listingControllers = require("../controllers/listing.js");
const multer  = require('multer')
const {storage}= require("../cloudConfig.js")
const upload = multer({ storage })//form ke data se files ko nikalega and uploads folder me dal dega
 

const validateListing =(req,res,next)=>{
    let {error} =listingSchema.validate(req.body);
 
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
}

router.route("/")
.get(wrapAsync(listingControllers.index))
.post(
    isLoggedIn,
    upload.single("image"),//single image upload
    validateListing,
    wrapAsync( listingControllers.createListing));

//SEARCH ROUTE
    router.get("/search", wrapAsync(listingControllers.searchListings));

//NEW ROUTE
router.get("/new",isLoggedIn,listingControllers.rendernewListing);


//SHOW ROUTE{READ IN CRUD}

router.route("/:id")
.get(wrapAsync( listingControllers.showListing))
.put( isLoggedIn,
    // isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingControllers.updateListing))
.delete(
     isLoggedIn,
     wrapAsync(listingControllers.destroyListing));

     //edit route
router.get("/:id/edit",
    isLoggedIn,
    wrapAsync(listingControllers.renderEditListing));

module.exports = router;