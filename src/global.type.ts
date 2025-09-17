import { Request } from "express";

export interface RequestExtended extends Request {
  userVerifiedData?: TVerifiedData;
}

export type TVerifiedData = { userId: string };
