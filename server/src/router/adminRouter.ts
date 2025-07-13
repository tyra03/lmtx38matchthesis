import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getPendingAds, updateAdStatus } from "../service/exjobbAdService";
import { verifyAdminLogin } from "../service/adminService"

dotenv.config();

const router = express.Router();

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if ((decoded as any).role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    (req as any).userId = (decoded as any).userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

router.get("/pending-ads", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const ads = await getPendingAds();
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch pending ads" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }
  try {
    const admin = await verifyAdminLogin(identifier, password);
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not set!");
      return res.status(500).json({ message: "Server misconfiguration: JWT_SECRET missing" });
    }
    const token = jwt.sign({ userId: admin.id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ admin, token });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/ads/:id/status", requireAdmin, async (req: Request, res: Response) => {
  const adId = parseInt(req.params.id, 10);
  if (isNaN(adId)) return res.status(400).json({ message: "Invalid ad id" });
  const { status } = req.body;
  if (status !== "accepted" && status !== "rejected") {
    return res.status(400).json({ message: "Invalid status" });
  }

  const adminId = (req as any).userId;
  try {
  const ad = await updateAdStatus(adId, status, adminId);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.json(ad);
  } 
  catch (err) {
    res.status(500).json({ message: "Could not update ad status" });
  }
});

export default router;