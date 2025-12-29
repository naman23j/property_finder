const Booking = require("../models/booking");
const Listing = require("../models/listing");

// Create a new booking
module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, guests } = req.body;
    
    const listing = await Listing.findById(id);
    
    // Calculate number of nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
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
        status: "confirmed"
    });
    
    await booking.save();
    
    req.flash("success", "Booking confirmed successfully!");
    res.redirect(`/bookings/${booking._id}`);
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
    const booking = await Booking.findById(id);
    
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
    
    req.flash("success", "Booking cancelled successfully!");
    res.redirect("/bookings");
};
