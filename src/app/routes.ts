import { Router } from "express";

import HealthController from "./controllers/healthController";
import MigrateStakeController from "./controllers/migrateStakeController";

const routes = Router();

// HEALTH -----------------------------------------------------------------------
routes.get("/health/", HealthController.health);
routes.get("/health/dashboard-version", HealthController.dashboardVersion);
routes.get("/health/server-version", HealthController.serverVersion);

// MIGRATE STAKE ----------------------------------------------------------------
routes.post("/migrate/", MigrateStakeController.migrate);
routes.post("/bnb/", MigrateStakeController.bnb);
routes.post("/create/", MigrateStakeController.create);

export default routes;
