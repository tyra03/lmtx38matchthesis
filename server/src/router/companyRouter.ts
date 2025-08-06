import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyCompanyLogin, updateCompanyPassword, createCompany } from "../service/companyService";
import { authenticateJWT, requireCompany, AuthRequest } from "../middleware/auth";
import { getStudentsByPrograms } from "../service/studentService";
import { getAdsForCompany, getStudentsForAd } from "../service/exjobbAdService";
import { User } from "../model";
import { ExjobbAd } from "../model/exjobbAd";
import {
  addStudentAction,
  listMatchesForCompany,
  listMessages,
  sendMessage,
} from "../service/matchService";

dotenv.config();
const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { name, phone, email, password, companyName } = req.body;
  if (!name || !phone || !email || !password || !companyName) {
    return res.status(400).json({ message: "Missing fields" });
  }
  try {
    const company = await createCompany({ name, phone, email, password, companyName });
    if (!company) {
      return res.status(409).json({ message: "Phone or email already exists" });
    }
    return res.status(201).json(company);
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }
  try {
    const company = await verifyCompanyLogin(identifier, password);
    if (!company) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not set!");
      return res.status(500).json({ message: "Server misconfiguration: JWT_SECRET missing" });
    }
    const token = jwt.sign({ userId: company.id, role: "company" }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.json({ company, token });
  } catch (err) {
    console.error("Company login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authenticateJWT, requireCompany, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const company = await User.findByPk(userId);
    if (!company) return res.status(404).json({ message: "Company not found" });
    const { password, ...companyData } = company.toJSON();
    res.json(companyData);
  } catch (err) {
    console.error("Error fetching company:", err);
    res.status(500).json({ message: "Failed to retrieve company info" });
  }
});

router.get("/me/ads", authenticateJWT, requireCompany, async (req: AuthRequest, res: Response) => {
  try {
    const ads = await getAdsForCompany(req.user!.userId);
    res.json(ads);
  } catch (err) {
    console.error("Error fetching company ads:", err);
    res.status(500).json({ message: "Failed to retrieve ads" });
  }
});

router.patch("/me/password", authenticateJWT, requireCompany, async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing fields" });
    }

    try {
      const result = await updateCompanyPassword(
        req.user!.userId,
        currentPassword,
        newPassword,
      );
      if (result === null) {
        return res.status(404).json({ message: "Company not found" });
      }
      if (!result) {
        return res.status(401).json({ message: "Current password incorrect" });
      }
      res.json({ message: "Password updated" });
    } catch (err) {
      console.error("Error updating company password:", err);
      res.status(500).json({ message: "Failed to update password" });
      }
});

router.get("/students", authenticateJWT, requireCompany, async (req: AuthRequest, res: Response) => {
  try {
    const companyId = req.user!.userId;
    const ads = await ExjobbAd.findAll({ where: { companyId, status: "approved" } });

    const programs = Array.from(new Set(ads.flatMap((ad) => ad.programs)));

    const students = programs.length > 0 ? await getStudentsByPrograms(programs) : [];    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Failed to retrieve students" });
  }
});

router.get("/ads/:id/students", authenticateJWT, requireCompany, async (req: AuthRequest, res: Response) => {
  const adId = parseInt(req.params.id, 10);
  if (isNaN(adId)) {
    return res.status(400).json({ message: "Invalid ad id" });
  }
  try {
    const ad = await ExjobbAd.findByPk(adId);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    if (ad.companyId !== req.user!.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const students = await getStudentsForAd(adId);
    res.json(students);
  } catch (err) {
    console.error("Error fetching students for ad:", err);
    res.status(500).json({ message: "Failed to retrieve students" });
}   
});

router.post(
  "/students/:id/:action(like|favorite|dislike)",
  authenticateJWT,
  requireCompany,
  async (req: AuthRequest, res: Response) => {
    const studentId = parseInt(req.params.id, 10);
    const type = req.params.action as "like" | "favorite" | "dislike";
    if (isNaN(studentId)) {
      return res.status(400).json({ message: "Invalid student id" });
    }
    try {
      const result = await addStudentAction(req.user!.userId, studentId, type);
      res.json(result);
    } catch (err) {
      console.error("Error recording student action:", err);
      res.status(500).json({ message: "Failed to record action" });
    }
  }
);

router.get(
  "/matches",
  authenticateJWT,
  requireCompany,
  async (req: AuthRequest, res: Response) => {
    try {
      const matches = await listMatchesForCompany(req.user!.userId);
      res.json(matches);
    } catch (err) {
      console.error("Error fetching matches:", err);
      res.status(500).json({ message: "Failed to retrieve matches" });
    }
  }
);

router.get(
  "/matches/:id/messages",
  authenticateJWT,
  requireCompany,
  async (req: AuthRequest, res: Response) => {
    const matchId = parseInt(req.params.id, 10);
    if (isNaN(matchId)) {
      return res.status(400).json({ message: "Invalid match id" });
    }
    try {
      const messages = await listMessages(matchId);
      res.json(messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      res.status(500).json({ message: "Failed to retrieve messages" });
    }
  }
);

router.post(
  "/matches/:id/messages",
  authenticateJWT,
  requireCompany,
  async (req: AuthRequest, res: Response) => {
    const matchId = parseInt(req.params.id, 10);
    const { content } = req.body;
    if (isNaN(matchId)) {
      return res.status(400).json({ message: "Invalid match id" });
    }
    if (!content) {
      return res.status(400).json({ message: "Missing content" });
    }
    try {
      const message = await sendMessage(matchId, req.user!.userId, "company", content);
      res.json(message);
    } catch (err) {
      console.error("Error sending message:", err);
      res.status(500).json({ message: "Failed to send message" });
    }
  }
);

export default router;