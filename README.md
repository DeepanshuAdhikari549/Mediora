<img src="./Frontend/src/assets/logo.png" alt="MediCompare Logo" width="100" height="100">

# **Mediora 🏥 – Healthcare Price Comparison Platform**

**Mediora** is a modern, full-stack healthcare web application built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). It allows users to search, compare, and book hospitals and lab tests at the **lowest price near them**, with AI-powered recommendations and a seamless user experience.

---

## 🌐 Live Demo

🚀 Live - https://medi-compare-omega.vercel.app

---

## 🚀 Tech Stack

**MongoDB Atlas** - Cloud database for storing hospitals, users, bookings

**Express.js** - Backend REST API

**React.js (Vite)** - Fast and modern frontend

**Node.js** - Backend runtime

**JWT** - Authentication & authorization

**Google Gemini AI** - AI chatbot & recommendations

**PDFKit** - Invoice generation

---

## 📦 Features

### 👤 User Features

* ✅ Search hospitals, labs & clinics
* ✅ Compare prices for tests (MRI, CT Scan, Blood Tests, etc.)
* ✅ Book appointments with slot selection
* ✅ AI-powered chatbot for healthcare queries
* ✅ View booking history & download invoices
* ✅ Geolocation-based hospital suggestions

---

### 🏥 Admin / Hospital Features

* ✅ Role-based login (Patient / Admin / Hospital)
* ✅ Add, update, delete hospitals & services
* ✅ Manage bookings & users
* ✅ View analytics & system stats

---

## 🔐 Authentication & Security

* Password hashing using bcrypt
* JWT-based authentication (7-day expiry)
* Role-based access control
* Secure API handling

---

## 🧪 Testing

* Manual testing for:

  * Authentication
  * Booking flow
  * API endpoints
* Error handling implemented for invalid inputs

---

## 🛠️ Installation

Follow these steps to run MediCompare locally:

---

### **1. Clone Repository**

```bash
git clone https://github.com/DeepanshuAdhikari549/MediCompare.git
cd MediCompare
```

---

### **2. Backend Setup**

```bash
cd backend
cp .env.example .env
```

Add in `.env`:

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
GEMINI_API_KEY=your_api_key
FRONTEND_URL=http://localhost:5173
```

```bash
npm install
npm start
```

➡ Backend runs on: http://localhost:5000

---

### **3. Frontend Setup**

```bash
cd ../Frontend
npm install
npm run dev
```

➡ Frontend runs on: http://localhost:5173

---

## 🌍 Deployment

### 🔹 Frontend (Vercel)

* Root Directory: `Frontend`
* Build Command: `npm run build`
* Output Directory: `dist`

---

### 🔹 Backend (Render)

* Root Directory: `backend`
* Build Command: `npm install`
* Start Command: `npm start`

---

### 🔹 Environment Variables

#### Backend

* PORT=10000
* MONGO_URI=your_mongodb_uri
* JWT_SECRET=your_secret
* GEMINI_API_KEY=your_api_key
* FRONTEND_URL=https://medi-compare-omega.vercel.app

---

#### Frontend

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 📁 Project Structure

```
MediCompare/
├── backend/
├── Frontend/
├── render.yaml
└── README.md
```

---

## 📌 Future Improvements

* 📱 Mobile app (React Native)
* 💳 Real payment integration (Razorpay/Stripe)
* 🧠 Advanced AI diagnosis suggestions
* ⭐ Reviews & rating improvements

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repo and submit pull requests.

---

## 🙋‍♂️ Author

**Deepanshu Adhikari**

📧 [deepanshuadhikari@gmail.com](mailto:deepanshuadhikari@gmail.com)
🔗 https://www.linkedin.com/in/deepanshu-adhikari-1b768028b

---

## 📜 License

MIT License © 2026 MediCompare
