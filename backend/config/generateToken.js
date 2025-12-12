import jwt from "jsonwebtoken";
import { redisClient } from "../index.js";
import { generateCSRFToken, revokeCSRFToken } from "../middlewares/csrf.js";
import crypto from "crypto";

export const generateToken = async (id, res, role) => {
  const sessionId = crypto.randomBytes(16).toString("hex");
  const accessTokenName =
    role === "admin" ? "adminAccessToken" : "userAccessToken";
  const refreshTokenName =
    role === "admin" ? "adminRefreshToken" : "userRefreshToken";
  const csrfTokenName = role === "admin" ? "adminCsrfToken" : "userCsrfToken";
  const accessToken = jwt.sign(
    { id, sessionId, role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1m",
    }
  );
  const refreshToken = jwt.sign(
    { id, sessionId, role },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const refreshTokenKey = `refresh_token:${id}:${role}`;
  const activeSessionKey = `active_session:${id}:${role}`;
  const sessionDataKey = `session:${sessionId}`;

  const existingSession = await redisClient.get(activeSessionKey);

  if (existingSession) {
    await redisClient.del(`session:${existingSession}`);
    await redisClient.del(refreshTokenKey);
  }

  const sessionData = {
    userId: id,
    sessionId,
    role,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
  };

  await redisClient.setEx(refreshTokenKey, 7 * 24 * 60 * 60, refreshToken);
  await redisClient.setEx(
    sessionDataKey,
    7 * 24 * 60 * 60,
    JSON.stringify(sessionData)
  );
  await redisClient.setEx(activeSessionKey, 7 * 24 * 60 * 60, sessionId);

  res.cookie(accessTokenName, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1 * 60 * 1000,
  });

  res.cookie(refreshTokenName, refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const csrfToken = await generateCSRFToken(id, res, role, csrfTokenName);

  return { accessToken, refreshToken, csrfToken, sessionId };
};

export const verifyRefreshToken = async (refreshToken) => {
  try {
    const decode = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    if (!decode.role) {
      return null;
    }
    const storedToken = await redisClient.get(
      `refresh_token:${decode.id}:${decode.role}`
    );
    if (storedToken !== refreshToken) {
      return null;
    }

    const activeSessionId = await redisClient.get(
      `active_session:${decode.id}:${decode.role}`
    );
    if (activeSessionId !== decode.sessionId) {
      return null;
    }

    const sessionData = await redisClient.get(`session:${decode.sessionId}`);
    if (!sessionData) {
      return null;
    }

    const parsedSessionData = JSON.parse(sessionData);
    parsedSessionData.lastActivity = new Date().toISOString();

    await redisClient.setEx(
      `session:${decode.sessionId}`,
      7 * 24 * 60 * 60,
      JSON.stringify(parsedSessionData)
    );

    return decode;
  } catch (error) {
    return null;
  }
};

export const generateAccessToken = async (id, sessionId, role, res) => {
  const accessToken = jwt.sign(
    { id, sessionId, role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1m",
    }
  );
  const accessTokenName =
    role === "admin" ? "adminAccessToken" : "userAccessToken";

  res.cookie(accessTokenName, accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 1 * 60 * 1000,
  });
};

export const revokeRefreshToken = async (userId, role) => {
  const activeSessionKey = `active_session:${userId}:${role}`;
  const refreshTokenKey = `refresh_token:${userId}:${role}`;
  const activeSessionId = await redisClient.get(activeSessionKey);
  await redisClient.del(refreshTokenKey);
  await redisClient.del(activeSessionKey);

  if (activeSessionId) {
    await redisClient.del(`session:${activeSessionId}`);
  }

  await revokeCSRFToken(userId, role);
};

export const isSessionActive = async (userId, sessionId, role) => {
  const activeSessionKey = `active_session:${userId}:${role}`;
  const activeSessionId = await redisClient.get(activeSessionKey);
  return activeSessionId === sessionId;
};
