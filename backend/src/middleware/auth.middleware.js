import jwt from "jsonwebtoken";
import { clerkClient } from "@clerk/express";

/**
 * Middleware to protect routes that require authentication.
 * Validates the JWT token and ensures the user is authenticated.
 */
export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    // Check if the Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Token is required.",
      });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Verify the JWT token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token.",
      });
    }

    // Extract the userId from the decoded token
    const userId = decodedToken?.sub;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token payload.",
      });
    }

    // Fetch the user details from Clerk using the userId
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Unauthorized - User not found.",
      });
    }

    // Attach the user and userId to the request object
    req.auth = {
      userId: user.id,
      user,
    };

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};

/**
 * Middleware to restrict access to admin-only routes.
 * Ensures the user is authenticated and an admin.
 */
export const requireAdmin = async (req, res, next) => {
  try {
    // Ensure the user is authenticated
    if (!req.auth?.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - You must be logged in.",
      });
    }

    // Use the user data fetched in `protectRoute`
    const user = req.auth.user;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Unauthorized - User not found.",
      });
    }

    // Check if the user's email matches one of the admin emails
    const adminEmails = process.env.ADMIN_EMAILS?.split(",").map((email) =>
      email.trim().toLowerCase()
    );
    const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase();

    const isAdmin = adminEmails?.includes(userEmail);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Admin access only.",
      });
    }

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error("Error in requireAdmin middleware:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
  }
};
