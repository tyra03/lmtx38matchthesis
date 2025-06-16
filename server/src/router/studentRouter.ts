import express, { Request, Response } from "express";
import { createStudent } from "../service/studentService";

const router = express.Router();

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

export default router;
