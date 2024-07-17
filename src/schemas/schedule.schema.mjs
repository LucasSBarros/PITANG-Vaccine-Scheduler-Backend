import { z } from "zod";

const scheduleSchema = z.object({
  id: z.string().optional(),
  pacientId: z.string({ message: "ID do paciente é obrigatório" }),
  scheduleDate: z.coerce.date({ message: "Data inválida!" }).min(new Date(), {
    message: "A data não pode ser igual ou anterior a data atual.",
  }),
  scheduleTime: z.string().time({
    message: "Formato de horário inválido!",
  }),
  scheduleStatus: z.string().optional().default("Não realizado"),
  conclusion: z.string().optional().nullable(),
});

export default scheduleSchema;
