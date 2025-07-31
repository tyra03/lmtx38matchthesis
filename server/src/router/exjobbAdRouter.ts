import express, { Request, Response } from "express";
import { ExjobbAd } from "../model/exjobbAd";
import {
  createExjobbAd,
  createOrUpdateAction,
  deleteAction,
  getFavoritesForUser,
} from "../service/exjobbAdService";
import { authenticateJWT, AuthRequest } from "../middleware/auth";
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

  if (
    !title ||
    !points ||
    !location ||
    !programs ||
    !numStudents ||
    !description ||
    !contactEmail
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const ad = await createExjobbAd({
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
    if (!ad) return res.status(400).json({ message: "Invalid company" });
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

router.post(
  "/actions",
  authenticateJWT,
  async (req: AuthRequest, res: Response) => {
    const { adId, type } = req.body;
    if (!adId || !type) {
      return res.status(400).json({ message: "Missing fields" });
    }
    if (!["like", "favorite", "dislike"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }
    try {
      const action = await createOrUpdateAction(req.user!.userId, adId, type);
      res.json(action);
    } catch (err) {
      res.status(500).json({ message: "Failed to save action" });
    }
  }
);

router.delete(
  "/actions/:adId",
  authenticateJWT,
  async (req: AuthRequest, res: Response) => {
    const adId = parseInt(req.params.adId, 10);
    if (isNaN(adId)) {
      return res.status(400).json({ message: "Invalid ad id" });
    }
    try {
      await deleteAction(req.user!.userId, adId);
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete action" });
    }
  }
);

router.get(
  "/favorites",
  authenticateJWT,
  async (req: AuthRequest, res: Response) => {
    try {
      const favs = await getFavoritesForUser(req.user!.userId);
      res.json(favs);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  }
);

 export default router;
