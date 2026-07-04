import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  userDid?: string;
  walletAddress?: string;
}

export function tokenAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Access token missing or malformed." });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const secret = process.env.JWT_SECRET || "fallback_secret_nexuscore_identity_2026";
    const decoded = jwt.verify(token, secret) as { sub: string; walletAddress: string };
    
    req.userDid = decoded.sub;
    req.walletAddress = decoded.walletAddress;
    next();
  } catch (error) {
    res.status(403).json({ success: false, error: "Invalid or expired session token." });
  }
}