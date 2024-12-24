import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,  // Use ObjectId if referencing the User model
        ref: "User", // Replace "User" with the actual model name for users
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,  // Use ObjectId if referencing the User model
        ref: "User", // Replace "User" with the actual model name for users
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);
