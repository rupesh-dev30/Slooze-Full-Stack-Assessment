import "dotenv/config";
import { connectDB } from "./db.js";
import UserModel from "../models/User.model.js";
import RestaurantModel from "../models/Restaurant.model.js";
import MenuItemModel from "../models/MenuItem.model.js";
import PaymentMethodModel from "../models/PaymentMethod.model.js";
import { hashPassword } from "../utils/utils.js";

async function seed() {
  await connectDB();

  await UserModel.deleteMany({});
  await RestaurantModel.deleteMany({});
  await MenuItemModel.deleteMany({});
  await PaymentMethodModel.deleteMany({});

  const pwd = await hashPassword("password123");

  // Admin + employees per spec
  const users = [
    { name: "Nick Fury", email: "nick@avengers.com", password: pwd, role: "ADMIN", country: "AMERICA" },
    { name: "Captain Marvel", email: "cm@company.com", password: pwd, role: "MANAGER", country: "INDIA" },
    { name: "Captain America", email: "ca@company.com", password: pwd, role: "MANAGER", country: "AMERICA" },
    { name: "Thanos", email: "thanos@company.com", password: pwd, role: "MEMBER", country: "INDIA" },
    { name: "Thor", email: "thor@company.com", password: pwd, role: "MEMBER", country: "INDIA" },
    { name: "Travis", email: "travis@company.com", password: pwd, role: "MEMBER", country: "AMERICA" },
  ];

  const createdUsers = await UserModel.insertMany(users);

  // Restaurants (assume)
  const r1 = await RestaurantModel.create({ name: "Bombay Tadka", country: "INDIA", description: "Indian cuisine" });
  const r2 = await RestaurantModel.create({ name: "NY Deli", country: "AMERICA", description: "American sandwiches" });

  // Menu items
  await MenuItemModel.insertMany([
    { restaurantId: r1._id, name: "Butter Chicken", price: 8.99, category: "Main" },
    { restaurantId: r1._id, name: "Paneer Tikka", price: 7.5, category: "Starter" },
    { restaurantId: r2._id, name: "Club Sandwich", price: 9.99, category: "Main" },
    { restaurantId: r2._id, name: "Caesar Salad", price: 6.5, category: "Starter" },
  ]);

  // Payment methods: create one for Nick (admin) and for each user optionally
  if (createdUsers[0]) {
    await PaymentMethodModel.create({ userId: createdUsers[0]._id, type: "CARD", details: { last4: "4242" } });
  }
  if (createdUsers[1]) {
    await PaymentMethodModel.create({ userId: createdUsers[1]._id, type: "UPI", details: { id: "captain@upi" } });
  }

  console.log("Seed completed");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
