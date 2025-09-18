import { Router } from "express";
import { subscribeToNotification } from "../../controllers/subscription.controllers";

const chatRouter = Router();

chatRouter.post("/subscribe", subscribeToNotification);

export default chatRouter;
