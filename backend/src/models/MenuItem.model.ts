import mongoose, { Document, Schema } from "mongoose";

export interface IMenuItem extends Document {
  restaurantId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  category?: string;
  isAvailable: boolean;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const MenuItemModel = mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);

export default MenuItemModel;
