import { Request, Response } from "express";
import { SubScriptionModel } from "../models/user/subscription.user.model";
import { RequestExtended } from "../global.type";

export const subscribeToNotification = async (req: RequestExtended, res: Response) => {
  const { subscription } = req.body;
  const { userId, clientId } = req.userVerifiedData || {};
  await SubScriptionModel.updateOne(
    { userId },
    {
      subscription: subscription,
      clientId,
    },
    {
      upsert: true,
    }
  );

  res.json({ message: "Subscription successful" });
};
