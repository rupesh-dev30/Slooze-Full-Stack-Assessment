import type { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../utils/utils.js";
import UserModel from "../models/User.model.js";
import { generateToken } from "../utils/jwt.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export async function registerUser(req: Request, res: Response) {
  try {
    const { name, email, password, role = "MEMBER", country } = req.body;

    if (!name || !email || !password || !country) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
      country,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordMatch = await comparePasswords(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({ userId: user._id, role: user.role });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function logoutUser(req: Request, res: Response) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

export async function me(req: AuthRequest, res: Response) {
  return res.json({ user: req.user });
}
