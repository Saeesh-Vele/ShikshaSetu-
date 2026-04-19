// backend/routes/profileRoutes.js
import express from "express";

const router = express.Router();

const profiles = new Map();

// GET profile by userId
// GET /api/profile/:userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = profiles.get(userId);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// PUT update or create (upsert) profile
// PUT /api/profile/:userId
router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const payload = req.body || {};
    payload.userId = userId;

    profiles.set(userId, payload);
    const updated = profiles.get(userId);
    res.json(updated);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

export default router;
