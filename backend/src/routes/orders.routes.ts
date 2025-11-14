import { Router, type Request } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  cancelOrder,
  checkoutOrder,
  createOrder,
  getOrder,
} from "../controllers/orderController.js";
import OrderModel from "../models/Order.model.js";
import { permit } from "../middleware/rbac.middleware.js";
import { restrictByCountry } from "../middleware/country.middleware.js";

const router = Router();

router.post("/", authMiddleware, createOrder);

const orderCountry = async (req: Request) => {
  const id = req.params.id;
  const order = await OrderModel.findById(id).lean();
  return order?.country;
};

router.post(
  "/:id/checkout",
  authMiddleware,
  permit("ADMIN", "MANAGER"),
  restrictByCountry(orderCountry),
  checkoutOrder
);

router.post(
  "/:id/cancel",
  authMiddleware,
  permit("ADMIN", "MANAGER"),
  restrictByCountry(orderCountry),
  cancelOrder
);

router.get("/:id", authMiddleware, restrictByCountry(orderCountry), getOrder);

export default router;
