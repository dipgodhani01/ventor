import jwt from "jsonwebtoken";
import { redisClient } from "../index.js";
import { isSessionActive } from "../config/generateToken.js";
import { User } from "../models/User.js";

export const isUserAuth = async (req, res, next) => {
  try {
    const token = req.cookies.userAccessToken;
    if (!token) {
      return res.status(403).json({
        status: false,
        message: "User access denied, No token provided!",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedData || decodedData.role !== "user") {
      res.clearCookie("userAccessToken");
      res.clearCookie("userRefreshToken");
      res.clearCookie("userCsrfToken");
      return res.status(401).json({
        status: false,
        message: "Invalid user token!",
      });
    }

    const sessionActive = await isSessionActive(
      decodedData.id,
      decodedData.sessionId,
      "user"
    );

    if (!sessionActive) {
      res.clearCookie("userAccessToken");
      res.clearCookie("userRefreshToken");
      res.clearCookie("userCsrfToken");
      return res.status(401).json({
        status: false,
        message: "User session expired!",
      });
    }

    const cacheKey = `user:${decodedData.id}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      req.user = JSON.parse(cachedData);
      req.sessionId = decodedData.sessionId;
      return next();
    }

    const userData = await User.findByPk(decodedData.id, {
      attributes: { exclude: ["password"] },
    });

    if (!userData) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    userData.role = "user";
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(userData));

    req.user = userData;
    req.sessionId = decodedData.sessionId;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.clearCookie("userAccessToken");
      return res.status(401).json({
        status: false,
        message: "Token expired. Please refresh your token.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      res.clearCookie("userAccessToken");
      return res.status(401).json({
        status: false,
        message: "Invalid token.",
      });
    }

    console.error("User Auth Error:", error);
    return res.status(500).json({
      status: false,
      message: "Authentication failed.",
    });
  }
};
