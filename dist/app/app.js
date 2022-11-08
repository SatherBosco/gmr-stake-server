"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const database_1 = __importDefault(require("../database"));
class App {
    constructor() {
        this.server = (0, express_1.default)();
        this.middlewares();
        (0, database_1.default)();
        this.routes();
    }
    middlewares() {
        this.server.use((0, cors_1.default)());
        // Add Access Control Allow Origin headers
        this.server.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            next();
        });
        this.server.use(express_1.default.json());
        this.server.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.server.use(routes_1.default);
    }
}
exports.App = App;
