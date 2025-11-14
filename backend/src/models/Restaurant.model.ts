import mongoose, { Document, Schema } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  country: "INDIA" | "AMERICA";
  description?: string;
}

const RestaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true },
  country: { type: String, enum: ["INDIA", "AMERICA"], required: true },
  description: String,
});

const RestaurantModel = mongoose.model<IRestaurant>(
  "Restaurant",
  RestaurantSchema
);

export default RestaurantModel;