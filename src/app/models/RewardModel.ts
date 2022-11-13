import mongoose from "mongoose";

export interface RewardInput {
    wallet: string;
    tokens: string;
    withdraw: boolean;
    withdrawHash: string;
    withdrawAt: Date;
}

export interface RewardDocument extends RewardInput, mongoose.Document {
    createdAt: Date;
}

const RewardSchema = new mongoose.Schema({
    wallet: {
        type: String,
        unique: true,
        required: true,
    },
    tokens: {
        type: String,
        required: true,
    },
    withdraw: {
        type: Boolean,
        default: false,
    },
    withdrawHash: {
        type: String,
        default: "",
    },
    withdrawdAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<RewardDocument>("Reward", RewardSchema);
