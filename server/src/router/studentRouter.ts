import express, { Request, Response } from "express";
import { createStudent, verifyStudentLogin } from "../service/studentService";
import { updateStudentInfo } from "../service/studentService";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { User } from "../model";

dotenv.config();
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", async (req: Request, res: Response) => {
  const { name, phone, email, program, password } = req.body;
  if (!name || !phone || !email || !program || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }
  try {
    const student = await createStudent({ name, phone, email, program, password });
    if (!student) {
      return res.status(409).json({ message: "Phone or email already exists" });
    }
    return res.status(201).json(student);
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
    const student = await verifyStudentLogin(identifier, password);
    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Issue JWT token
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not set!");
      return res.status(500).json({ message: "Server misconfiguration: JWT_SECRET missing" });
    }
    const token = jwt.sign({ userId: student.id, role: "student" }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.json({ student, token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error", error: err instanceof Error ? err.message : String(err) });
  }
});

router.get("/me", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decoded as any).userId;

    const student = await User.findByPk(userId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const { password, ...studentData } = student.toJSON();
    res.json(studentData);
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({ message: "Failed to retrieve student info" });
  }
});

router.put("/me", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decoded as any).userId;

    const updated = await updateStudentInfo(userId, req.body); // this uses your existing service
    if (!updated) return res.status(404).json({ message: "Student not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating student profile:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});


router.post("/me/image", upload.single("image"), async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Missing token" });

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decoded as any).userId;

    const student = await User.findByPk(userId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const imageUrl = `/uploads/${req.file.filename}`;
    await student.update({ imageUrl });

    const updated = student.toJSON() as any;
    delete updated.password;
    res.json({ message: "Image uploaded", imageUrl });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ message: "Image upload failed" });
  }
});

export default router;
