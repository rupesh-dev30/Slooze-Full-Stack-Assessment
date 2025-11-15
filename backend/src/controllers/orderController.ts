import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import MenuItemModel from "../models/MenuItem.model.js";
import RestaurantModel from "../models/Restaurant.model.js";
import OrderModel from "../models/Order.model.js";

export async function createOrder(req: AuthRequest, res: Response) {
  try {
    const user = req.user;
    const { restaurantId, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // ✅ Auto-fetch restaurant from first menu item if not provided
    let restaurant = null;
    let finalRestaurantId = restaurantId;

    if (!finalRestaurantId) {
      const firstMenuItem = await MenuItemModel.findById(items[0].menuItemId);
      if (!firstMenuItem) {
        return res.status(400).json({ message: "Invalid menu item" });
      }
      finalRestaurantId = firstMenuItem.restaurantId;
    }

    restaurant = await RestaurantModel.findById(finalRestaurantId).lean();
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const menuItemIds = items.map((item: any) => item.menuItemId);
    const menuDocs = await MenuItemModel.find({
      _id: { $in: menuItemIds },
    }).lean();

    const orderItems = items.map((item: any) => {
      const docs = menuDocs.find(
        (doc) => doc._id.toString() === item.menuItemId
      );
      if (!docs) {
        throw new Error(`Menu item with ID ${item.menuItemId} not found`);
      }
      return {
        menuItemId: docs._id,
        name: docs.name,
        price: docs.price,
        quantity: item.quantity || 1,
      };
    });

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await OrderModel.create({
      userId: user?._id,
      restaurantId: finalRestaurantId,
      items: orderItems,
      totalAmount,
      country: restaurant.country,
      status: "CREATED",
    });

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function checkoutOrder(req: AuthRequest, res: Response) {
  try {
    const orderId = req.params.id;
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Prevent members from marking as paid
    if (req.user?.role === "MEMBER") {
      return res
        .status(403)
        .json({ message: "Members cannot mark orders as paid" });
    }

    // Prevent already paid or cancelled orders
    if (order.status !== "CREATED") {
      return res
        .status(400)
        .json({
          message: `Order cannot be marked as paid. Current status: ${order.status}`,
        });
    }

    // ✅ Mark as paid
    order.status = "PAID";
    await order.save();

    res.status(200).json({
      message: "Order checked out successfully",
      order,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

export async function cancelOrder(req: AuthRequest, res: Response) {
  try {
    const orderId = req.params.id;
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (order.status === "CANCELLED") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    order.status = "CANCELLED";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function getOrder(req: AuthRequest, res: Response) {
  try {
    const orderId = req.params.id;
    const order = await OrderModel.findById(orderId).lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function listOrders(req: AuthRequest, res: Response) {
  try {
    const user = req.user!;
    const role = user.role;

    let filter: any = {};

    if (role === "ADMIN") {
      filter = {};
    }

    if (role === "MANAGER") {
      filter.country = user.country;
    }

    if (role === "MEMBER") {
      filter.userId = user._id;
    }

    const orders = await OrderModel.find(filter).sort({ createdAt: -1 }).lean();

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
}
