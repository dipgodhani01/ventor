import { Admin } from "../models/Admin.js";
import { adminLoginSchema, createAdminSchema } from "../config/zod.js";
import { validationErrors } from "../helper/errors.js";
import bcrypt from "bcrypt";
import { redisClient } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { generateToken } from "../config/generateToken.js";
import { sanitize } from "../utils/sanitize.js";

export const createAdmin = async () => {
  const data = {
    username: "administrator",
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    role: "admin",
  };
  const validation = createAdminSchema.safeParse(data);
  if (!validation.success) {
    const zodError = validationErrors(validation.error);
    console.log("Error:", zodError.message);
    return;
  }

  const { username, email, password, role } = validation.data;

  const existingAdmin = await Admin.findOne({
    where: { email },
  });
  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await Admin.create({
    username: username,
    email: email,
    password: hashPassword,
    role: role,
  });

  console.log("Admin created");
  return;
};

export const loginAdmin = TryCatch(async (req, res) => {
  const sanitizeBody = sanitize(req.body);
  const validation = adminLoginSchema.safeParse(sanitizeBody);

  if (!validation.success) {
    const zodError = validationErrors(validation.error);
    return res.status(400).json({
      message: zodError.message,
      errors: zodError,
    });
  }

  const { email, password } = validation.data;
  const rateLimitKey = `login-rate-limit:${req.ip}:${email}`;

  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      status: false,
      message: "Too many requests, try again later",
    });
  }

  const admin = await Admin.findOne({ where: { email } });
  if (!admin) {
    return res.status(400).json({
      status: false,
      message: "Invalid credentials!",
    });
  }

  const comparePassword = await bcrypt.compare(password, admin.password);
  if (!comparePassword) {
    return res.status(400).json({
      status: false,
      message: "Invalid credentials!",
    });
  }

  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  const tokenData = await generateToken(admin.id, res, "admin");
  return res.status(200).json({
    status: true,
    message: `Welcome ${admin.username}`,
    data: admin,
    sessionInfo: {
      sessionId: tokenData.sessionId || "",
      loginTime: new Date().toISOString(),
      csrfToken: tokenData?.csrfToken || "",
    },
  });
});

export const adminProfile = TryCatch(async (req, res) => {
  const user = req.user;
  const sessionId = req.sessionId;
  const sessionData = await redisClient.get(`session:${sessionId}`);
  let sessionInfo = null;
  if (sessionData) {
    const parsedSession = JSON.parse(sessionData);
    sessionInfo = {
      sessionId,
      loginTime: parsedSession.createdAt,
      lastActivity: parsedSession.lastActivity,
    };
  }
  return res.status(201).json({ status: true, user, sessionInfo });
});
