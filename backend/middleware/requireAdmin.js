function requireAdmin(req, res, next) {
  if (!req.user || !req.user.roles?.includes("admin")) {
    return res.status(403).json({
      message: "Admin access required",
    });
  }
  next();
}

module.exports = requireAdmin;
