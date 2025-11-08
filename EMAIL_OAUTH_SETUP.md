# Email Verification & Google OAuth Setup Guide

## 🎯 Features Implemented

1. ✅ Email Verification with OTP (6-digit code)
2. ✅ Google OAuth Authentication
3. ✅ Better Error Messages on UI
4. ✅ Email notifications (Welcome emails)

---

## 📦 Step 1: Install New Dependencies

Run this command in the backend folder:

```bash
cd backend
npm install nodemailer passport passport-google-oauth20 express-session
```

---

## 📧 Step 2: Setup Gmail for Sending Emails

### Option A: Using Gmail App Password (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. Go to: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Other (Custom name)"
4. Name it "OneFlow"
5. Copy the 16-character password
6. Update `backend/.env`:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

### Option B: Using Less Secure Apps (Not Recommended)

1. Go to: https://myaccount.google.com/lesssecureapps
2. Turn ON "Allow less secure apps"
3. Update `.env` with your regular Gmail password

---

## 🔐 Step 3: Setup Google OAuth

### Create Google OAuth Credentials:

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project:**
   - Click "Select a project" → "New Project"
   - Name: "OneFlow"
   - Click "Create"

3. **Enable Google+ API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "OneFlow Web Client"
   
5. **Configure OAuth Consent Screen:**
   - User Type: External
   - App name: OneFlow
   - User support email: your-email@gmail.com
   - Developer contact: your-email@gmail.com
   - Add scopes: email, profile
   - Add test users (your email)

6. **Add Authorized Redirect URIs:**
   ```
   http://localhost:5000/api/auth/google/callback
   http://localhost:5173/auth/google/callback
   ```

7. **Copy Credentials:**
   - Copy "Client ID"
   - Copy "Client Secret"

8. **Update `backend/.env`:**
   ```env
   GOOGLE_CLIENT_ID=your-client-id-here
   GOOGLE_CLIENT_SECRET=your-client-secret-here
   ```

---

## 🗄️ Step 4: Database Migration

The User model has been updated with new fields. Restart your backend server to auto-migrate:

```bash
cd backend
npm run dev
```

New fields added:
- `isEmailVerified` (BOOLEAN)
- `emailVerificationOTP` (STRING)
- `otpExpiry` (DATE)
- `googleId` (STRING)
- `authProvider` (ENUM: 'local', 'google')

---

## 🎨 Step 5: Frontend Setup

### Add Verify Email Route

Update `frontend/src/router/AppRouter.jsx`:

```javascript
import VerifyEmail from '../pages/Auth/VerifyEmail'

// Add this route
<Route path="/verify-email" element={<VerifyEmail />} />
```

### Add Google Callback Handler

Create `frontend/src/pages/Auth/GoogleCallback.jsx`:

```javascript
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      toast.error('Google authentication failed');
      navigate('/login');
      return;
    }

    if (token) {
      localStorage.setItem('token', token);
      
      // Fetch user profile
      fetch('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            toast.success('Login successful!');
            
            const roleRoutes = {
              admin: '/admin',
              project_manager: '/pm',
              team_member: '/team',
              sales_finance: '/finance'
            };
            navigate(roleRoutes[data.user.role] || '/team');
          }
        })
        .catch(() => {
          toast.error('Failed to fetch user data');
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default GoogleCallback;
```

Add route:
```javascript
<Route path="/auth/google/callback" element={<GoogleCallback />} />
```

---

## 🧪 Step 6: Testing

### Test Email Verification:

1. **Signup:**
   - Go to http://localhost:5173/signup
   - Fill in name, email, password
   - Click "Sign Up"
   - Check your email for 6-digit code

2. **Verify:**
   - Enter the 6-digit code
   - Click "Verify Email"
   - Should redirect to dashboard

3. **Resend Code:**
   - Click "Resend Code" if needed
   - New code sent to email

### Test Google OAuth:

1. **Click "Sign up with Google"**
2. Select your Google account
3. Grant permissions
4. Should redirect to dashboard
5. Check database - user created with `authProvider='google'`

### Test Error Messages:

1. **Invalid Email:**
   - Enter invalid email format
   - See error message below field

2. **Short Password:**
   - Enter password < 6 characters
   - See error message

3. **Existing Email:**
   - Try to signup with existing email
   - See error toast

4. **Wrong OTP:**
   - Enter wrong verification code
   - See error message

5. **Expired OTP:**
   - Wait 10 minutes
   - Try to verify
   - See "expired" error

---

## 📧 Email Templates

### Verification Email:
- Beautiful HTML template
- 6-digit OTP code
- Expires in 10 minutes
- OneFlow branding

### Welcome Email:
- Sent after verification
- Lists features
- Encourages exploration

---

## 🔒 Security Features

1. **OTP Expiry:** Codes expire after 10 minutes
2. **Password Hashing:** Bcrypt with salt rounds
3. **JWT Tokens:** Secure authentication
4. **Email Verification:** Required before login
5. **Google OAuth:** Secure third-party auth
6. **Session Management:** Express sessions for OAuth

---

## 🎯 User Flow

### Local Signup Flow:
```
Signup → Email Sent → Verify OTP → Welcome Email → Dashboard
```

### Google OAuth Flow:
```
Click Google → Select Account → Grant Permission → Dashboard
```

### Login Flow:
```
Login → Check Verification → Dashboard
```

---

## 🐛 Troubleshooting

### Email Not Sending:

**Problem:** Verification email not received

**Solutions:**
1. Check spam folder
2. Verify EMAIL_USER and EMAIL_PASSWORD in .env
3. Ensure Gmail app password is correct
4. Check backend console for email errors
5. Try with different email provider

### Google OAuth Not Working:

**Problem:** Google login fails

**Solutions:**
1. Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
2. Check redirect URIs in Google Console
3. Ensure Google+ API is enabled
4. Add your email as test user
5. Clear browser cookies and try again

### OTP Expired:

**Problem:** Code expired before verification

**Solutions:**
1. Click "Resend Code"
2. Verify within 10 minutes
3. Check system time is correct

### Database Errors:

**Problem:** New fields not in database

**Solutions:**
1. Restart backend server (auto-migration)
2. Check Sequelize logs
3. Manually add columns if needed

---

## 📝 Environment Variables Checklist

Make sure your `backend/.env` has:

```env
# Email
✅ EMAIL_SERVICE=gmail
✅ EMAIL_USER=your-email@gmail.com
✅ EMAIL_PASSWORD=your-app-password

# Google OAuth
✅ GOOGLE_CLIENT_ID=your-client-id
✅ GOOGLE_CLIENT_SECRET=your-client-secret

# Session
✅ SESSION_SECRET=your-session-secret

# Frontend URL
✅ FRONTEND_URL=http://localhost:5173
```

---

## 🎨 UI Improvements

### Error Messages:
- ✅ Inline validation errors
- ✅ Toast notifications
- ✅ Color-coded messages (red=error, green=success)
- ✅ Clear error descriptions

### Loading States:
- ✅ Spinner animations
- ✅ Disabled buttons during loading
- ✅ Loading text feedback

### Form Validation:
- ✅ Real-time validation
- ✅ Clear error messages
- ✅ Field-specific errors
- ✅ Submit button disabled when invalid

---

## 🚀 Production Deployment

Before deploying:

1. **Update Environment Variables:**
   - Use production email service
   - Update FRONTEND_URL
   - Use secure SESSION_SECRET
   - Update Google OAuth redirect URIs

2. **Email Service:**
   - Consider using SendGrid, Mailgun, or AWS SES
   - Higher sending limits
   - Better deliverability

3. **Google OAuth:**
   - Add production domain to authorized URIs
   - Update consent screen
   - Remove test mode

4. **Security:**
   - Enable HTTPS
   - Secure cookies
   - Rate limiting on OTP endpoints
   - CORS configuration

---

## ✅ Features Checklist

- [x] Email verification with OTP
- [x] Resend OTP functionality
- [x] OTP expiry (10 minutes)
- [x] Google OAuth login
- [x] Google OAuth signup
- [x] Welcome email after verification
- [x] Better error messages on UI
- [x] Form validation
- [x] Loading states
- [x] Toast notifications
- [x] Inline error messages
- [x] Password requirements
- [x] Email format validation
- [x] Prevent duplicate signups
- [x] Auth provider tracking
- [x] Session management

---

## 📞 Support

If you encounter issues:
1. Check backend console logs
2. Check browser console
3. Verify all environment variables
4. Test email sending separately
5. Test Google OAuth separately

---

**All features are implemented and ready to use!** 🎉

Just configure your email and Google OAuth credentials, and you're good to go!
