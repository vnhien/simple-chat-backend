import { verify } from "jsonwebtoken";

export function verifyJWT<PayloadType>(token: string) {
  try {
    const res = verify(token, process.env.JWT_SECRET || "") as PayloadType;
    return {
      payload: res,
      valid: true,
    };
  } catch (err) {
    return {
      payload: undefined,
      valid: false,
    };
  }
}
