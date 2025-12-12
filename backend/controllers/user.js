import { loginUserSchema, registerUserSchema } from "../config/zod.js";
import { validationErrors } from "../helper/errors.js";
import bcrypt from "bcrypt";
import TryCatch from "../middlewares/TryCatch.js";
import { sanitize } from "../utils/sanitize.js";
import { User } from "../models/User.js";
import { redisClient } from "../index.js";
import crypto from "crypto";
import { getOtpHtml, getVerifyEmailHtml } from "../helper/html.js";
import sendMail from "../config/sendMail.js";
import { generateToken } from "../config/generateToken.js";

export const registerUser = TryCatch(async (req, res) => {
  const data = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: "user",
  };
  const sanitizeBody = sanitize(data);
  const validation = registerUserSchema.safeParse(sanitizeBody);
  if (!validation.success) {
    const zodError = validationErrors(validation.error);
    return res.status(400).json({
      status: false,
      message: zodError.message,
      errors: zodError,
    });
  }

  const { username, email, password, role } = validation.data;
  const rateLimitKey = `register-rate-limit:${req.ip}:${email}`;
  if (await redisClient.get(rateLimitKey)) {
    return res.status(429).json({
      status: false,
      message: "Too many requests, try again later",
    });
  }

  const existingUser = await User.findOne({
    where: { email },
  });
  if (existingUser) {
    return res.status(409).json({
      status: false,
      message: "User already exists!",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(32).toString("hex");
  const verifyKey = `verify:${verifyToken}`;

  const dataToStore = JSON.stringify({
    username: username,
    email: email,
    password: hashPassword,
    role: role,
  });

  await redisClient.set(verifyKey, dataToStore, { EX: 300 });
  const subject = "Verify your email for registration";
  const html = getVerifyEmailHtml({ email, token: verifyToken });

  await sendMail({ email, subject, html });
  await redisClient.set(rateLimitKey, "true", { EX: 60 });

  return res.json({
    status: true,
    message:
      "Verification link has been sent on your email, it will expire in 5 minutes - please check it.",
  });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).json({
      status: false,
      message: "Verification token is required!",
    });
  }
  const verifyKey = `verify:${token}`;
  const userData = await redisClient.get(verifyKey);
  if (!userData) {
    return res.status(400).json({
      status: false,
      message: "Verification link is expired!",
    });
  }

  await redisClient.del(verifyKey);
  const data = JSON.parse(userData);

  const existingUser = await User.findOne({ where: { email: data.email } });

  if (existingUser) {
    return res.status(400).json({
      status: false,
      message: "user already exists",
    });
  }

  const newUser = await User.create({
    username: data.username,
    email: data.email,
    password: data.password,
    role: data.role,
  });

  return res.status(201).json({
    status: true,
    message: "Email verified successfully, Your account has been created.",
    data: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

export const loginUser = TryCatch(async (req, res) => {
  const sanitizeBody = sanitize(req.body);
  const validation = loginUserSchema.safeParse(sanitizeBody);

  if (!validation.success) {
    const zodError = validationErrors(validation.error);

    return res.status(400).json({
      status: false,
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

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(400).json({
      status: false,
      message: "Invalid credentials!",
    });
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    return res.status(400).json({
      status: false,
      message: "Invalid credentials!",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, JSON.stringify(otp), { EX: 300 });
  const subject = "OTP for verification";

  const html = getOtpHtml({ email, otp });
  await sendMail({ email, subject, html });

  await redisClient.set(rateLimitKey, "true", { EX: 60 });
  return res.json({
    status: true,
    message:
      "OTP has been sent on your email, it will be valid for 5 minutes - please check it.",
  });
});

export const verifyOtp = TryCatch(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      status: false,
      message: "Credentials are required!",
    });
  }

  const otpKey = `otp:${email}`;
  const storedOtpStr = await redisClient.get(otpKey);
  if (!storedOtpStr) {
    return res.status(400).json({
      status: false,
      message: "OTP Expired!",
    });
  }

  const storedOtp = JSON.parse(storedOtpStr);
  if (storedOtp !== otp) {
    return res.status(400).json({
      status: false,
      message: "Invalid Otp! ",
    });
  }

  await redisClient.del(otpKey);

  const user = await User.findOne({ where: { email } });
  const tokenData = await generateToken(user.id, res, "user");

  return res.status(201).json({
    status: true,
    message: `Welcome ${user.username}`,
    data: user,
    sessionInfo: {
      sessionId: tokenData.sessionId,
      loginTime: new Date().toISOString(),
      csrfToken: tokenData.csrfToken,
    },
  });
});

export const myProfile = TryCatch(async (req, res) => {
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
  return res.status(201).json({
    status: true,
    message: "Profile fetched successfully.",
    data: user,
    sessionInfo,
  });
});
