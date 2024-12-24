import mongoose from "mongoose"; // Import mongoose

// Define the schema
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          return /^\S+@\S+\.\S+$/.test(email);
        },
        message: "Please enter a valid email address.",
      },
    },
    imageUrl: {
      type: String,
      required: true,
      default: "https://default-image-url.com/avatar.png",
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual fields
userSchema.virtual("firstName").get(function () {
  return this.fullName.split(" ")[0];
});

userSchema.virtual("lastName").get(function () {
  return this.fullName.split(" ").slice(1).join(" ");
});

// Static method
userSchema.statics.findOrCreateByClerkId = async function (clerkId, userData) {
  let user = await this.findOne({ clerkId });
  if (!user) {
    user = await this.create(userData);
  }
  return user;
};

// Index for email
userSchema.index({ email: 1 });

// Pre-save hook
userSchema.pre("save", async function (next) {
  console.log(`Saving user: ${this.fullName}`);
  next();
});

// Default export for the model
const User = mongoose.model("User", userSchema);
export default User;
