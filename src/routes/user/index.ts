import { Router } from "express";
import { RequestExtended } from "../../global.type";
import { getUserData } from "../../controllers/user.controllers";

const userRouter = Router();

userRouter.get("/info", getUserData);

export default userRouter;
