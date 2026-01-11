const nodemailer = require("nodemailer");

// Create transporter only if credentials are available
let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Verify transporter (non-blocking)
    transporter.verify(function (error, success) {
        if (error) {
            console.error("⚠️  Email transporter error:", error.message);
        } else {
            console.log("✅ Email server is ready to send messages");
        }
    });
} else {
    console.warn("⚠️  Email not configured - EMAIL_USER or EMAIL_PASS missing. Email features will be disabled.");
}

module.exports = transporter;
