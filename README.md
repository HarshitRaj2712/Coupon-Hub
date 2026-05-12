# 🎟️ Coupon Hub

[![Live Demo](https://img.shields.io/badge/live%20demo-visit%20app-0ea5e9?style=for-the-badge&logo=vercel&logoColor=white)](https://coupon-hub-six.vercel.app/)
[![Stack](https://img.shields.io/badge/stack-MERN%20%2B%20Vite-111827?style=for-the-badge&logo=mongodb&logoColor=white)](https://github.com/HarshitRaj2712/Coupon-Hub)
![License](https://img.shields.io/badge/license-ISC-16a34a?style=for-the-badge)

Coupon Hub is a polished full-stack coupon discovery and management platform built with the MERN stack. It helps users browse live deals, save favorites, manage their own coupon listings, and gives admins a clear dashboard for platform oversight.

Live demo: https://coupon-hub-six.vercel.app/

License: ISC

## ⚡ Quick Jump

- [🎯 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Installation](#-installation)
- [🔧 Backend Setup](#-backend-setup)
- [💻 Frontend Setup](#-frontend-setup)
- [🔌 API Docs](#-api-docs)
- [🔐 Authentication Flow](#-authentication-flow)
- [🧪 Available Pages](#-available-pages)
- [🤝 Contributing](#-contributing)
- [👨‍💻 Author](#-author)

## 🎯 Overview

Coupon Hub is designed for fast deal discovery with a clean, responsive UI and a secure auth flow. The app supports public coupon browsing, user-specific dashboards, coupon creation and editing, save/unsave actions, and admin analytics for platform moderation.

### Current Highlights

- 🔐 Secure email/password authentication with access tokens and refresh tokens.
- 🔎 Public coupon browsing with search, filters, and pagination support.
- 🧾 User dashboard for saved coupons and personal listings.
- 📊 Admin dashboard with coupon analytics and moderation tools.
- 🛡️ Protected routes for users and admins.
- 🔁 Automatic token refresh through an HTTP-only cookie.

## ✨ Features

### For Visitors

- 👀 Browse public coupons without signing in.
- 🔎 Search by title, store, or coupon code.
- ✨ Discover deal highlights, top stores, and recently viewed content.
- 📚 Explore the FAQ, privacy, terms, and help pages.

### For Users

- ✍️ Sign up and log in with JWT-based authentication.
- ⭐ Save or unsave coupons for later.
- 📦 View a personal dashboard with saved coupons and owned coupons.
- ➕ Create new coupon listings.
- ✏️ Edit or delete coupons you own.

### For Admins

- 🧠 View the admin dashboard with total coupons, total saves, and total views.
- 📈 Review the top saved coupons in a chart.
- 🧰 Access all coupon listings from one place.
- 🗑️ Remove any coupon from the platform.

### Security & Reliability

- 🔑 Access token stored in local storage.
- 🍪 Refresh token stored in an HTTP-only cookie.
- 🔄 Automatic refresh when access tokens expire.
- 🚧 Role-based route protection for admin-only pages.
- ⚙️ Backend uses compression, CORS, and cookie parsing middleware.

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
| --- | --- |
| ⚛️ React 19 | UI framework |
| ⚡ Vite | Development server and build tool |
| 🎨 Tailwind CSS 4 | Utility-first styling |
| 🧭 React Router | Client-side routing |
| 🔁 Axios | API communication |
| 📝 React Hook Form | Form handling |
| 🍞 React Hot Toast | Toast notifications |
| 📊 Recharts | Dashboard charts |
| ✨ Lucide React | Icons |
| ✅ Yup | Schema validation |

### Backend

| Technology | Purpose |
| --- | --- |
| 🟢 Node.js | Runtime |
| 🚂 Express 5 | API framework |
| 🍃 MongoDB | Database |
| 🧩 Mongoose | ODM |
| 🔐 JWT | Authentication |
| 🧪 bcrypt | Password hashing |
| 🍪 cookie-parser | Cookie handling |
| 🌐 cors | Cross-origin requests |
| 🗜️ compression | Response compression |
| 🌿 dotenv | Environment configuration |
| 📜 morgan | HTTP logging |

## 📁 Project Structure

```text
Coupon-Hub/
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── contexts/
│       ├── pages/
│       └── utils/
└── README.md
```

## 🚀 Installation

### Prerequisites

- 🟢 Node.js 18+ recommended
- 📦 npm or yarn
- 🍃 MongoDB instance or MongoDB Atlas cluster

### Clone the Repository

```bash
git clone https://github.com/HarshitRaj2712/Coupon-Hub.git
cd Coupon-Hub
```

> Tip: open the repo in VS Code and keep the README beside the app while you build.

## 🔧 Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/couponwala

JWT_ACCESS_SECRET=your_access_token_secret
JWT_ACCESS_EXPIRES=15m
REFRESH_TOKEN_EXPIRES_DAYS=30

COOKIE_SECURE=false
```

Start the backend server:

```bash
node server.js
```

If you prefer auto-reload during development, run:

```bash
npx nodemon server.js
```

Backend runs on `http://localhost:5000`.

## 💻 Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:

```env
VITE_API_BASE=http://localhost:5000
```

Start the frontend dev server:

```bash
npm run start
```

Frontend runs on `http://localhost:5173`.

<details>
<summary>✨ Quick launch checklist</summary>

1. Start MongoDB.
2. Set the backend `.env` values.
3. Run the backend with `node server.js` or `npx nodemon server.js`.
4. Set `VITE_API_BASE` in the frontend `.env`.
5. Run `npm run start` from `frontend/`.

</details>

## 🔌 API Docs

### Auth Routes

```text
POST /api/auth/signup   ✍️ Register a new user
POST /api/auth/login    🔐 Log in an existing user
POST /api/auth/refresh  🔄 Refresh the access token
POST /api/auth/logout   🚪 End the session
```

### Coupon Routes

```text
GET    /api/coupons             🔎 Fetch public coupons
POST   /api/coupons             ➕ Create a coupon
GET    /api/coupons/:id         ✏️ Fetch a coupon for editing
PUT    /api/coupons/:id         🛠️ Update a coupon you own
DELETE /api/coupons/:id         🗑️ Delete a coupon you own
GET    /api/coupons/my/list     📦 Fetch your coupons
GET    /api/coupons/saved/list  ⭐ Fetch saved coupons
POST   /api/coupons/:id/save    💾 Save a coupon
DELETE /api/coupons/:id/save    ♻️ Unsave a coupon
GET    /api/coupons/admin/all   🧠 Fetch all coupons as admin
DELETE /api/coupons/admin/:id   🚫 Delete any coupon as admin
```

## 🔐 Authentication Flow

1. 👤 User signs up or logs in.
2. 🔐 Backend returns an access token and sets a refresh token cookie.
3. 💾 Frontend stores the access token locally.
4. 📡 API requests include the access token in the `Authorization` header.
5. 🔁 If the access token expires, Axios automatically calls `/api/auth/refresh`.
6. ✅ A fresh access token is issued and the request is retried.

## 🧪 Available Pages

- 🏠 Home, login, signup, dashboard, add coupon, edit coupon, admin dashboard, admin reports, and search results.
- 📎 Footer pages for About, Contact, Privacy, Terms, FAQ, How Listing Works, and How To Find Deals.
- 🔍 Search results and filter-driven browsing for coupon discovery.

## 🧪 Testing

```bash
# Frontend
cd frontend
npm run lint
```

The backend does not currently include an automated test script.

## 🧱 What Makes It Feel Interactive

- 🧭 Quick Jump links for fast section navigation.
- 📌 Badge strip at the top for instant context.
- <details> blocks for progressive disclosure.
- 🎯 Emoji-led sections so each area is easy to scan.

## 🤝 Contributing

Contributions are welcome.

1. 🍴 Fork the repository.
2. 🌿 Create a feature branch.
3. 🛠️ Make your changes.
4. 📝 Commit with a clear message.
5. 🚀 Open a pull request.

Please keep changes focused, follow the existing code style, and add tests or documentation when needed.

## 👨‍💻 Author

Harshit Raj - @HarshitRaj2712

## 🙏 Acknowledgments

- Built with React, Node.js, Express, and MongoDB.
- UI powered by Tailwind CSS.
- Analytics visualized with Recharts.
- Icons provided by Lucide React.

---
