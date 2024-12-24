import { Router } from "express";
import { createAlbum, createSong, deleteSong, deleteALbum } from '../controller/admin.controller.js';
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute, requireAdmin);

const checkAdmin = (req, res) => {
    res.json({ message: "Admin access verified" });
};

router.get("/check", checkAdmin);

router.post("/songs", createSong);
router.delete("/songs/:id", deleteSong);

router.post("/albums", createAlbum);
router.delete("/albums/:id", deleteALbum);

export default router;
