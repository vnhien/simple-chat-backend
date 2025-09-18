import { model, Schema } from "mongoose";

export type TFriend = {
  userId: string;
  friendId: string;
  friendName: string;
  createdAt: number;
  updatedAt: number;
};

export const FriendSchema: Schema<TFriend> = new Schema({
  userId: { type: String },
  friendId: String,
  friendName: String,
  createdAt: { type: Number, default: Date.now() },
  updatedAt: { type: Number, default: Date.now() },
});

export const FriendModel = model<TFriend>("friend", FriendSchema);
