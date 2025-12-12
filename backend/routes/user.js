import express from "express";
import {
  loginUser,
  myProfile,
  registerUser,
  verifyOtp,
  verifyUser,
} from "../controllers/user.js";
import { userOnly } from "../middlewares/checkRole.js";
import {
  logout,
  refreshCSRFToken,
  refreshUserToken,
} from "../controllers/auth.js";
import { verifyCSRFToken } from "../middlewares/csrf.js";
import { isUserAuth } from "../middlewares/isUserAuth.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/verify/:token", verifyUser);
router.post("/login", loginUser);
router.post("/verify", verifyOtp);
router.get("/me", isUserAuth, userOnly, myProfile);
router.post("/user/token-refresh", refreshUserToken);
router.post("/user/logout", isUserAuth, userOnly, verifyCSRFToken, logout);
router.post("/user/refresh-csrf", isUserAuth, userOnly, refreshCSRFToken);

export default router;
