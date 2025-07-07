
const express=require ("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userControllers = require("../controllers/user");
console.log(userControllers);


// const flash =require("connect-flash");

router.get("/signup",userControllers.renderSignupForm);

router.post("/signup",wrapAsync(userControllers.signup));


router.get("/login",userControllers.renderLoginForm);

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),
userControllers.login);


router.get("/logout",userControllers.logout)
module.exports = router;

