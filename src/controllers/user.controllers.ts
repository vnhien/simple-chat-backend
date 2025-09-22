import { RequestExtended } from "../global.type";
import { Response, Request } from "express";
import { User } from "../models/user/user.model";
import { FriendModel } from "../models/user/friend.user.model";
import { SubScriptionModel } from "../models/user/subscription.user.model";

export const getUserData = async (req: RequestExtended, res: Response) => {
  try {
    const { userId, clientId } = req.userVerifiedData || {};
    const userData = await User.findOne({ userId });
    if (!userData) {
      res.status(404).send("User not found");
      return;
    }
    const subsciption = await SubScriptionModel.findOne({ userId: userId, clientId });

    res.status(200).json({
      userId: userData.userId,
      username: userData.username,
      subscription: subsciption?.subscription || null,
    });
    return;
  } catch (error) {
    res.status(500).send("Internal server error");
    return;
  }
};

export const addFriend = async (req: RequestExtended, res: Response) => {
  try {
    const { userId } = req.userVerifiedData || {};
    const { name } = req.body;
    const friendData = await User.findOne({ username: name });
    if (!friendData) {
      res.status(404).send("Friend not found");
      return;
    }
    await FriendModel.create({
      userId,
      friendId: friendData.userId,
      friendName: friendData.username,
    });
    res.status(200).send("Friend added successfully");
    return;
  } catch (error) {
    res.status(500).send("Internal server error");
    return;
  }
};

export const friendList = async (req: RequestExtended, res: Response) => {
  try {
    const { userId } = req.userVerifiedData || {};
    const friends = await FriendModel.find({ userId });
    res.json({
      friends:
        friends.map((friend) => ({
          friendId: friend.friendId,
          friendName: friend.friendName,
        })) || [],
    });
    return;
  } catch (error) {
    res.status(500).send("Internal server error");
    return;
  }
};
