import "dotenv/config";
import { connectDB } from "./db.js";
import UserModel from "../models/User.model.js";
import RestaurantModel from "../models/Restaurant.model.js";
import MenuItemModel from "../models/MenuItem.model.js";
import PaymentMethodModel from "../models/PaymentMethod.model.js";
import { hashPassword } from "../utils/utils.js";
import CartModel from "../models/Cart.model.js";
import OrderModel from "../models/Order.model.js";

async function seed() {
  await connectDB();

  await UserModel.deleteMany({});
  await RestaurantModel.deleteMany({});
  await MenuItemModel.deleteMany({});
  await PaymentMethodModel.deleteMany({});
  await CartModel.deleteMany({});
  await OrderModel.deleteMany({});

  const pwd = await hashPassword("password123");

  // Admin + employees per spec
  const users = [
    {
      name: "Nick Fury",
      email: "nick@avengers.com",
      password: pwd,
      role: "ADMIN",
      country: "AMERICA",
    },
    {
      name: "Captain Marvel",
      email: "cm@company.com",
      password: pwd,
      role: "MANAGER",
      country: "INDIA",
    },
    {
      name: "Captain America",
      email: "ca@company.com",
      password: pwd,
      role: "MANAGER",
      country: "AMERICA",
    },
    {
      name: "Thanos",
      email: "thanos@company.com",
      password: pwd,
      role: "MEMBER",
      country: "INDIA",
    },
    {
      name: "Thor",
      email: "thor@company.com",
      password: pwd,
      role: "MEMBER",
      country: "INDIA",
    },
    {
      name: "Travis",
      email: "travis@company.com",
      password: pwd,
      role: "MEMBER",
      country: "AMERICA",
    },
  ];

  const createdUsers = await UserModel.insertMany(users);

  // Restaurants (assume)
  const r1 = await RestaurantModel.create({
    name: "Bombay Tadka",
    country: "INDIA",
    description:
      "Authentic Indian cuisine with rich spices and traditional curries.",
  });

  const r2 = await RestaurantModel.create({
    name: "NY Deli",
    country: "AMERICA",
    description:
      "Classic American deli serving sandwiches, bagels, and cheesecakes.",
  });

  const r3 = await RestaurantModel.create({
    name: "Spice Villa",
    country: "INDIA",
    description:
      "Modern Indian restaurant offering regional specialties and street food classics.",
  });

  const r4 = await RestaurantModel.create({
    name: "The Burger Joint",
    country: "AMERICA",
    description: "Gourmet burgers, crispy fries, and thick milkshakes.",
  });

  const r5 = await RestaurantModel.create({
    name: "Curry Leaf",
    country: "INDIA",
    description:
      "South Indian dishes like dosas, idlis, and coconut-based curries.",
  });

  const r6 = await RestaurantModel.create({
    name: "Texas BBQ House",
    country: "AMERICA",
    description:
      "Slow-smoked barbecue meats and tangy sauces served Texas-style.",
  });

  const r7 = await RestaurantModel.create({
    name: "Tandoori Nights",
    country: "INDIA",
    description:
      "Grilled kebabs and tandoori platters straight from the clay oven.",
  });

  const r8 = await RestaurantModel.create({
    name: "Maple & Grill",
    country: "AMERICA",
    description:
      "Rustic American dining with steaks, ribs, and grilled seafood.",
  });

  const r9 = await RestaurantModel.create({
    name: "The Punjabi Rasoi",
    country: "INDIA",
    description: "Bold Punjabi flavors featuring butter chicken and parathas.",
  });

  const r10 = await RestaurantModel.create({
    name: "Sunny Side Café",
    country: "AMERICA",
    description:
      "Casual breakfast and brunch café with pancakes, omelets, and coffee.",
  });

  const r11 = await RestaurantModel.create({
    name: "Urban Thali",
    country: "INDIA",
    description:
      "All-you-can-eat Indian thali with a variety of regional dishes.",
  });

  const r12 = await RestaurantModel.create({
    name: "Shake Shack Express",
    country: "AMERICA",
    description: "Fast-casual burgers and shakes with a modern American vibe.",
  });

  const r13 = await RestaurantModel.create({
    name: "Masala Magic",
    country: "INDIA",
    description:
      "Fusion of North and South Indian dishes served in a cozy setting.",
  });

  const r14 = await RestaurantModel.create({
    name: "The Bay Diner",
    country: "AMERICA",
    description: "Classic diner with burgers, fries, and all-day breakfast.",
  });

  const r15 = await RestaurantModel.create({
    name: "Biryani House",
    country: "INDIA",
    description: "Hyderabadi biryanis and kebabs packed with royal flavors.",
  });

  const r16 = await RestaurantModel.create({
    name: "Smokehouse Grill",
    country: "AMERICA",
    description: "Chargrilled steaks, BBQ platters, and craft beer.",
  });

  const r17 = await RestaurantModel.create({
    name: "The Chaat Company",
    country: "INDIA",
    description: "Street-style chaats, golgappas, and spiced masala tea.",
  });

  const r18 = await RestaurantModel.create({
    name: "Brooklyn Slice",
    country: "AMERICA",
    description: "New York-style pizza by the slice with classic toppings.",
  });

  const r19 = await RestaurantModel.create({
    name: "Royal Spice Hub",
    country: "INDIA",
    description:
      "Fine dining restaurant offering Mughlai and Rajasthani cuisine.",
  });

  const r20 = await RestaurantModel.create({
    name: "Harbor Grill",
    country: "AMERICA",
    description: "Coastal American seafood and chowders served fresh daily.",
  });

  // Menu items
  await MenuItemModel.insertMany([
    {
      restaurantId: r1._id,
      name: "Butter Chicken",
      price: 8.99,
      category: "Main",
    },
    {
      restaurantId: r1._id,
      name: "Paneer Tikka",
      price: 7.5,
      category: "Starter",
    },
    {
      restaurantId: r2._id,
      name: "Club Sandwich",
      price: 9.99,
      category: "Main",
    },
    {
      restaurantId: r2._id,
      name: "Caesar Salad",
      price: 6.5,
      category: "Starter",
    },
  ]);

  // Payment methods: create one for Nick (admin) and for each user optionally
  if (createdUsers[0]) {
    await PaymentMethodModel.create({
      userId: createdUsers[0]._id,
      type: "CARD",
      details: { last4: "4242" },
    });
  }
  if (createdUsers[1]) {
    await PaymentMethodModel.create({
      userId: createdUsers[1]._id,
      type: "UPI",
      details: { id: "captain@upi" },
    });
  }

  console.log("Seed completed");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
