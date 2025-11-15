import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

const router = Router();

router.get("/", authMiddleware, getCart);
router.post("/", authMiddleware, addToCart);
router.put("/", authMiddleware, updateCartItem);
router.delete("/:menuItemId", authMiddleware, removeCartItem);
router.delete("/", authMiddleware, clearCart);

export default router;
