import ScheduleController from "../../src/controllers/schedule.controller.mjs";
import { getPacients } from "../../src/services/pacient.service.mjs";
import {
  getSchedules,
  addSchedule,
} from "../../src/services/schedule.service.mjs";
import scheduleSchema from "../../src/schemas/schedule.schema.mjs";

jest.mock("../../src/services/pacient.service.mjs");
jest.mock("../../src/services/schedule.service.mjs");
jest.mock("node:crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("123e4567-e89b-12d3-a456-426614174000"),
}));

describe("ScheduleController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        pacientId: "123456",
        scheduleDate: "2024-08-10",
        scheduleTime: "17:00:00",
        scheduleStatus: "Não realizado",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  it("deve criar um novo agendamento com sucesso", () => {
    jest.spyOn(scheduleSchema, "safeParse").mockReturnValue({
      success: true,
      data: {
        ...req.body,
        scheduleDate: new Date(req.body.scheduleDate),
      },
    });

    getPacients.mockReturnValue([{ id: "123456", fullName: "Fulano de Tal" }]);
    getSchedules.mockReturnValue([]);

    const controller = new ScheduleController();
    controller.store(req, res);

    const expectedData = {
      ...req.body,
      id: "123e4567",
      scheduleDate: new Date(req.body.scheduleDate).toISOString(),
    };

    expect(scheduleSchema.safeParse).toHaveBeenCalledWith(req.body);
    expect(getPacients).toHaveBeenCalled();
    expect(getSchedules).toHaveBeenCalled();
    expect(addSchedule).toHaveBeenCalledWith({
      ...expectedData,
      scheduleDate: new Date(expectedData.scheduleDate)
        .toISOString()
        .split("T")[0],
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: "Agendamento criado com sucesso.",
      data: {
        ...expectedData,
        scheduleDate: new Date(expectedData.scheduleDate),
      },
    });
  });

  it("deve retornar erro de validação quando os dados estão inválidos", () => {
    jest.spyOn(scheduleSchema, "safeParse").mockReturnValue({
      success: false,
      error: { issues: [{ message: "Erro de validação" }] },
    });

    const controller = new ScheduleController();
    controller.store(req, res);

    expect(scheduleSchema.safeParse).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      issues: [{ message: "Erro de validação" }],
    });
  });

  it("deve retornar erro quando o paciente não for encontrado", () => {
    jest.spyOn(scheduleSchema, "safeParse").mockReturnValue({
      success: true,
      data: {
        ...req.body,
        scheduleDate: new Date(req.body.scheduleDate),
      },
    });

    getPacients.mockReturnValue([]);

    const controller = new ScheduleController();
    controller.store(req, res);

    expect(scheduleSchema.safeParse).toHaveBeenCalledWith(req.body);
    expect(getPacients).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Paciente não encontrado.",
    });
  });

  it("deve retornar erro quando não há vagas disponíveis para a data", () => {
    jest.spyOn(scheduleSchema, "safeParse").mockReturnValue({
      success: true,
      data: {
        ...req.body,
        scheduleDate: new Date(req.body.scheduleDate),
      },
    });

    getPacients.mockReturnValue([{ id: "123456", fullName: "Fulano de Tal" }]);
    getSchedules.mockReturnValue(
      new Array(20).fill({ scheduleDate: "2024-08-10" })
    );

    const controller = new ScheduleController();
    controller.store(req, res);

    expect(scheduleSchema.safeParse).toHaveBeenCalledWith(req.body);
    expect(getPacients).toHaveBeenCalled();
    expect(getSchedules).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Não há vagas disponíveis para esta data.",
    });
  });

  it("deve retornar erro quando não há vagas disponíveis para o horário", () => {
    jest.spyOn(scheduleSchema, "safeParse").mockReturnValue({
      success: true,
      data: {
        ...req.body,
        scheduleDate: new Date(req.body.scheduleDate),
      },
    });

    getPacients.mockReturnValue([{ id: "123456", fullName: "Fulano de Tal" }]);
    getSchedules.mockReturnValue(
      new Array(2).fill({
        scheduleDate: "2024-08-10",
        scheduleTime: "17:00:00",
      })
    );

    const controller = new ScheduleController();
    controller.store(req, res);

    expect(scheduleSchema.safeParse).toHaveBeenCalledWith(req.body);
    expect(getPacients).toHaveBeenCalled();
    expect(getSchedules).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Não há vagas disponíveis para este horário.",
    });
  });
});
