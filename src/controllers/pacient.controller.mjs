import crypto from "node:crypto";
import { addPacient } from "../services/pacient.service.mjs";
import pacientSchema from "../schemas/pacient.schema.mjs";

export default class PacientController {
  store(request, response) {
    const pacient = request.body;
    const { success, data, error } = pacientSchema.safeParse(pacient);

    if (!success) {
      return response.status(400).send(error);
    }

    const [id] = crypto.randomUUID().split("-");
    data.id = id;

    addPacient(data);

    response
      .status(201)
      .send({ message: "Paciente criado com sucesso.", data });
  }
}
