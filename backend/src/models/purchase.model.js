import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true,
            index: true // Index for faster user-related queries
        },
        musicId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Music", 
            required: true 
        },
        amount: { 
            type: Number, 
            required: true,
            min: 0 // Ensures the amount is always a positive number
        },
        reference: { 
            type: String, 
            required: true, 
            unique: true, 
            index: true // Index for faster lookups by reference
        },
        status: { 
            type: String, 
            enum: ["pending", "success", "failed"], 
            default: "pending" 
        },
    },
    { 
        timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
    }
);

// Virtual field to link Music details
purchaseSchema.virtual("music", {
    ref: "Music",
    localField: "musicId",
    foreignField: "_id",
    justOne: true, // Since `musicId` refers to a single Music document
});

// Virtual field to link User details
purchaseSchema.virtual("user", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
    justOne: true, // Since `userId` refers to a single User document
});

// Static method to find a purchase by reference
purchaseSchema.statics.findByReference = async function (reference) {
    return await this.findOne({ reference });
};

// Pre-save middleware to log purchase creation or updates
purchaseSchema.pre("save", function (next) {
    if (this.isNew) {
        console.log(`New purchase created: ${this.reference}`);
    } else {
        console.log(`Purchase updated: ${this.reference}`);
    }
    next();
});

export const Purchase = mongoose.model("Purchase", purchaseSchema);
