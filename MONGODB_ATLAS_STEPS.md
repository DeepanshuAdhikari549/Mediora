# MediCompare – MongoDB Atlas Setup (Step by Step)

You need a **MongoDB database in the cloud** (free) so the backend can store hospitals, users, and bookings. Follow these steps once.

---

## Step 1: Create a MongoDB Atlas account

1. Open: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with **Google** or **Email**.
3. Complete registration (verify email if asked).

---

## Step 2: Create a free cluster

1. After login, you’ll see **“Create a deployment”** or **“Build a database”**.
2. Choose **FREE** (M0 – Shared).
3. **Provider:** keep **M10 (current)** or pick any (e.g. AWS).
4. **Region:** choose one **near you** (e.g. Mumbai, Singapore).
5. **Cluster Name:** leave default (e.g. `Cluster0`) or type `medicompare`.
6. Click **Create** / **Create deployment**.

---

## Step 3: Create a database user (username + password)

1. A popup will ask **“How would you like to authenticate?”** → choose **Username and Password**.
2. Click **Create Database User**.
3. Set:
   - **Username:** `medicompare` (or any name you like)
   - **Password:** click **Autogenerate Secure Password** and **copy** it (or set your own and remember it)
4. Click **Create User**.
5. **Save the username and password** – you’ll need them in Step 5.

---

## Step 4: Allow access from your computer (Network Access)

1. Next popup: **“Where would you like to connect from?”** → choose **My Local Environment** (or **Add My Current IP**).
2. Or click **Network Access** in the left sidebar:
   - Click **Add IP Address**.
   - Click **Allow Access from Anywhere** (adds `0.0.0.0/0`) – **OK for learning/dev only**.
   - Click **Confirm**.
3. Wait until status is **Active** (green).

---

## Step 5: Get the connection string (URI)

1. On the Atlas dashboard, click **“Database”** in the left menu.
2. Under your cluster, click **Connect**.
3. Choose **“Drivers”** (or “Connect your application”).
4. **Driver:** Node.js. Copy the connection string. It looks like:

   ```
   mongodb+srv://medicompare:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **Replace `<password>`** with the **database user password** from Step 3.  
   Example: if password is `Abc123XYZ`, the URI becomes:

   ```
   mongodb+srv://medicompare:Abc123XYZ@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

   - If the password has special characters (e.g. `#`, `@`, `%`), replace them with URL encoding:
     - `#` → `%23`
     - `@` → `%40`
     - `%` → `%25`

6. **Optional but recommended:** add the database name so all MediCompare data goes in one DB. Before `?` add `/medicompare`:

   ```
   mongodb+srv://medicompare:Abc123XYZ@cluster0.xxxxx.mongodb.net/medicompare?retryWrites=true&w=majority
   ```

   Copy this **full** string – this is your **MONGODB_URI**.

---

## Step 6: Put the keys in the backend `.env` file

1. Open this file in a text editor:

   **`C:\Users\deepa\OneDrive\Desktop\MediCompare\backend\.env`**

2. Replace the line that says `MONGODB_URI=...` with your **full** connection string (from Step 5). Example:

   ```env
   MONGODB_URI=mongodb+srv://medicompare:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/medicompare?retryWrites=true&w=majority
   ```

3. **JWT_SECRET** can stay as is for development, or set any long random string (e.g. 20+ characters). Example:

   ```env
   JWT_SECRET=my-super-secret-key-12345-change-in-production
   ```

4. Save the file.

---

## Step 7: Start the backend

1. Open **PowerShell** or **Command Prompt**.
2. Run:

   ```bash
   cd C:\Users\deepa\OneDrive\Desktop\MediCompare\backend
   npm run server
   ```

3. You should see:
   - `MongoDB Connected: ...`
   - `MediCompare API running on port 5000`

   If you see **MongoDB connection error**, check:
   - Password in URI is correct (and special characters URL-encoded).
   - Network Access in Atlas includes your IP or `0.0.0.0/0`.
   - No extra spaces in `.env` around `=`.

---

## Step 8: (Optional) Add demo data

With the backend **stopped** (Ctrl+C), run once:

```bash
cd C:\Users\deepa\OneDrive\Desktop\MediCompare\backend
npm run seed
```

Then start the backend again (`npm run server`). You can log in as:

- **Email:** admin@medicompare-demo.com  
- **Password:** admin123  

---

## Step 9: Start the frontend

In a **second** terminal:

```bash
cd C:\Users\deepa\OneDrive\Desktop\MediCompare\Frontend
npm run dev
```

Open **http://localhost:5173**. The app should load and the proxy errors should be gone.

---

## Quick checklist

| Step | What you need |
|------|----------------|
| 1 | MongoDB Atlas account (free) |
| 2 | Free cluster created |
| 3 | Database user **username** and **password** |
| 4 | Network Access: your IP or “Allow from anywhere” |
| 5 | **Connection string** with `<password>` replaced and optional `/medicompare` |
| 6 | **backend\.env** updated: `MONGODB_URI=...` and `JWT_SECRET=...` |
| 7 | Backend: `npm run server` → “MongoDB Connected” |
| 8 | (Optional) `npm run seed` for demo data |
| 9 | Frontend: `npm run dev` → open http://localhost:5173 |

If any step fails, check the error message and the step above (e.g. wrong password, IP not allowed, typo in `.env`).
