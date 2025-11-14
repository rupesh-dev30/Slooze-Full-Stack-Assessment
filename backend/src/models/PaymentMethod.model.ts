import { Schema, model, Document } from "mongoose";

export interface IPaymentMethod extends Document {
  userId?: Schema.Types.ObjectId;
  type: string;
  details: any;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    type: String,
    details: Schema.Types.Mixed,
  },
  { timestamps: true }
);

const PaymentMethodModel = model<IPaymentMethod>(
  "PaymentMethod",
  PaymentMethodSchema
);

export default PaymentMethodModel;
