import { Router } from "express";
import { initializePayment, verifyPayment } from "../controller/payment.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * Route to initialize a payment.
 * This route is protected, requiring the user to be authenticated.
 */
router.post("/initialize", protectRoute, initializePayment);

/**
 * Route to verify a payment.
 * This route is also protected to ensure only authenticated users can verify transactions.
 */
router.get("/verify/:reference", protectRoute, verifyPayment);

export default router;
