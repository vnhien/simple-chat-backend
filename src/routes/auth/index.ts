import { Router } from "express";
import { register, login } from "../../controllers/auth.controller";

const authRouter = Router();

// Register route
authRouter.post("/register", register);

// Login route
authRouter.post("/login", login);

export default authRouter;
