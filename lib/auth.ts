import jwt from "jsonwebtoken";

export async function signToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
}

export async function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET!);
}
