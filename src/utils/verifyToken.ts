// utils/verifyToken.ts
import jwt from 'jsonwebtoken';

export interface DecodedToken {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export function verifyTokenFromHeader(authHeader?: string): DecodedToken {

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No or invalid Authorization header");
  }

  const token = authHeader.split(" ")[1];
  console.log("Verifying token:", token);
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET;
  if (!secret) throw new Error("JWT secret not defined");

  try {
    return jwt.verify(token, secret) as DecodedToken;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
