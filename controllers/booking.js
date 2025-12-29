const Booking = require("../models/booking");
const Listing = require("../models/listing");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const { sendBookingConfirmation, sendPaymentConfirmation, sendCancellationEmail } = require("../utils/emailService");

// Create booking without payment (for testing)
module.exports.createBookingDirect = async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, guests } = req.body;
    
    const listing = await Listing.findById(id);
    
    // Calculate number of nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // Check for booking conflicts
    const conflictingBooking = await Booking.findOne({
        listing: id,
        status: { $ne: 'cancelled' },
        $or: [
            // New booking starts during existing booking
            { checkIn: { $lte: checkInDate }, checkOut: { $gt: checkInDate } },
            // New booking ends during existing booking
            { checkIn: { $lt: checkOutDate }, checkOut: { $gte: checkOutDate } },
            // New booking completely contains existing booking
            { checkIn: { $gte: checkInDate }, checkOut: { $lte: checkOutDate } }
        ]
    });
    
    if (conflictingBooking) {
        req.flash("error", "These dates are already booked. Please choose different dates.");
        return res.redirect(`/listings/${id}`);
    }
    
    // Calculate total price
    const totalPrice = listing.price * numberOfNights;
    
    const booking = new Booking({
        listing: id,
        user: req.user._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: guests,
        numberOfNights: numberOfNights,
        totalPrice: totalPrice,
        status: "confirmed",
        paymentStatus: "pending"
    });
    
    await booking.save();
    
    // Send confirmation email
    await sendBookingConfirmation(booking, req.user, listing);
    
    req.flash("success", "Booking confirmed! Payment can be completed later.");
    res.redirect(`/bookings/${booking._id}`);
};

// Create Razorpay order
module.exports.createOrder = async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, guests } = req.body;
    
    const listing = await Listing.findById(id);
    
    // Calculate number of nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // Check for booking conflicts
    const conflictingBooking = await Booking.findOne({
        listing: id,
        status: { $ne: 'cancelled' },
        $or: [
            // New booking starts during existing booking
            { checkIn: { $lte: checkInDate }, checkOut: { $gt: checkInDate } },
            // New booking ends during existing booking
            { checkIn: { $lt: checkOutDate }, checkOut: { $gte: checkOutDate } },
            // New booking completely contains existing booking
            { checkIn: { $gte: checkInDate }, checkOut: { $lte: checkOutDate } }
        ]
    });
    
    if (conflictingBooking) {
        req.flash("error", "These dates are already booked. Please choose different dates.");
        return res.redirect(`/listings/${id}`);
    }
    
    // Calculate total price
    const totalPrice = listing.price * numberOfNights;
    
    // Create Razorpay order
    const options = {
        amount: totalPrice * 100, // amount in paise
        currency: "INR",
        receipt: `booking_${Date.now()}`
    };
    
    try {
        const order = await razorpay.orders.create(options);
        
        // Store booking data in session or pass to frontend
        res.render("bookings/payment", {
            order,
            listing,
            checkIn,
            checkOut,
            guests,
            numberOfNights,
            totalPrice,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error(error);
        req.flash("error", "Error creating payment order");
        res.redirect(`/listings/${id}`);
    }
};

// Verify payment and create booking
module.exports.verifyPayment = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        listing_id,
        checkIn,
        checkOut,
        guests,
        numberOfNights,
        totalPrice
    } = req.body;
    
    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");
    
    if (razorpay_signature === expectedSign) {
        // Payment is verified, create booking
        const listing = await Listing.findById(listing_id);
        
        const booking = new Booking({
            listing: listing_id,
            user: req.user._id,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            guests: guests,
            numberOfNights: numberOfNights,
            totalPrice: totalPrice,
            status: "confirmed",
            paymentStatus: "paid",
            paymentId: razorpay_payment_id
        });
        
        await booking.save();
        
        // Send confirmation email
        await sendBookingConfirmation(booking, req.user, listing);
        
        // Send payment confirmation email
        await sendPaymentConfirmation(booking, req.user, listing, {
            razorpay_payment_id,
            razorpay_order_id
        });
        
        req.flash("success", "Payment successful! Booking confirmed.");
        res.redirect(`/bookings/${booking._id}`);
    } else {
        req.flash("error", "Payment verification failed!");
        res.redirect(`/listings/${req.body.listing_id}`);
    }
};

// Show booking details
module.exports.showBooking = async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id)
        .populate("listing")
        .populate("user");
    
    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/listings");
    }
    
    res.render("bookings/show", { booking });
};

// Get all bookings for logged-in user
module.exports.userBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate("listing")
        .sort({ createdAt: -1 });
    
    res.render("bookings/index", { bookings });
};

// Get all bookings for a listing (for owner)
module.exports.listingBookings = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to view these bookings!");
        return res.redirect("/listings");
    }
    
    const bookings = await Booking.find({ listing: id })
        .populate("user")
        .sort({ createdAt: -1 });
    
    res.render("bookings/listingBookings", { bookings, listing });
};

// Cancel a booking
module.exports.cancelBooking = async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate("listing");
    
    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/bookings");
    }
    
    if (!booking.user.equals(req.user._id)) {
        req.flash("error", "You don't have permission to cancel this booking!");
        return res.redirect("/bookings");
    }
    
    booking.status = "cancelled";
    await booking.save();
    
    // Send cancellation email
    await sendCancellationEmail(booking, req.user, booking.listing);
    
    req.flash("success", "Booking cancelled successfully!");
    res.redirect("/bookings");
};
