# MySQL Setup Guide for OneFlow

## Current Issue: Access Denied Error

Your MySQL root user requires a password. Here's how to fix it:

---

## Solution 1: Find Your MySQL Password

### If using XAMPP:
1. Open XAMPP Control Panel
2. Check if MySQL is running (should show green "Running")
3. Default XAMPP password is usually **empty** or **root**

### If using WAMP:
1. Default password is usually **empty** or **root**

### If you installed MySQL separately:
- You set a password during installation
- Try to remember what you entered

---

## Solution 2: Set/Reset MySQL Password

### Method A: Using XAMPP Shell

1. Open XAMPP Control Panel
2. Click "Shell" button
3. Run these commands:

```bash
mysql -u root
```

If that works (no password), set a new password:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;
EXIT;
```

### Method B: Using phpMyAdmin

1. Start Apache and MySQL in XAMPP
2. Open browser: http://localhost/phpmyadmin
3. If it opens, your password is empty or "root"
4. Go to "User accounts" → "root" → "Change password"

### Method C: Try Common Passwords

Update your `.env` file and try these common passwords:

```env
DB_PASSWORD=
DB_PASSWORD=root
DB_PASSWORD=admin
DB_PASSWORD=password
```

---

## Solution 3: Create New MySQL User

Instead of using root, create a new user:

1. Open phpMyAdmin or MySQL command line
2. Run:

```sql
CREATE USER 'oneflow'@'localhost' IDENTIFIED BY 'oneflow123';
GRANT ALL PRIVILEGES ON *.* TO 'oneflow'@'localhost';
FLUSH PRIVILEGES;
```

3. Update your `.env`:
```env
DB_USER=oneflow
DB_PASSWORD=oneflow123
```

---

## Quick Test Commands

After updating `.env`, test the connection:

```bash
npm run test-db
```

If successful, create the database:

```bash
npm run setup-db
```

Then start the server:

```bash
npm start
```

---

## Still Having Issues?

### Check if MySQL is Running:

**Windows Services:**
1. Press `Win + R`
2. Type `services.msc`
3. Look for "MySQL" service
4. Make sure it's "Running"

**XAMPP Control Panel:**
- MySQL should show green "Running" status

### Check MySQL Port:

Open Command Prompt and run:
```bash
netstat -ano | findstr :3306
```

If nothing shows, MySQL is not running on port 3306.

---

## Need More Help?

1. **What MySQL tool are you using?**
   - XAMPP
   - WAMP
   - MySQL Workbench
   - Standalone MySQL

2. **Can you access phpMyAdmin?**
   - Try: http://localhost/phpmyadmin
   - If yes, password is likely empty or "root"

3. **Try MySQL command line:**
   ```bash
   mysql -u root -p
   ```
   Then try different passwords when prompted

---

## Once Connected Successfully:

Your `.env` should look like:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=oneflow_db
DB_USER=root
DB_PASSWORD=your_actual_password

JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
```

Then run:
```bash
npm run test-db
npm run setup-db
npm start
```
