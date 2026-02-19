# DNS Resolution Issue - Troubleshooting Guide

## Problem
Your backend cannot resolve the AIVEN MySQL hostname: `mysql-1e7e9ff6-veeranagouda961-b54a.i.aivencloud.com`

**Error:** `getaddrinfo ENOTFOUND`

## Root Cause
DNS resolution is failing - even Google DNS (8.8.8.8) and Cloudflare DNS (1.1.1.1) cannot resolve this hostname.

## Solutions (Try in Order)

### Solution 1: Verify AIVEN Service Status ⭐ MOST IMPORTANT
1. Go to your **AIVEN Console** (https://console.aiven.io)
2. Find your MySQL service
3. **Check if the service is RUNNING** (not paused/stopped)
4. If paused, click **"Resume"** or **"Start"**
5. Wait 2-3 minutes for DNS to propagate
6. Restart your backend: `npm start`

### Solution 2: Flush DNS Cache (Windows)
Open PowerShell as Administrator and run:
```powershell
ipconfig /flushdns
ipconfig /registerdns
```

Then restart your backend.

### Solution 3: Change DNS Servers
1. Open **Network Settings** → **Change adapter options**
2. Right-click your network adapter → **Properties**
3. Select **Internet Protocol Version 4 (TCP/IPv4)** → **Properties**
4. Select **"Use the following DNS server addresses"**
5. Enter:
   - **Preferred:** `8.8.8.8` (Google DNS)
   - **Alternate:** `1.1.1.1` (Cloudflare DNS)
6. Click **OK** and restart your computer
7. Try again: `npm start`

### Solution 4: Use VPN
If your network/ISP is blocking AIVEN domains:
1. Connect to a VPN
2. Restart backend: `npm start`

### Solution 5: Check Firewall/Antivirus
1. Temporarily disable Windows Firewall
2. Temporarily disable antivirus
3. Try connecting again
4. If it works, add exception for Node.js and port 22400

### Solution 6: Verify Hostname in AIVEN Console
1. Go to AIVEN Console → Your MySQL Service
2. Click **"Connection information"**
3. **Copy the exact Host value** (should match your .env)
4. Update `backend/.env` if different:
   ```
   DB_HOST=<exact_hostname_from_console>
   ```

### Solution 7: Test Connection from AIVEN Console
1. In AIVEN Console, try the **"Test connection"** button
2. If it fails there too, the service might be down
3. Contact AIVEN support if needed

## Quick Test Commands

### Test DNS Resolution:
```powershell
cd C:\Users\VEERANAGOUDA\OneDrive\Desktop\KodBank\backend
node test-dns.js
```

### Test Backend Connection:
```powershell
cd C:\Users\VEERANAGOUDA\OneDrive\Desktop\KodBank\backend
npm start
```

Look for: `✅ Connected to AIVEN MySQL database`

## Expected Behavior After Fix

When DNS resolves correctly, you should see:
```
✅ Connected to AIVEN MySQL database
📦 Creating tables...
✅ Table kodusers created
✅ Table CJWT created
✅ Database initialization complete!
🚀 Server running on http://localhost:5000
```

## Still Not Working?

If none of the above works:
1. **Check AIVEN service status** - This is the #1 cause
2. Try creating a **new AIVEN MySQL service** (if old one is corrupted)
3. Contact **AIVEN Support** - They can check if DNS records exist
4. Check **AIVEN Status Page** - https://status.aiven.io
