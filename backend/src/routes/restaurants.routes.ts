import { Router } from "express";
import {
  getRestaurantMenu,
  listRestaurants,
} from "../controllers/restaurantController.js";

const router = Router();

router.get("/", listRestaurants);
router.get("/:id/menu", getRestaurantMenu);

export default router;
