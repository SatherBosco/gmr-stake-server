import mongoose from "mongoose";

export interface StakeInput {
    wallet: string;
    tokens: string;
    startedAt: Date;
    migrate: boolean;
    gasPrice: string;
    transferTransactHash: string;
    stakeTransactHash: string;
    updatedAt: Date;
}

export interface StakeDocument extends StakeInput, mongoose.Document {
    createdAt: Date;
}

const StakeSchema = new mongoose.Schema({
    wallet: {
        type: String,
        unique: true,
        required: true,
    },
    tokens: {
        type: String,
        required: true,
    },
    startedAt: {
        type: Date,
        required: true,
    },
    migrate: {
        type: Boolean,
        default: false,
    },
    gasPrice: {
        type: String,
        default: 0,
    },
    transferTransactHash: {
        type: String,
        default: "",
    },
    stakeTransactHash: {
        type: String,
        default: "",
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<StakeDocument>("Stake", StakeSchema);
