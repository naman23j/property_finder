const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/booking");
// Create booking without payment
router.post("/listings/:id/book-direct", isLoggedIn, wrapAsync(bookingController.createBookingDirect));
// Create payment order
router.post("/listings/:id/book", isLoggedIn, wrapAsync(bookingController.createOrder));

// Verify payment and create booking
router.post("/bookings/verify-payment", isLoggedIn, wrapAsync(bookingController.verifyPayment));

// Show single booking
router.get("/bookings/:id", isLoggedIn, wrapAsync(bookingController.showBooking));

// User's all bookings
router.get("/bookings", isLoggedIn, wrapAsync(bookingController.userBookings));

// Cancel booking
router.put("/bookings/:id/cancel", isLoggedIn, wrapAsync(bookingController.cancelBooking));

// Listing bookings (for owner)
router.get("/listings/:id/bookings", isLoggedIn, wrapAsync(bookingController.listingBookings));

module.exports = router;
