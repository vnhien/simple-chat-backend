import { Response } from "express";
import { verifyJWT } from "../utils/token.utils";
import { RequestExtended, TVerifiedData } from "../global.type";

export const validateJwt = async (req: RequestExtended, res: Response, next: any) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }
    const verifyResult = verifyJWT<TVerifiedData>(token);
    console.log("🚀 ~ validateJwt ~ verifyResult:", verifyResult);
    if (verifyResult.valid) {
      req.userVerifiedData = verifyResult.payload as TVerifiedData;
      next();
      return;
    }
    console.log("🚀 ~ validateJwt ~ token:", token);
    next();
    return;
  } catch (error) {
    res.status(500).send("Internal server error");
    return;
  }
};
