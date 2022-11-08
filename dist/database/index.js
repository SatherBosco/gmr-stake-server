"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
function Database() {
    mongoose_1.default
        .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.1ml12oj.mongodb.net/stakes?retryWrites=true&w=majority`)
        .then(() => {
        console.log("Conectou ao banco de dados!");
    })
        .catch((err) => console.log(err));
    mongoose_1.default.Promise = global.Promise;
}
exports.default = Database;
