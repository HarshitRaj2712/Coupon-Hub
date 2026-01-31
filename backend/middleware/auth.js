const jwt = require("jsonwebtoken");

const secret = process.env.JWT_ACCESS_SECRET || "dev_access_secret";

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = auth.split(" ")[1];
    const payload = jwt.verify(token, secret);

    // ✅ Normalize user payload
    req.user = {
      id: payload.id,
      roles: payload.roles || ["user"], // default safety
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };
