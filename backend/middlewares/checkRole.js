export const checkRole = (roles = []) => {
  if (!Array.isArray(roles) || roles.length === 0) {
    throw new Error("checkRole middleware requires a non-empty array of roles");
  }

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        status: false,
        message: "User not authenticated",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

export const adminOnly = checkRole(["admin"]);
export const userOnly = checkRole(["user"]);
export const adminOrUser = checkRole(["admin", "user"]);
