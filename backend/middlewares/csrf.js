import crypto from "crypto";
import { redisClient } from "../index.js";

export const generateCSRFToken = async (
  userId,
  res,
  role,
  csrfTokenName = null
) => {
  const csrfToken = crypto.randomBytes(32).toString("hex");
  const csrfKey = `csrf:${userId}:${role}`;

  await redisClient.setEx(csrfKey, 3600, csrfToken);
  const cookieName =
    csrfTokenName || (role === "admin" ? "adminCsrfToken" : "userCsrfToken");

  res.cookie(cookieName, csrfToken, {
    httpOnly: false,
    secure: true,
    sameSite: "none",
    maxAge: 60 * 60 * 1000,
  });

  return csrfToken;
};

export const verifyCSRFToken = async (req, res, next) => {
  try {
    if (req.method === "GET") return next();

    const userId = req?.user?.id;
    const role = req?.user?.role;

    if (!userId) {
      return res.status(401).json({
        status: false,
        message: "User not authenticated!",
      });
    }
    const csrfTokenName = role === "admin" ? "adminCsrfToken" : "userCsrfToken";

    const clientToken =
      req.headers["x-csrf-token"] ||
      req.headers["x-xsrf-token"] ||
      req.headers["csrf-token"] ||
      req.cookies[csrfTokenName];

    if (!clientToken) {
      return res.status(403).json({
        status: false,
        message: "CSRF token missing, Please refresh the page.",
        code: "CSRF_TOKEN_MISSING",
      });
    }

    const csrfKey = `csrf:${userId}:${role}`;
    const storedToken = await redisClient.get(csrfKey);

    if (!storedToken) {
      return res.status(403).json({
        status: false,
        message: "CSRF token expired, Please try again.",
        code: "CSRF_TOKEN_EXPIRE",
      });
    }

    if (storedToken !== clientToken) {
      return res.status(403).json({
        status: false,
        message: "Invalid CSRF token, Please refresh the page.",
        code: "CSRF_TOKEN_INVALID",
      });
    }

    next();
  } catch (error) {
    console.log("CSRF verification error:", error);
    return res.status(500).json({
      status: false,
      message: "CSRF verification failed!",
      code: "CSRF_VERIFICATION_ERROR",
    });
  }
};

export const revokeCSRFToken = async (userId, role) => {
  const csrfKey = `csrf:${userId}:${role}`;
  await redisClient.del(csrfKey);
};

export const refreshCSRF = async (
  userId,
  role = "user",
  res,
  csrfTokenName = null
) => {
  await revokeCSRFToken(userId, role);
  return await generateCSRFToken(userId, res, role, csrfTokenName);
};
