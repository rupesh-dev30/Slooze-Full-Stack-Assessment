import { Router } from "express";
import {
  listPaymentMethods,
  updatePaymentMethod,
  createPaymentMethod,
} from "../controllers/paymentController.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { permit } from "../middleware/rbac.middleware.js";

const router = Router();

router.get("/", authMiddleware, listPaymentMethods);

router.post("/", authMiddleware, createPaymentMethod);

router.put("/:id", authMiddleware, permit("ADMIN"), updatePaymentMethod);

export default router;
