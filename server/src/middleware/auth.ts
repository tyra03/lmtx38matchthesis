import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Missing token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = { userId: (decoded as any).userId, role: (decoded as any).role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireCompany(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.role !== "company") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}

export function requireStudent(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
}