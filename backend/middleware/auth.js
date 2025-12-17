const jwt = require("jsonwebtoken");
const secret = process.env.JWT_ACCESS_SECRET || "dev_access_secret";

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, secret);
    req.user = payload; // { id, email }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { requireAuth };
