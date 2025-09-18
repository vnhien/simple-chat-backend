import { Router } from "express";
import { RequestExtended } from "../../global.type";
import { addFriend, friendList, getUserData } from "../../controllers/user.controllers";

const userRouter = Router();

userRouter.get("/info", getUserData);
userRouter.get("/friend-list", friendList);
userRouter.post("/add-friend", addFriend);

export default userRouter;
