import crypto from "node:crypto";
import { getPacients } from "../services/pacient.service.mjs";
import { getSchedules, addSchedule } from "../services/schedule.service.mjs";
import scheduleSchema from "../schemas/schedule.schema.mjs";

export default class ScheduleController {
  store(request, response) {
    const schedule = request.body;
    const { success, data, error } = scheduleSchema.safeParse(schedule);

    if (!success) {
      return response.status(400).send(error);
    }

    const pacient = getPacients().find(p => p.id === data.pacientId);
    if (!pacient) {
      return response.status(400).json({ error: "Paciente não encontrado." });
    }

    const [id] = crypto.randomUUID().split("-");
    data.id = id;

    const { scheduleDate, scheduleTime } = data;
    const formattedDate = scheduleDate.toISOString().split("T")[0];

    const daySchedules = getSchedules().filter((s) => s.scheduleDate === formattedDate);
    if (daySchedules.length >= 20) {
      return response.status(400).json({ error: "Não há vagas disponíveis para esta data." });
    }

    const timeSchedules = daySchedules.filter((s) => s.scheduleTime === scheduleTime);
    if (timeSchedules.length >= 2) {
      return response.status(400).json({ error: "Não há vagas disponíveis para este horário." });
    }

    addSchedule({ ...data, scheduleDate: formattedDate });

    response.status(201).send({ message: "Agendamento criado com sucesso.", data });
  }
}