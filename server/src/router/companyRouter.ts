import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createCompany, verifyCompanyLogin } from "../service/companyService";
import { authenticateJWT, requireCompany, AuthRequest } from "../middleware/auth";
import { User, ApprovedCompanyEmail } from "../model";

dotenv.config();
const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { name, phone, email, password, companyName, token } = req.body;
  if (!name || !phone || !email || !password || !companyName || !token) {
    return res.status(400).json({ message: "Missing fields" });
  }
  try {
    const approved = await ApprovedCompanyEmail.findOne({ where: { email, token } });
    if (!approved) {
      return res.status(403).json({ message: "Email not approved for registration" });
    }
    const company = await createCompany({ name, phone, email, password, companyName });
    if (!company) {
      return res.status(409).json({ message: "Phone or email already exists" });
    }
    await approved.destroy();
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

export default router;