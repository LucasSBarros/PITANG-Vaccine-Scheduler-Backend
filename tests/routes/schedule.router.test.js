import request from "supertest";
import express from "express";
import scheduleRoutes from "../../src/routes/schedule.router.mjs";

jest.mock("../../src/controllers/schedule.controller.mjs", () => {
  return jest.fn().mockImplementation(() => {
    return {
      store: jest.fn((req, res) => {
        const schedule = req.body;
        const isValid =
          schedule.pacientId &&
          schedule.scheduleDate &&
          schedule.scheduleTime &&
          schedule.scheduleStatus;

        if (!isValid) {
          return res.status(400).send({ message: "Erro de validação" });
        }
        return res.status(201).send({ id: 1, ...req.body });
      }),
      index: jest.fn((req, res) => {
        const mockSchedules = [
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
            scheduleDate: "2024-08-11T00:00:00.000Z",
            scheduleTime: "18:00:00",
            scheduleStatus: "Agendado",
            pacientName: "Ciclano de Tal",
            pacientBirthDate: "1985-02-02",
          },
        ];
        res.send({
          page: 1,
          pageSize: 20,
          totalCount: mockSchedules.length,
          items: mockSchedules,
        });
      }),
      update: jest.fn((req, res) => {
        const { id } = req.params;
        const { scheduleDate, scheduleTime, scheduleStatus } = req.body;
        const isValid = scheduleDate && scheduleTime && scheduleStatus;

        if (!isValid) {
          return res.status(400).send({ message: "Erro de validação" });
        }

        return res.status(201).send({
          id,
          pacientId: "123456",
          scheduleDate,
          scheduleTime,
          scheduleStatus,
        });
      }),
    };
  });
});

const app = express();
app.use(express.json());
app.use(scheduleRoutes);

describe("Schedule Routes", () => {
  it("deve criar um novo agendamento", async () => {
    const response = await request(app).post("/api/schedule").send({
      pacientId: "123456",
      scheduleDate: "2024-08-10",
      scheduleTime: "17:00:00",
      scheduleStatus: "Não realizado",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.pacientId).toBe("123456");
    expect(response.body.scheduleDate).toBe("2024-08-10");
    expect(response.body.scheduleTime).toBe("17:00:00");
    expect(response.body.scheduleStatus).toBe("Não realizado");
  });

  it("deve retornar erro de validação para dados inválidos", async () => {
    const response = await request(app).post("/api/schedule").send({
      pacientId: "",
      scheduleDate: "",
      scheduleTime: "",
      scheduleStatus: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Erro de validação");
  });

  it("deve retornar todos os agendamentos", async () => {
    const response = await request(app).get("/api/schedule");

    expect(response.status).toBe(200);
    expect(response.body.page).toBe(1);
    expect(response.body.pageSize).toBe(20);
    expect(response.body.totalCount).toBe(2);
    expect(response.body.items).toEqual([
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
        scheduleDate: "2024-08-11T00:00:00.000Z",
        scheduleTime: "18:00:00",
        scheduleStatus: "Agendado",
        pacientName: "Ciclano de Tal",
        pacientBirthDate: "1985-02-02",
      },
    ]);
  });

  it("deve atualizar um agendamento", async () => {
    const response = await request(app).put("/api/schedule/1").send({
      scheduleDate: "2024-08-11",
      scheduleTime: "18:00:00",
      scheduleStatus: "Realizado",
    });

    expect(response.status).toBe(201);
    expect(response.body.id).toBe("1");
    expect(response.body.scheduleDate).toBe("2024-08-11");
    expect(response.body.scheduleTime).toBe("18:00:00");
    expect(response.body.scheduleStatus).toBe("Realizado");
  });

  it("deve retornar erro de validação ao atualizar com dados inválidos", async () => {
    const response = await request(app).put("/api/schedule/1").send({
      scheduleDate: "",
      scheduleTime: "",
      scheduleStatus: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Erro de validação");
  });
});
