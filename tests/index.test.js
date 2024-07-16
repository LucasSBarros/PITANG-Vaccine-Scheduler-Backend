import request from "supertest";
import server from "../src/index.mjs";

describe("Server", () => {
  it("deve criar um novo paciente em /api/pacient", async () => {
    const response = await request(server)
      .post("/api/pacient")
      .send({ fullName: "Fulano de Tal", birthDate: "1994-06-16" });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Paciente criado com sucesso.");
  });

  it("deve criar um novo agendamento em /api/schedule", async () => {
    const pacientResponse = await request(server)
      .post("/api/pacient")
      .send({ fullName: "Fulano de Tal", birthDate: "1994-06-16" });

    const pacientId = pacientResponse.body.data.id;

    const scheduleResponse = await request(server).post("/api/schedule").send({
      pacientId: pacientId,
      scheduleDate: "2024-08-10",
      scheduleTime: "17:00:00",
      scheduleStatus: "Não realizado",
    });

    if (scheduleResponse.status !== 201) {
      console.error("Erro ao criar agendamento:", scheduleResponse.body);
    }

    expect(scheduleResponse.status).toBe(201);
    expect(scheduleResponse.body.message).toBe(
      "Agendamento criado com sucesso."
    );
  });

  it("deve retornar 404 para rotas não conhecidas", async () => {
    const response = await request(server).get("/unknown-route");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Rota não encontrada");
  });
});
