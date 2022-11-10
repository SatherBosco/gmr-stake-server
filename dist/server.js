"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app/app");
const OldStakeABI_json_1 = __importDefault(require("./app/contracts/OldStakeABI.json"));
const ethers_1 = require("ethers");
const migrateStakeController_1 = __importDefault(require("./app/controllers/migrateStakeController"));
new app_1.App().server.listen(3333, () => console.log("Server is running! Port: 3333"));
const listenToEvents = () => {
    const NODE_URL = "https://bsc-dataseed.binance.org/";
    const provider = new ethers_1.ethers.providers.JsonRpcProvider(NODE_URL);
    const oldStakeObj = new ethers_1.ethers.Contract("0x26Db0a816699a87a57F6E451364C500f7E229a7E", OldStakeABI_json_1.default, provider);
    oldStakeObj.on("Withdrawn", (user, amount) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`
        EVENT - EXIT
        From ${user}
        Amount ${amount}
        `);
        migrateStakeController_1.default.migrate(user.toLowerCase());
    }));
};
listenToEvents();
