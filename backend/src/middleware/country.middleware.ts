import type { NextFunction, Response } from "express";
import type { AuthRequest } from "./auth.middleware.js";

export function restrictByCountry(
  getResourceCountry: (req: AuthRequest) => Promise<string | undefined>
) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role === "ADMIN") return next();
    try {
      const resourceCountry = await getResourceCountry(req);
      if (!resourceCountry)
        return res.status(404).json({ message: "Resource not found" });
      if (resourceCountry !== req.user?.country)
        return res.status(403).json({ message: "Not allowed in this country" });
      next();
    } catch (err) {
      next(err);
    }
  };
}
