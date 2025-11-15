import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import CartModel from "../models/Cart.model.js";
import MenuItemModel from "../models/MenuItem.model.js";
import RestaurantModel from "../models/Restaurant.model.js";

export async function getCart(req: AuthRequest, res: Response) {
  try {
    const user = req.user!;
    const cart = await CartModel.findOne({ userId: user._id })
      .populate("items.menuItemId")
      .lean();

    res.json({ cart: cart || { items: [] } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function addToCart(req: AuthRequest, res: Response) {
  try {
    const user = req.user!;
    const { menuItemId, quantity = 1 } = req.body;

    if (!menuItemId) {
      return res.status(400).json({ message: "menuItemId required" });
    }

    const menuItem = await MenuItemModel.findById(menuItemId).lean();
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const restaurant = await RestaurantModel.findById(
      menuItem.restaurantId
    ).lean();
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    let cart = await CartModel.findOne({ userId: user._id });
    if (!cart) {
      cart = await CartModel.create({
        userId: user._id,
        country: restaurant.country,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.menuItemId.toString() === menuItemId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ menuItemId, quantity });
    }

    await cart.save();

    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function updateCartItem(req: AuthRequest, res: Response) {
  try {
    const user = req.user!;
    const { menuItemId, quantity } = req.body;

    if (!menuItemId || quantity < 1) {
      return res.status(400).json({ message: "Invalid item or quantity" });
    }

    const cart = await CartModel.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((i) => i.menuItemId.toString() === menuItemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    res.json({ message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function removeCartItem(req: AuthRequest, res: Response) {
  try {
    const user = req.user!;
    const { menuItemId } = req.params;

    const cart = await CartModel.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.menuItemId.toString() !== menuItemId
    );
    await cart.save();

    res.json({ message: "Item removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function clearCart(req: AuthRequest, res: Response) {
  try {
    const user = req.user!;
    await CartModel.findOneAndDelete({ userId: user._id });
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
