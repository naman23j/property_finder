if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();}

const express=require ("express");
const app =express();
const mongoose =require("mongoose");
// const Listing = require("./models/listing.js");
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/WonderPlace";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate =require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema,reviewSchema }= require("./schema.js");
// const Review = require("./models/review.js");
const session =require("express-session");
const MongoStore = require('connect-mongo');
const flash =require("connect-flash");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

 async function main() {
 await mongoose.connect(dbUrl);
 };

 main()
    .then(()=>{
    console.log("✅ Connected to MongoDB:", dbUrl.includes('mongodb.net') ? 'Atlas' : 'Local');
 })
 .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    console.error("Full error:", err);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.json({ limit: "4mb" }));
app.use(express.urlencoded({extended:true, limit: "4mb"}));
app.use(methodOverride("_method"));
 app.engine("ejs",ejsMate)
 app.use(express.static(path.join(__dirname,"/public")));
 app.use(express.static("public"));



const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET || "mysecret"
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.error("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions={
    store,
    secret: process.env.SECRET || "mysecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        httpOnly:true,
        maxAge:7*24*60*60*1000,
    },
};

// Health check endpoint for debugging
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        env: process.env.NODE_ENV || "development"
    });
});

app.get("/", (req, res) => {
    res.render("home.ejs", { currUser: req.user });
});

// app.get("/",(req,res)=>{
//     res.send("hi i am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});



app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);
app.use("/",bookingRouter);


// app.get("/testingListing",async(req,res)=>{
//     let sampleListing = new Listing({
//         Title:"thre new villa",
//         description:"at sea side",
//         price:12000,
//         Location:"barisadri",
//         Country:"India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successfully done");
   
// });
// app.get("/err",(req,res)=>{
//     abcd=abcd;
// });

// app.use((err,req,res,next)=>{
//     console.log("middleware1");
//     next(err);
// });
//next(err)=express kese error ko handle krta hai ya koi custome handler aage next handle krta hai error
// app.use((err,req,res,next)=>{
//     console.log("middleware 2");
//     next(err);
// });

app.all("*",(req,res,next)=>{
next (new ExpressError (404,"page not found here!!"));
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    
    // Log error details for Vercel logs
    console.error("❌ ERROR CAUGHT:", {
        message: err.message,
        statusCode,
        stack: err.stack,
        url: req.url,
        method: req.method
    });
 
    res.status(statusCode).render("error.ejs",{message})
       // res.status(statusCode).send(message);
});

// app.use((req,res)=>{
//     res.status(404).send("page not found");
// });

// Only listen when running locally
if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
        console.log(`server is listening to port ${port}`);
    });
}

// Export for Vercel
module.exports = app;