import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/jwt.js";

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch (err) {
    return null;
  }
}
