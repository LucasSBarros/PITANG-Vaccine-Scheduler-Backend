import request from "supertest";
import server from "../src/index.mjs";

describe("Server", () => {
  it("should create a new pacient on /api/pacient", async () => {
    const response = await request(server)
      .post("/api/pacient")
      .send({ fullName: "Fulano de Tal", birthDate: "1994-06-16" });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Paciente criado com sucesso.");
  });

  it("should return 404 for unknown routes", async () => {
    const response = await request(server).get("/unknown-route");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Rota não encontrada");
  });
});
