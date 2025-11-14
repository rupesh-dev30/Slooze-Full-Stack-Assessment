import { Router } from "express";
import { loginUser, logoutUser, me, registerUser } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.get("/me", authMiddleware, me);

export default router;