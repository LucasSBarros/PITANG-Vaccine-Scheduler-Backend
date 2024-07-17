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

routes.put("/api/schedule/:id", (request, response) =>
  scheduleController.update(request, response)
);

routes.delete("/api/schedule/:id", (request, response) =>
  scheduleController.destroy(request, response)
);

export default routes;
