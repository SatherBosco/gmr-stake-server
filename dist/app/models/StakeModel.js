"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const StakeSchema = new mongoose_1.default.Schema({
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
    bnb: {
        type: Boolean,
        default: false,
    },
    bnbHash: {
        type: String,
        default: "",
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
exports.default = mongoose_1.default.model("Stake", StakeSchema);
