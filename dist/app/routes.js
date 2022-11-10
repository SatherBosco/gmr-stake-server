"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const healthController_1 = __importDefault(require("./controllers/healthController"));
const migrateStakeController_1 = __importDefault(require("./controllers/migrateStakeController"));
const routes = (0, express_1.Router)();
// HEALTH -----------------------------------------------------------------------
routes.get("/health/", healthController_1.default.health);
routes.get("/health/dashboard-version", healthController_1.default.dashboardVersion);
routes.get("/health/server-version", healthController_1.default.serverVersion);
// MIGRATE STAKE ----------------------------------------------------------------
// routes.post("/migrate/", MigrateStakeController.migrate);
routes.post("/bnb/", migrateStakeController_1.default.bnb);
// routes.post("/create/", MigrateStakeController.create);
exports.default = routes;
