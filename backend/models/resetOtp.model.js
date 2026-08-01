import mongoose from "mongoose";

const resetOtpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        otp: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

    },

    {
        timestamps: true,
    }
);

resetOtpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

export default mongoose.model("ResetOtp", resetOtpSchema);