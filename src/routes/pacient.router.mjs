import { Router } from "express";
import PacientController from "../controllers/pacient.controller.mjs";

const routes = Router();
const pacientController = new PacientController();

routes.post("/api/pacient", (request, response) =>
  pacientController.store(request, response)
);

routes.get("/api/pacient", (request, response) =>
  pacientController.index(request, response)
);

routes.put("/api/pacient/:id", (request, response) =>
  pacientController.update(request, response)
);

export default routes;
