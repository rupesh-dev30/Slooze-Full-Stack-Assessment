import type { Response } from "express";
import PaymentMethodModel from "../models/PaymentMethod.model.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";

export async function listPaymentMethods(req: AuthRequest, res: Response) {
  try {
    const user = req.user!;
    const methods = await PaymentMethodModel.find({ userId: user._id }).lean();
    res.json({ methods });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
}

export async function updatePaymentMethod(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id;
    const updates = req.body;
    const method = await PaymentMethodModel.findByIdAndUpdate(id, updates, {
      new: true,
    }).lean();
    if (!method)
      return res.status(404).json({ message: "Payment method not found" });
    res.json({ message: "Updated", method });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
}

export async function createPaymentMethod(req: AuthRequest, res: Response) {
  try {
    const user = req.user!;
    const { type, details } = req.body;
    if (!type || !details)
      return res.status(400).json({ message: "type and details required" });
    const method = await PaymentMethodModel.create({
      userId: user._id,
      type,
      details,
    });
    res.status(201).json({ method });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
}
