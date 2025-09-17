import { RequestExtended } from "../global.type";
import { Response, Request } from "express";
import { User } from "../models/user/user.model";

export const getUserData = async (req: RequestExtended, res: Response) => {
  try {
    const { userId } = req.userVerifiedData || {};
    const userData = await User.findOne({ userId });
    if (!userData) {
      res.status(404).send("User not found");
      return;
    }
    res.status(200).json({
      data: userData,
    });
    return;
  } catch (error) {
    res.status(500).send("Internal server error");
    return;
  }
};
