// backend/middleware/auth.js
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_ACCESS_SECRET || "dev_access_secret";

function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];
    const payload = jwt.verify(token, secret);

    req.user = payload; // { id, email, roles, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };
