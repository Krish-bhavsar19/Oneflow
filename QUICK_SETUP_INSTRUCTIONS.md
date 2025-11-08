# 🚀 Quick Setup - 5 Minutes

## Step 1: Install Dependencies (1 min)

```bash
cd backend
npm install
```

This installs:
- nodemailer (email sending)
- passport (OAuth)
- passport-google-oauth20 (Google login)
- express-session (sessions)

---

## Step 2: Setup Gmail (2 min)

### Get Gmail App Password:

1. **Go to:** https://myaccount.google.com/apppasswords
2. **Select:** Mail → Other (Custom name) → "OneFlow"
3. **Copy** the 16-character password
4. **Update** `backend/.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

**Note:** Remove spaces from app password!

---

## Step 3: Setup Google OAuth (2 min)

### Quick Setup:

1. **Go to:** https://console.cloud.google.com/
2. **Create Project:** "OneFlow"
3. **Enable API:** Search "Google+ API" → Enable
4. **Create Credentials:**
   - APIs & Services → Credentials
   - Create OAuth Client ID
   - Web application
   - Authorized redirect URIs:
     ```
     http://localhost:5000/api/auth/google/callback
     ```
5. **Copy** Client ID and Secret
6. **Update** `backend/.env`:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

## Step 4: Update Frontend Router (30 sec)

Add to `frontend/src/router/AppRouter.jsx`:

```javascript
import VerifyEmail from '../pages/Auth/VerifyEmail'

// Add this route
<Route path="/verify-email" element={<VerifyEmail />} />
```

---

## Step 5: Restart Servers (30 sec)

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## ✅ Test It!

1. **Go to:** http://localhost:5173/signup
2. **Fill form** and click "Sign Up"
3. **Check email** for 6-digit code
4. **Enter code** on verification page
5. **Done!** You're logged in

**Or click "Sign up with Google"** for instant login!

---

## 🎯 What You Get:

✅ Email verification with OTP
✅ Google OAuth login
✅ Beautiful email templates
✅ Error messages on UI
✅ Form validation
✅ Loading states
✅ Welcome emails

---

## 🐛 Quick Troubleshooting:

### Email not sending?
- Check spam folder
- Verify app password (no spaces!)
- Check backend console

### Google OAuth not working?
- Add your email as test user
- Check redirect URI matches exactly
- Wait 5 minutes for changes to propagate

### Database errors?
- Just restart backend (auto-migration)

---

## 📝 Your .env Should Look Like:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=oneflow_db
DB_USER=root
DB_PASSWORD=your-db-password

JWT_SECRET=Oneflow@123
JWT_EXPIRE=7d

SESSION_SECRET=oneflow_session_secret_key_2024

FRONTEND_URL=http://localhost:5173

EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

## 🎉 That's It!

You now have:
- ✅ Email verification
- ✅ Google OAuth
- ✅ Better error messages
- ✅ Professional UI

**Total setup time: ~5 minutes**

For detailed docs, see `EMAIL_OAUTH_SETUP.md`

**Happy coding!** 🚀
