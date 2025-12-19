// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const couponRoutes = require("./routes/coupons");

const app = express();

// middlewares
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://coupon-hub-ten.vercel.app/"
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// mongo connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/couponwala")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/coupons", couponRoutes);

// health check
app.get("/", (req, res) => {
  res.send("API is running");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
