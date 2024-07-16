import scheduleSchema from "../../src/schemas/schedule.schema.mjs";
import { expect, describe, it } from "@jest/globals";

describe("Schedule Schema", () => {
  it("deve validar um agendamento válido", () => {
    const validSchedule = {
      "id": undefined,
      pacientId: "123456",
      scheduleDate: "2024-07-25T00:00:00.000Z",
      scheduleTime: "14:00:00",
      scheduleStatus: "Realizado",
      conclusion: "Paciente compareceu",
    };

    const result = scheduleSchema.safeParse(validSchedule);
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      id: undefined,
      pacientId: validSchedule.pacientId,
      scheduleDate: new Date(validSchedule.scheduleDate),
      scheduleTime: validSchedule.scheduleTime,
      scheduleStatus: validSchedule.scheduleStatus,
      conclusion: validSchedule.conclusion,
    });
  });

  it("deve retornar erro quando faltando ID do paciente", () => {
    const invalidSchedule = {
      scheduleDate: "2024-07-25",
      scheduleTime: "14:00:00",
      scheduleStatus: "Realizado",
      conclusion: "Paciente compareceu",
    };

    const result = scheduleSchema.safeParse(invalidSchedule);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe("ID do paciente é obrigatório");
  });

  it("deve retornar erro quando data é anterior a data atual", () => {
    const invalidSchedule = {
      pacientId: "123456",
      scheduleDate: "2023-07-15",
      scheduleTime: "14:00:00",
      scheduleStatus: "Agendado",
      conclusion: "Paciente compareceu",
    };

    const result = scheduleSchema.safeParse(invalidSchedule);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe(
      "A data não pode ser igual ou anterior a data atual."
    );
  });

  it("deve retornar erro quando formato de horário é inválido", () => {
    const invalidSchedule = {
      pacientId: "123456",
      scheduleDate: "2024-07-25",
      scheduleTime: "25:30:00", 
      scheduleStatus: "Agendado",
      conclusion: "Paciente compareceu",
    };

    const result = scheduleSchema.safeParse(invalidSchedule);
    expect(result.success).toBe(false);
    expect(result.error.errors[0].message).toBe("Formato de horário inválido!");
  });

  it("deve usar o valor padrão para scheduleStatus quando não fornecido", () => {
    const validSchedule = {
      pacientId: "123456",
      scheduleDate: "2024-07-25",
      scheduleTime: "14:30:00",
    };

    const result = scheduleSchema.safeParse(validSchedule);
    expect(result.success).toBe(true);
    expect(result.data.scheduleStatus).toBe("Não realizado");
  });

  it("deve permitir campos opcionais como nulos ou undefined", () => {
    const validSchedule = {
      pacientId: "123456",
      scheduleDate: "2024-07-25",
      scheduleTime: "14:00:00",
      scheduleStatus: undefined,
      conclusion: null,
    };

    const result = scheduleSchema.safeParse(validSchedule);
    expect(result.success).toBe(true);
    expect(result.data.scheduleStatus).toBe("Não realizado");
    expect(result.data.conclusion).toBeNull();
  });
});