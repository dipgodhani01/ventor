import jwt from "jsonwebtoken";
import { redisClient } from "../index.js";
import { isSessionActive } from "../config/generateToken.js";
import { Admin } from "../models/Admin.js";

export const isAdminAuth = async (req, res, next) => {
  try {
    const token = req.cookies.adminAccessToken;

    if (!token) {
      return res.status(403).json({
        status: false,
        message: "Admin access denied, No token provided!",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData || decodedData.role !== "admin") {
      res.clearCookie("adminAccessToken");
      res.clearCookie("adminRefreshToken");
      res.clearCookie("adminCsrfToken");
      return res.status(401).json({
        status: false,
        message: "Invalid admin token!",
      });
    }

    const sessionActive = await isSessionActive(
      decodedData.id,
      decodedData.sessionId,
      "admin"
    );

    if (!sessionActive) {
      res.clearCookie("adminAccessToken");
      res.clearCookie("adminRefreshToken");
      res.clearCookie("adminCsrfToken");
      return res.status(401).json({
        status: false,
        message: "Admin session expired!",
      });
    }

    const cacheKey = `admin:${decodedData.id}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      req.user = JSON.parse(cachedData);
      req.sessionId = decodedData.sessionId;
      return next();
    }

    const adminData = await Admin.findByPk(decodedData.id, {
      attributes: { exclude: ["password"] },
    });

    if (!adminData) {
      return res.status(404).json({
        status: false,
        message: "Admin not found.",
      });
    }

    adminData.role = "admin";
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(adminData));

    req.user = adminData;
    req.sessionId = decodedData.sessionId;

    next();
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Authentication failed.",
    });
  }
};
