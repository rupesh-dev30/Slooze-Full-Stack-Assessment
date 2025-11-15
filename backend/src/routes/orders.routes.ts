import { Router, type Request } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  cancelOrder,
  checkoutOrder,
  createOrder,
  getOrder,
  listOrders,
} from "../controllers/orderController.js";
import OrderModel from "../models/Order.model.js";
import { permit } from "../middleware/rbac.middleware.js";
import { restrictByCountry } from "../middleware/country.middleware.js";

const router = Router();

router.post("/", authMiddleware, createOrder);

router.get("/", authMiddleware, listOrders);

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

router.get("/:id", authMiddleware, async (req: any, res, next) => {
  const orderId = req.params.id;
  const user = req.user;

  try {
    const order = await OrderModel.findById(orderId).lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (user.role === "ADMIN") return getOrder(req, res);

    if (user.role === "MANAGER") {
      if (order.country !== user.country)
        return res.status(403).json({ message: "Not allowed in this country" });
      return getOrder(req, res);
    }

    if (user.role === "MEMBER") {
      if (order.userId?.toString() !== user._id.toString())
        return res.status(403).json({ message: "Unauthorized order access" });
      return getOrder(req, res);
    }
  } catch (error) {
    next(error);
  }
});

export default router;
