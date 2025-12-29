const transporter = require("../config/email");

// Send Booking Confirmation Email
const sendBookingConfirmation = async (booking, user, listing) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || "WonderPlace <noreply@wonderplace.com>",
        to: user.email,
        subject: "Booking Confirmation - WonderPlace",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #fe424f 0%, #ff6b6b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .total { font-size: 20px; font-weight: bold; color: #fe424f; }
                    .button { display: inline-block; background: #fe424f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Booking Confirmed!</h1>
                        <p>Your reservation at ${listing.title} is confirmed</p>
                    </div>
                    <div class="content">
                        <p>Hi ${user.username},</p>
                        <p>Great news! Your booking has been confirmed. We're excited for your upcoming stay!</p>
                        
                        <div class="booking-details">
                            <h3>Booking Details</h3>
                            <div class="detail-row">
                                <span>Property:</span>
                                <strong>${listing.title}</strong>
                            </div>
                            <div class="detail-row">
                                <span>Location:</span>
                                <span>${listing.location}, ${listing.country}</span>
                            </div>
                            <div class="detail-row">
                                <span>Check-in:</span>
                                <strong>${new Date(booking.checkIn).toLocaleDateString('en-IN', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'})}</strong>
                            </div>
                            <div class="detail-row">
                                <span>Check-out:</span>
                                <strong>${new Date(booking.checkOut).toLocaleDateString('en-IN', {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'})}</strong>
                            </div>
                            <div class="detail-row">
                                <span>Guests:</span>
                                <span>${booking.guests}</span>
                            </div>
                            <div class="detail-row">
                                <span>Nights:</span>
                                <span>${booking.numberOfNights}</span>
                            </div>
                            <div class="detail-row">
                                <span>Booking ID:</span>
                                <span>${booking._id}</span>
                            </div>
                            <div class="detail-row" style="border: none; margin-top: 15px;">
                                <span style="font-size: 18px;">Total Amount:</span>
                                <span class="total">₹${booking.totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <p><strong>What's Next?</strong></p>
                        <ul>
                            <li>You'll receive payment details shortly</li>
                            <li>The host has been notified of your booking</li>
                            <li>Save this email for your records</li>
                        </ul>

                        <center>
                            <a href="${process.env.BASE_URL || 'http://localhost:8080'}/bookings/${booking._id}" class="button">View Booking</a>
                        </center>

                        <p>If you have any questions, feel free to contact us.</p>
                        <p>Safe travels!<br>The WonderPlace Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 WonderPlace. All rights reserved.</p>
                        <p>This is an automated email, please do not reply.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Booking confirmation email sent to:", user.email);
    } catch (error) {
        console.error("Error sending booking confirmation email:", error);
    }
};

// Send Welcome Email
const sendWelcomeEmail = async (user) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || "WonderPlace <noreply@wonderplace.com>",
        to: user.email,
        subject: "Welcome to WonderPlace! 🎉",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #fe424f 0%, #ff6b6b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; background: #fe424f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to WonderPlace! 🏡</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${user.username},</p>
                        <p>Thank you for joining WonderPlace! We're thrilled to have you as part of our community.</p>
                        
                        <p><strong>What you can do:</strong></p>
                        <ul>
                            <li>Explore thousands of unique properties</li>
                            <li>Book your perfect stay with confidence</li>
                            <li>List your own property and earn money</li>
                            <li>Connect with travelers and hosts worldwide</li>
                        </ul>

                        <center>
                            <a href="${process.env.BASE_URL || 'http://localhost:8080'}/listings" class="button">Start Exploring</a>
                        </center>

                        <p>If you have any questions, we're here to help!</p>
                        <p>Happy travels!<br>The WonderPlace Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 WonderPlace. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Welcome email sent to:", user.email);
    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
};

// Send Payment Confirmation Email
const sendPaymentConfirmation = async (booking, user, listing, payment) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || "WonderPlace <noreply@wonderplace.com>",
        to: user.email,
        subject: "Payment Received - WonderPlace",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #28a745 0%, #34ce57 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .invoice { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
                    .total { font-size: 20px; font-weight: bold; color: #28a745; }
                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Payment Successful!</h1>
                        <p>Your payment has been received</p>
                    </div>
                    <div class="content">
                        <p>Hi ${user.username},</p>
                        <p>Thank you! Your payment has been successfully processed.</p>
                        
                        <div class="invoice">
                            <h3>Payment Receipt</h3>
                            <div class="detail-row">
                                <span>Payment ID:</span>
                                <strong>${payment.razorpay_payment_id}</strong>
                            </div>
                            <div class="detail-row">
                                <span>Booking ID:</span>
                                <span>${booking._id}</span>
                            </div>
                            <div class="detail-row">
                                <span>Property:</span>
                                <strong>${listing.title}</strong>
                            </div>
                            <div class="detail-row">
                                <span>Check-in:</span>
                                <span>${new Date(booking.checkIn).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div class="detail-row">
                                <span>Check-out:</span>
                                <span>${new Date(booking.checkOut).toLocaleDateString('en-IN')}</span>
                            </div>
                            <div class="detail-row" style="border: none; margin-top: 15px;">
                                <span style="font-size: 18px;">Amount Paid:</span>
                                <span class="total">₹${booking.totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <p>Your booking is now confirmed and you're all set for your stay!</p>
                        <p>Have a wonderful trip!<br>The WonderPlace Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 WonderPlace. All rights reserved.</p>
                        <p>Keep this email for your records.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Payment confirmation email sent to:", user.email);
    } catch (error) {
        console.error("Error sending payment confirmation email:", error);
    }
};

// Send Cancellation Email
const sendCancellationEmail = async (booking, user, listing) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || "WonderPlace <noreply@wonderplace.com>",
        to: user.email,
        subject: "Booking Cancelled - WonderPlace",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; background: #fe424f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Booking Cancelled</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${user.username},</p>
                        <p>Your booking for <strong>${listing.title}</strong> has been cancelled.</p>
                        
                        <p><strong>Cancelled Booking Details:</strong></p>
                        <ul>
                            <li>Booking ID: ${booking._id}</li>
                            <li>Check-in: ${new Date(booking.checkIn).toLocaleDateString('en-IN')}</li>
                            <li>Check-out: ${new Date(booking.checkOut).toLocaleDateString('en-IN')}</li>
                        </ul>

                        <p>If payment was made, refunds will be processed according to our cancellation policy.</p>

                        <center>
                            <a href="${process.env.BASE_URL || 'http://localhost:8080'}/listings" class="button">Browse Other Listings</a>
                        </center>

                        <p>We hope to see you again soon!<br>The WonderPlace Team</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 WonderPlace. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Cancellation email sent to:", user.email);
    } catch (error) {
        console.error("Error sending cancellation email:", error);
    }
};

module.exports = {
    sendBookingConfirmation,
    sendWelcomeEmail,
    sendPaymentConfirmation,
    sendCancellationEmail
};
