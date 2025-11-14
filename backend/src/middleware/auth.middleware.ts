import type { Request, Response, NextFunction } from "express";
import UserModel, { type IUser } from "../models/User.model.js";
import { verifyToken } from "../utils/jwt.js";

export interface AuthRequest extends Request {
  cookies: Record<string, string | undefined>;
  user?: IUser;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const cookieName: string = process.env.COOKIE_NAME || "token";
    const token = req.cookies?.[cookieName];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = verifyToken(token);

    if (!payload || !payload.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await UserModel.findById(payload.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
