import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

// Get all users except the currently authenticated user
export const getAllUsers = async (req, res, next) => {
    try {
        const currentUserId = req.auth.userId;
        const users = await User.find({ clerkId: { $ne: currentUserId } });
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

// Get messages between the current user and a specific user
export const getMessages = async (req, res, next) => {
    try {
        const myId = req.auth.userId;
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: myId },
                { senderId: myId, receiverId: userId },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

// Sync user data from Clerk to MongoDB
export const syncUser = async (req, res) => {
    const { id, email, firstName, lastName } = req.body; // Get user data from the request body

    try {
        // Check if the user already exists based on Clerk's user ID
        let user = await User.findOne({ clerkId: id });

        if (!user) {
            // If user doesn't exist, create a new user in MongoDB
            user = await User.create({
                clerkId: id,
                email,
                firstName,
                lastName,
            });
        } else {
            // If user exists, update the user's information
            user.email = email;
            user.firstName = firstName;
            user.lastName = lastName;
            await user.save();
        }

        res.status(200).json({ success: true, user });
    } catch (err) {
        console.error("Error syncing user:", err);
        res.status(500).json({ success: false, message: "Error syncing user" });
    }
};
