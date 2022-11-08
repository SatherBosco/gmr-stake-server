import express from "express";
import cors from "cors";

import routes from "./routes";
import Database from "../database";

export class App {
    public server: express.Application;

    constructor() {
        this.server = express();
        this.middlewares();
        Database();
        this.routes();
    }

    private middlewares() {
        this.server.use(cors());
        // Add Access Control Allow Origin headers
        this.server.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            next();
        });

        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: false }));
    }

    private routes() {
        this.server.use(routes);
    }
}
