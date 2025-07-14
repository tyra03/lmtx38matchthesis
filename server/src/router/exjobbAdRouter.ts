 import express, { Request, Response } from "express";
 import { ExjobbAd } from "../model/exjobbAd";
 // import { Student } from "../model/Student"; // or User.ts

 const router = express.Router();

 // Create a new ad
 router.post("/", async (req: Request, res: Response) => {
   // TODO: Authenticate and verify company user!
   const {
    title,
    points,
    location,
    programs,
    numStudents,
    imageUrl,
    description,
    companyId,
    contactEmail,
  } = req.body;
  if (!title || !points || !location || !programs || !numStudents || !description || !companyId || !contactEmail) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const ad = await ExjobbAd.create({
      title,
      points,
      location,
      programs,
      numStudents,
      imageUrl,
      description,
      companyId,
      contactEmail,
    });
     res.status(201).json(ad);
   } catch (err) {
     res.status(500).json({ message: "Could not create ad", error: err });
   }
 });

 // List all APPROVED ads (for students)
 router.get("/", async (_req: Request, res: Response) => {
   try {
     const ads = await ExjobbAd.findAll({ where: { status: "approved" } });
     res.json(ads);
   } catch (err) {
     res.status(500).json({ message: "Could not fetch ads" });
   }
 });

 export default router;
