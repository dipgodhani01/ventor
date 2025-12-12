import {
  generateAccessToken,
  revokeRefreshToken,
  verifyRefreshToken,
} from "../config/generateToken.js";
import { redisClient } from "../index.js";
import { refreshCSRF } from "../middlewares/csrf.js";
import TryCatch from "../middlewares/TryCatch.js";

export const refreshAdminToken = async (req, res) => {
  const token = req.cookies.adminRefreshToken;
  if (!token)
    return res
      .status(403)
      .json({ status: false, message: "Admin refresh token missing" });

  const decode = await verifyRefreshToken(token);
  if (!decode) {
    res.clearCookie("adminAccessToken");
    res.clearCookie("adminRefreshToken");
    res.clearCookie("adminCsrfToken");
    return res.status(401).json({
      status: false,
      message: "Session expired! Please login.",
    });
  }

  await generateAccessToken(decode.id, decode.sessionId, "admin", res);
  await refreshCSRF(decode.id, decode.role, res, "adminCsrfToken");

  return res.status(200).json({
    status: true,
    message: "Token refreshed successfully.",
  });
};

export const refreshUserToken = async (req, res) => {
  const token = req.cookies.userRefreshToken;

  if (!token)
    return res
      .status(403)
      .json({ status: false, message: "User refresh token missing" });

  const decode = await verifyRefreshToken(token);
  if (!decode) {
    res.clearCookie("userAccessToken");
    res.clearCookie("userRefreshToken");
    res.clearCookie("userCsrfToken");
    return res.status(401).json({
      status: false,
      message: "Session expired! Please login.",
    });
  }

  await generateAccessToken(decode.id, decode.sessionId, "user", res);
  await refreshCSRF(decode.id, decode.role, res, "userCsrfToken");

  return res.status(200).json({
    status: true,
    message: "Token refreshed successfully.",
  });
};

export const logout = TryCatch(async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  await revokeRefreshToken(userId, role);
  if (role === "admin") {
    res.clearCookie("adminAccessToken");
    res.clearCookie("adminRefreshToken");
    res.clearCookie("adminCsrfToken");
  } else {
    res.clearCookie("userAccessToken");
    res.clearCookie("userRefreshToken");
    res.clearCookie("userCsrfToken");
  }

  const cacheKey = `${role}:${userId}`;
  await redisClient.del(cacheKey);

  return res.status(200).json({
    status: true,
    message: "Logged out successfully.",
  });
});

export const refreshCSRFToken = TryCatch(async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  const newCSRFToken = await refreshCSRF(userId, role, res);

  return res.status(200).json({
    status: true,
    message: "CSRF token refreshed.",
    csrfToken: newCSRFToken,
  });
});
