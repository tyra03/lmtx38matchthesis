import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createCompany, verifyCompanyLogin, updateCompanyPassword } from "../service/companyService";
import { authenticateJWT, requireCompany, AuthRequest } from "../middleware/auth";
import { getAllStudents } from "../service/studentService";
import { User } from "../model";

dotenv.config();
const router = express.Router();

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

router.get("/students", authenticateJWT, requireCompany, async (_req: AuthRequest, res: Response) => {
  try {
    const students = await getAllStudents();
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Failed to retrieve students" });
  } 
});

export default router;