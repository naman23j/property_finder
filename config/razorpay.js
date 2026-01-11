const Razorpay = require("razorpay");

// Only initialize Razorpay if keys are provided
// This prevents crashes on Vercel when keys aren't configured yet
let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log("✅ Razorpay initialized");
} else {
    console.warn("⚠️  Razorpay not initialized - keys not found. Payment features will be disabled.");
}

module.exports = razorpay;
