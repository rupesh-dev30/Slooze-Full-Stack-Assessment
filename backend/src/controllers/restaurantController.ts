import type { Request, Response } from "express";
import RestaurantModel from "../models/Restaurant.model.js";
import MenuItemModel from "../models/MenuItem.model.js";

export async function listRestaurants(req: Request, res: Response) {
  try {
    const restaurants = await RestaurantModel.find().lean();
    res.status(201).json({ restaurants });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
}

export async function getRestaurantMenu(req: Request, res: Response) {
  try {
    const restaurantId = req.params.id;
    const restaurant = await RestaurantModel.findById(restaurantId).lean();
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const menu = await MenuItemModel.find({ restaurantId }).lean();
    res.json({ restaurant, menu });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
