import { z } from "zod";

const pacientSchema = z.object({
  id: z.string().optional(),
  fullName: z
    .string()
    .min(1, { message: "O nome deve ter pelo menos um caractere" }),
  birthDate: z.coerce
    .date({ message: "Data inválida!" })
    .min(new Date("1875-01-01"), {
      message: "A data deve ser superior a 01/01/1875",
    })
    .max(new Date(), {
      message: "A data deve ser inferior ou igual à data atual",
    }),
});

export default pacientSchema;
