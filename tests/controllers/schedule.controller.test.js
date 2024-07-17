import ScheduleController from "../../src/controllers/schedule.controller.mjs";
import { getPacients } from "../../src/services/pacient.service.mjs";
import {
  getSchedules,
  addSchedule,
  updateSchedules,
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

  it("deve retornar agendamentos detalhados com informações dos pacientes", async () => {
    getPacients.mockResolvedValue([
      { id: "123456", fullName: "Fulano de Tal", birthDate: "1990-01-01" },
      { id: "654321", fullName: "Ciclano de Tal", birthDate: "1985-02-02" },
    ]);

    getSchedules.mockReturnValue([
      {
        id: "1",
        pacientId: "123456",
        scheduleDate: "2024-08-10T00:00:00.000Z",
        scheduleTime: "17:00:00",
        scheduleStatus: "Não realizado",
      },
      {
        id: "2",
        pacientId: "654321",
        scheduleDate: "2024-08-10T00:00:00.000Z",
        scheduleTime: "18:00:00",
        scheduleStatus: "Não realizado",
      },
    ]);

    const controller = new ScheduleController();
    await controller.index(req, res);

    expect(getPacients).toHaveBeenCalled();
    expect(getSchedules).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      totalCount: 2,
      items: {
        "2024-08-10T00:00:00.000Z-17:00:00": [
          {
            id: "1",
            pacientId: "123456",
            scheduleDate: "2024-08-10T00:00:00.000Z",
            scheduleTime: "17:00:00",
            scheduleStatus: "Não realizado",
            pacientName: "Fulano de Tal",
            pacientBirthDate: "1990-01-01",
          },
        ],
        "2024-08-10T00:00:00.000Z-18:00:00": [
          {
            id: "2",
            pacientId: "654321",
            scheduleDate: "2024-08-10T00:00:00.000Z",
            scheduleTime: "18:00:00",
            scheduleStatus: "Não realizado",
            pacientName: "Ciclano de Tal",
            pacientBirthDate: "1985-02-02",
          },
        ],
      },
    });
  });

  it("deve agrupar agendamentos corretamente com informações dos pacientes", async () => {
    getPacients.mockResolvedValue([
      { id: "123456", fullName: "Fulano de Tal", birthDate: "1990-01-01" },
      { id: "654321", fullName: "Ciclano de Tal", birthDate: "1985-02-02" },
    ]);

    getSchedules.mockReturnValue([
      {
        id: "1",
        pacientId: "123456",
        scheduleDate: "2024-08-10T00:00:00.000Z",
        scheduleTime: "17:00:00",
        scheduleStatus: "Não realizado",
      },
      {
        id: "2",
        pacientId: "654321",
        scheduleDate: "2024-08-10T00:00:00.000Z",
        scheduleTime: "17:00:00",
        scheduleStatus: "Realizado",
      },
    ]);

    const controller = new ScheduleController();
    await controller.index(req, res);

    expect(getPacients).toHaveBeenCalled();
    expect(getSchedules).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      totalCount: 1,
      items: {
        "2024-08-10T00:00:00.000Z-17:00:00": [
          {
            id: "1",
            pacientId: "123456",
            scheduleDate: "2024-08-10T00:00:00.000Z",
            scheduleTime: "17:00:00",
            scheduleStatus: "Não realizado",
            pacientName: "Fulano de Tal",
            pacientBirthDate: "1990-01-01",
          },
          {
            id: "2",
            pacientId: "654321",
            scheduleDate: "2024-08-10T00:00:00.000Z",
            scheduleTime: "17:00:00",
            scheduleStatus: "Realizado",
            pacientName: "Ciclano de Tal",
            pacientBirthDate: "1985-02-02",
          },
        ],
      },
    });
  });

  it("deve atualizar um agendamento com sucesso", () => {
    const updatedSchedule = {
      id: "123e4567",
      pacientId: "123456",
      scheduleDate: new Date("2024-08-11"),
      scheduleTime: "18:00:00",
      scheduleStatus: "Realizado",
    };

    req.body = {
      scheduleDate: updatedSchedule.scheduleDate,
      scheduleTime: updatedSchedule.scheduleTime,
      scheduleStatus: updatedSchedule.scheduleStatus,
    };

    req.params = { id: "123e4567" };

    getSchedules.mockReturnValue([
      {
        id: "123e4567",
        pacientId: "123456",
        scheduleDate: new Date("2024-08-10"),
        scheduleTime: "17:00:00",
        scheduleStatus: "Não realizado",
      },
    ]);

    const controller = new ScheduleController();
    controller.update(req, res);

    expect(getSchedules).toHaveBeenCalled();
    expect(updateSchedules).toHaveBeenCalledWith([
      {
        id: "123e4567",
        pacientId: "123456",
        scheduleDate: req.body.scheduleDate,
        scheduleTime: req.body.scheduleTime,
        scheduleStatus: req.body.scheduleStatus,
      },
    ]);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: "Agendamento atualizado",
    });
  });

  it("deve retornar o agendamento inalterado quando o ID não corresponder", () => {
    const existingSchedules = [
      {
        id: "123e4567",
        pacientId: "123456",
        scheduleDate: new Date("2024-08-10"),
        scheduleTime: "17:00:00",
        scheduleStatus: "Não realizado",
      },
      {
        id: "234e5678",
        pacientId: "654321",
        scheduleDate: new Date("2024-08-11"),
        scheduleTime: "18:00:00",
        scheduleStatus: "Agendado",
      },
    ];

    req.body = {
      scheduleDate: new Date("2024-08-12"),
      scheduleTime: "19:00:00",
      scheduleStatus: "Realizado",
    };

    req.params = { id: "inexistente" };

    getSchedules.mockReturnValue(existingSchedules);

    const controller = new ScheduleController();
    controller.update(req, res);

    expect(getSchedules).toHaveBeenCalled();
    expect(updateSchedules).toHaveBeenCalledWith(existingSchedules);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: "Agendamento atualizado",
    });
  });

  it("deve deletar um agendamento com sucesso", () => {
    req.params = { id: "123e4567" };

    getSchedules.mockReturnValue([
      {
        id: "123e4567",
        pacientId: "123456",
        scheduleDate: new Date("2024-08-10"),
        scheduleTime: "17:00:00",
        scheduleStatus: "Não realizado",
      },
      {
        id: "234e5678",
        pacientId: "654321",
        scheduleDate: new Date("2024-08-11"),
        scheduleTime: "18:00:00",
        scheduleStatus: "Agendado",
      },
    ]);

    const controller = new ScheduleController();
    controller.destroy(req, res);

    expect(getSchedules).toHaveBeenCalled();
    expect(updateSchedules).toHaveBeenCalledWith([
      {
        id: "234e5678",
        pacientId: "654321",
        scheduleDate: new Date("2024-08-11"),
        scheduleTime: "18:00:00",
        scheduleStatus: "Agendado",
      },
    ]);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
  });
});
