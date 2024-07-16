import { Router } from "express";
import ScheduleController from "../controllers/schedule.controller.mjs";

const routes = Router();
const scheduleController = new ScheduleController();

routes.post("/api/schedule", (request, response) =>
  scheduleController.store(request, response)
);

routes.get("/api/schedule", (request, response) =>
  scheduleController.index(request, response)
);

export default routes;
