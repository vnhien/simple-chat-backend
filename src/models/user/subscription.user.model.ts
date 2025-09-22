import { model, Schema } from "mongoose";
import { PushSubscription } from "web-push";

export type TSubscription = {
  userId: string;
  subscription: PushSubscription;
  createdAt: number;
  updatedAt: number;
  clientId: string;
};

export const SubScriptionSchema = new Schema<TSubscription>({
  createdAt: { type: Number, default: Date.now() },
  updatedAt: { type: Number, default: Date.now() },
  userId: { type: String, index: true, required: true, unique: true },
  clientId: { type: String, required: false },
  subscription: { type: Schema.Types.Mixed, required: false },
});

export const SubScriptionModel = model<TSubscription>("subscription", SubScriptionSchema);
