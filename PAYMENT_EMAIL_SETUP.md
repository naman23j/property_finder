# Payment & Email Setup Guide

## 🔐 Razorpay Setup (Payment Gateway)

### Step 1: Create Razorpay Account
1. Go to https://razorpay.com/
2. Click "Sign Up" and create an account
3. Complete the KYC verification (for production)

### Step 2: Get API Keys
1. Login to Razorpay Dashboard: https://dashboard.razorpay.com/
2. Go to Settings → API Keys
3. Click "Generate Test Keys" or "Generate Live Keys"
4. Copy both:
   - Key ID
   - Key Secret

### Step 3: Add Keys to .env
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
```

**Note:** Use test keys for development, live keys for production

---

## 📧 Email Setup (Gmail)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Security → 2-Step Verification
3. Turn it ON

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and your device
3. Click "Generate"
4. Copy the 16-character password

### Step 3: Add to .env
```env
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_FROM=WonderPlace <noreply@wonderplace.com>
BASE_URL=http://localhost:8080
```

---

## ✅ Testing

### Test Payment:
1. Use Razorpay test cards:
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date
   - Name: Any name

2. Test flow:
   - Select a listing
   - Fill booking form
   - Click "Reserve"
   - Complete payment with test card
   - Check email for confirmation

### Test Email:
1. Sign up with a real email address
2. Check inbox for welcome email
3. Make a booking and check for booking confirmation
4. Cancel a booking and check for cancellation email

---

## 🚀 Going Live

### Razorpay:
1. Complete KYC verification
2. Switch to LIVE keys in .env
3. Update webhook URLs (for payment callbacks)

### Email:
1. Consider using professional SMTP services:
   - SendGrid
   - Amazon SES
   - Mailgun
2. Use custom domain email for better delivery

---

## 📝 Features Implemented

✅ **Payment Integration:**
- Razorpay payment gateway
- Secure payment verification
- Order creation and tracking
- Payment status in bookings

✅ **Email Notifications:**
- Welcome email on signup
- Booking confirmation email
- Payment confirmation email
- Cancellation email
- Beautiful HTML email templates

---

## ⚠️ Important Notes

1. **Never commit .env file** to Git
2. **Keep API keys secret**
3. **Test thoroughly** before going live
4. **Use HTTPS** in production for Razorpay
5. **Monitor email deliverability**

---

## 🐛 Troubleshooting

### Payment not working:
- Check Razorpay keys are correct
- Ensure NODE_ENV is set properly
- Check browser console for errors
- Verify Razorpay account is active

### Emails not sending:
- Verify Gmail app password
- Check spam folder
- Ensure 2FA is enabled
- Try different email provider if Gmail blocks

---

## 📞 Support

- Razorpay Docs: https://razorpay.com/docs/
- Nodemailer Docs: https://nodemailer.com/
- Gmail App Passwords: https://support.google.com/accounts/answer/185833
