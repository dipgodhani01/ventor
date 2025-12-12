import express from "express";
import { adminProfile, loginAdmin } from "../controllers/admin.js";
import { verifyCSRFToken } from "../middlewares/csrf.js";
import { adminOnly } from "../middlewares/checkRole.js";
import {
  logout,
  refreshCSRFToken,
  refreshAdminToken,
} from "../controllers/auth.js";
import { isAdminAuth } from "../middlewares/isAdminAuth.js";

const router = express.Router();

router.post("/admin/login", loginAdmin);
router.get("/admin-user", isAdminAuth, adminOnly, adminProfile);
router.post("/admin/token-refresh", refreshAdminToken);
router.post("/admin/logout", isAdminAuth, adminOnly, verifyCSRFToken, logout);
router.post("/admin/refresh-csrf", isAdminAuth, adminOnly, refreshCSRFToken);

export default router;
