# ✅ Vercel Environment Variables Checklist

**Go to:** Vercel Dashboard → Your Project → Settings → Environment Variables

## 🔴 CRITICAL (MUST HAVE - or deployment will crash)

```bash
ATLASDB_URL=mongodb+srv://namandangi05_db_user:fTXIPfROYbvAXnUs@cluster0easytrip.vcb5cmq.mongodb.net/WonderPlace?retryWrites=true&w=majority

SECRET=your_random_secret_key_here

NODE_ENV=production
```

## 🟡 Cloudinary (Required if uploading images)

```bash
CLOUD_NAME=di69b7uim
CLOUD_API_KEY=354445566185194
CLOUD_API_SECRET=_aqPT0M03fxyK8-4E-c9FSqWKfQ
```

## 🟢 Email (Required for booking notifications)

```bash
EMAIL_USER=namandangi05@gmail.com
EMAIL_PASS=gjcupvarlazzuqgf
EMAIL_FROM=EasyStay <noreply@easystay.com>
```

## 🔵 Razorpay (Optional for now - can use test mode)

```bash
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 🔵 BASE_URL (Add after first deployment)

```bash
BASE_URL=https://your-app-name.vercel.app
```

---

## 📝 MongoDB Atlas Network Access

**Go to:** MongoDB Atlas → Network Access → Add IP Address

**Add:** `0.0.0.0/0` (Allow from anywhere)

⚠️ **This is CRITICAL** - without this, Vercel cannot connect to your database

---

## 🧪 Test Your Deployment

After deployment, test these URLs:

1. **Health Check:** `https://your-app.vercel.app/api/health`
   - Should return: `{"status":"OK","database":"Connected"}`

2. **Home Page:** `https://your-app.vercel.app/`
   - Should load without errors

---

## 🔍 If Still Failing - Get Logs

1. Go to: **Vercel Dashboard → Deployments**
2. Click your latest deployment
3. Click **Functions** tab
4. Find error in logs (red text)
5. Copy ONE error line and send it to me

**Common errors:**
- `MongoServerError: bad auth` → Wrong database password
- `MongooseError: Operation buffering timed out` → IP not whitelisted
- `Cannot read property 'X' of undefined` → Missing env variable
- `ECONNREFUSED` → Wrong ATLASDB_URL format
