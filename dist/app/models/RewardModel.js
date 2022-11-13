"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RewardSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model("Reward", RewardSchema);
