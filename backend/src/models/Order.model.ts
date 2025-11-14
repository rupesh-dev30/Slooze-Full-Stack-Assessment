import mongoose, { Document, Schema } from "mongoose";

export interface IOrderItem {
  menuItemId: Schema.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  status: "CREATED" | "PAID" | "CANCELLED";
  totalAmount: number;
  country: "INDIA" | "AMERICA";
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    items: [
      {
        menuItemId: { type: Schema.Types.ObjectId, ref: "MenuItem" },
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    status: {
      type: String,
      enum: ["CREATED", "PAID", "CANCELLED"],
      default: "CREATED",
    },
    totalAmount: Number,
    country: { type: String, enum: ["INDIA", "AMERICA"], required: true },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
