# BharatFreelance – MERN Stack

India's AI-powered freelancing platform. Rebuilt with React + Vite + Node.js + MongoDB.

---

## 📁 Folder Structure

```
bharat-freelance/
├── backend/                  ← Node.js + Express + MongoDB
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   ├── Applicant.js
│   │   └── AtsResult.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── ats.js
│   │   └── payment.js
│   ├── server.js
│   ├── .env                  ← Add your secrets here
│   └── package.json
│
└── frontend/                 ← React + Vite + Tailwind + Framer Motion
    ├── src/
    │   ├── components/
    │   │   ├── layout/       Navbar, Footer
    │   │   └── dashboard/    ApplicantsModal
    │   ├── context/          AuthContext
    │   ├── lib/              api.js
    │   └── pages/            All route pages
    ├── .env                  ← VITE_API_URL
    └── package.json
```

---

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Edit `.env`:
```
MONGO_URI=mongodb+srv://your_user:your_pass@cluster.mongodb.net/bharat-freelance
JWT_SECRET=your_super_secret_key
RAZORPAY_KEY=rzp_test_xxxx
RAZORPAY_SECRET=xxxx
PORT=5000
```

Start backend:
```bash
npm run dev     # development (nodemon)
npm start       # production
```

Backend runs on: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev     # development (Vite, port 5173)
npm run build   # production build
```

Frontend runs on: `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/signup` — Register
- `POST /api/auth/login` — Login

### Jobs
- `GET /api/jobs/` — All active jobs
- `GET /api/jobs/job/:id` — Single job
- `GET /api/jobs/employer/:employerId` — Employer's jobs
- `POST /api/jobs/create` — Create job
- `PUT /api/jobs/update/:id` — Update job
- `DELETE /api/jobs/delete/:id` — Delete job

### ATS
- `POST /api/ats/analyze` — Submit resume + get ATS score
- `GET /api/ats/applicants/:jobId` — Get applicants for a job
- `PUT /api/ats/applicants/:id/status` — Update applicant status

### Payment
- `POST /api/pay/create-order` — Create Razorpay order
- `POST /api/pay/verify` — Verify payment

---

## ✅ Features Working

- [x] Login / Signup with JWT
- [x] Role-based routing (Freelancer / Employer)
- [x] Job posting (employer)
- [x] Job browsing with search & filter (freelancer)
- [x] **ATS resume upload + AI scoring (FIXED)**
- [x] **Job application saving to DB (FIXED)**
- [x] Applicants view for employer with status management
- [x] MongoDB connected
- [x] Razorpay payment integration (demo mode if keys not set)

---

## 🎨 Tech Stack

**Frontend:** React 18 + Vite + React Router v6 + Tailwind CSS + Framer Motion

**Backend:** Node.js + Express + MongoDB (Mongoose) + JWT + Multer + Razorpay

**Design:** Dark editorial aesthetic — Playfair Display + DM Sans, asymmetric layouts, Indian flag stripe animations

---

## 🌐 Deployment

**Backend → Railway / Render:**
- Set all .env variables in platform dashboard
- Entry point: `server.js`

**Frontend → Vercel:**
- Set `VITE_API_URL=https://your-backend-url.com` in Vercel env vars
- Build command: `npm run build`
- Output: `dist`
