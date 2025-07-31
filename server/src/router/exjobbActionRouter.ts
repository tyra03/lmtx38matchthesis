import express, { Request, Response } from "express";
import { authenticateJWT, AuthRequest } from "../middleware/auth";
import {
  createAction,
  deleteAction,
  getFavoriteAdsForUser,
} from "../service/exjobbActionService";

const router = express.Router();

// Create a new action on an ad
router.post("/exjobbads/:adId/actions", authenticateJWT, async (req: AuthRequest, res: Response) => {
  const adId = parseInt(req.params.adId, 10);
  const { type } = req.body as { type?: "like" | "dislike" | "favorite" };

  if (!type || !["like", "dislike", "favorite"].includes(type)) {
    return res.status(400).json({ message: "Invalid action type" });
  }
  if (isNaN(adId)) {
    return res.status(400).json({ message: "Invalid ad id" });
  }

  try {
    const action = await createAction(req.user!.userId, adId, type);
    res.status(201).json(action);
  } catch (err) {
    res.status(500).json({ message: "Could not create action" });
  }
});

// Delete an action
router.delete("/exjobbads/:adId/actions/:actionId", authenticateJWT, async (req: AuthRequest, res: Response) => {
  const actionId = parseInt(req.params.actionId, 10);
  if (isNaN(actionId)) {
    return res.status(400).json({ message: "Invalid action id" });
  }
  try {
    const result = await deleteAction(actionId, req.user!.userId);
    if (!result) return res.status(404).json({ message: "Action not found" });
    res.json({ message: "Action deleted" });
  } catch (err) {
    res.status(500).json({ message: "Could not delete action" });
  }
});

// List favorited ads for a user
router.get("/users/:userId/favorites", async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  try {
    const ads = await getFavoriteAdsForUser(userId);
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch favorites" });
  }
});

export default router;