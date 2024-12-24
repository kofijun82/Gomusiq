import { Router } from "express";
import { 
    getAllSongs, 
    getFeaturedSongs, 
    getMadeForYouSongs, 
    getTrendingSongs 
} from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * Route to get all songs (Admin only)
 * Protects this route and restricts access to users with admin privileges.
 */
router.get("/", protectRoute, requireAdmin, getAllSongs);

/**
 * Route to get featured songs (Accessible to all authenticated users).
 */
router.get("/featured", protectRoute, getFeaturedSongs);

/**
 * Route to get songs personalized for the user (Accessible to authenticated users).
 */
router.get("/made-for-you", protectRoute, getMadeForYouSongs);

/**
 * Route to get trending songs (Accessible to all users, including unauthenticated ones).
 */
router.get("/trending", getTrendingSongs);

export default router;
