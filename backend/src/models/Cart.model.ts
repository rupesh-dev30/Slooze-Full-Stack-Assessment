import mongoose, { Document, Schema } from "mongoose";

export interface ICartItem {
  menuItemId: Schema.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  country: "INDIA" | "AMERICA";
}

const CartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        menuItemId: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    country: { type: String, enum: ["INDIA", "AMERICA"], required: true },
  },
  { timestamps: true }
);

const CartModel = mongoose.model<ICart>("Cart", CartSchema);

export default CartModel;
