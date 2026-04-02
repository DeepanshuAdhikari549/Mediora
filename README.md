# MediCompare 🏥

**Find best hospitals & lab tests at lowest price near you.**

MediCompare is a full-stack healthcare price comparison platform built with React + Node.js + MongoDB. Search hospitals, compare prices, book appointments, get AI-powered recommendations.

---

## 🚀 Live Demo

> Deploy in minutes — see [Deployment](#deployment) section below.

---

## ✨ Features

- 🔍 **Search** hospitals, labs & clinics by service or location
- 💰 **Compare prices** for blood tests, MRI, X-ray, CT scan & more
- 📍 **Geolocation** — find nearest hospitals, fallback to Dehradun
- 🤖 **AI Assistant** — Gemini-powered medical Q&A chatbot
- 📅 **Book appointments** with slot selection & home sample collection
- 💳 **Payments** — UPI/card simulation with invoice PDF download
- 👤 **Role-based auth** — Patient | Hospital/Lab | Admin
- ⭐ **Reviews & ratings** — verified user reviews
- 📊 **Admin panel** — stats, hospital verification, analytics
- 🌙 **Dark mode** + fully responsive mobile design

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, Framer Motion |
| State | Zustand + React Query |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (7d expiry) |
| AI | Google Gemini 1.5 Flash |
| PDF | PDFKit (invoice generation) |

---

## ⚡ Quick Start (Local)

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (free tier works)

### 1. Clone
```bash
git clone https://github.com/YOUR_USERNAME/medicompare.git
cd medicompare
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env
# Edit .env — fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY
npm install
npm run dev        # starts on http://localhost:5000
```

### 3. Seed sample data (optional)
```bash
npm run seed       # adds 80+ hospitals to DB
```

### 4. Frontend setup
```bash
cd ../frontend
npm install
npm run dev        # starts on http://localhost:5173
```

Open **http://localhost:5173** 🎉

---

## 🌍 Deployment

### Option A — Render (Full-stack, recommended)

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → **New** → **Blueprint**
3. Connect your GitHub repo — Render auto-detects `render.yaml`
4. Set environment variables in Render dashboard:
   - `MONGODB_URI` — your Atlas connection string
   - `JWT_SECRET` — any long random string
   - `GEMINI_API_KEY` — from Google AI Studio
   - `FRONTEND_URL` — your deployed frontend URL
5. Click **Deploy** ✅

### Option B — Vercel (Frontend) + Render (Backend)

**Backend on Render:**
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add env vars as above

**Frontend on Vercel:**
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Add env var: `VITE_API_URL=https://your-backend.onrender.com`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `JWT_EXPIRES_IN` | Token expiry (default: `7d`) |
| `GEMINI_API_KEY` | Google Gemini AI API key |
| `FRONTEND_URL` | Frontend origin for CORS |
| `PORT` | Server port (default: `5000`) |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend URL (leave empty for local proxy) |

---

## 📁 Project Structure

```
medicompare/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth, validation
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # Express routers
│   │   ├── services/      # Business logic
│   │   ├── seed.js        # Sample data seeder
│   │   └── server.js      # App entry point
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── lib/           # API client, utilities
│   │   ├── store/         # Zustand auth store
│   │   └── App.jsx
│   └── index.html
├── render.yaml            # Render deployment config
└── README.md
```

---

## 📜 License

MIT © MediCompare 2026
