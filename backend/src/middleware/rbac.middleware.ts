import type { NextFunction, Response } from "express";
import type { AuthRequest } from "./auth.middleware.js";

export function permit(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
