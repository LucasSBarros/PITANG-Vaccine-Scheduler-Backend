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
});
