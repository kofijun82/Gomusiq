import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    audioUrl: { // Fix typo here
        type: String,
        required: true
    },
    duration: { // Fix typo here
        type: Number,
        required: true
    },
    albumId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Album',
        required: false
    },
}, { timestamps: true });
// createdAt, updatedAt

export const Song = mongoose.model("Song", songSchema);
