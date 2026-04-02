# MediCompare – How to Run

## 1. Start the **backend** first (required)

Open a terminal:

```bash
cd backend
npm run server
```

You should see:
- `MongoDB Connected: ...`
- `MediCompare API running on port 5000`

**If you see "MONGODB_URI is not set"**  
- Copy `backend\.env.example` to `backend\.env` and set `MONGODB_URI` and `JWT_SECRET`.

**If you see "MongoDB connection error"**  
- You need a running MongoDB:
  - **Option A:** Install [MongoDB Community](https://www.mongodb.com/try/download/community) and start it, then use `MONGODB_URI=mongodb://localhost:27017/medicompare` in `backend\.env`.
  - **Option B:** Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and put the connection string in `backend\.env` as `MONGODB_URI`.

**Optional – seed demo data (admin + hospitals):**
```bash
cd backend
npm run seed
```
Then login as **admin@medicompare-demo.com** / **admin123**.

---

## 2. Start the **frontend**

Open a **second** terminal (keep the backend running in the first):

```bash
cd Frontend
npm run dev
```

Open **http://localhost:5173** in your browser. The app will proxy `/api` to the backend on port 5000.

---

## Summary

| Command        | Where      | What it does              |
|----------------|------------|----------------------------|
| `npm run server` | `backend`  | Starts API on port 5000    |
| `npm run dev`    | `Frontend` | Starts UI on port 5173    |

**Backend must be running** for search, hospitals, booking, and login to work. The "ECONNREFUSED" errors in the frontend mean the backend was not running on port 5000.
