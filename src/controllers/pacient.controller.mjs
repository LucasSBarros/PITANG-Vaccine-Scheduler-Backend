import crypto from "node:crypto";
import {
  addPacient,
  getPacients,
  updatePacients,
  deletePacientById,
} from "../services/pacient.service.mjs";
import { deleteSchedulesByPacientId } from "../services/schedule.service.mjs";
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

  index(request, response) {
    const pacients = getPacients();
    response.send({
      page: 1,
      pageSize: 20,
      totalCount: pacients.length,
      items: pacients,
    });
  }

  update(request, response) {
    const { id } = request.params;
    const { fullName, birthDate } = request.body;

    const pacients = getPacients().map((pacient) => {
      if (pacient.id === id) {
        return { ...pacient, fullName, birthDate };
      }
      return pacient;
    });

    updatePacients(pacients);
    response.status(201).send({ message: "Paciente atualizado" });
  }

  destroy(request, response) {
    const { id } = request.params;

    deletePacientById(id);
    deleteSchedulesByPacientId(id);

    console.log(`Pacient with id ${id} deleted along with their schedules`);

    response.status(204).send();
  }
}
