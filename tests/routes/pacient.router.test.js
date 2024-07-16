import request from "supertest";
import express from "express";
import pacientRoutes from "../../src/routes/pacient.router.mjs";

jest.mock("../../src/controllers/pacient.controller.mjs", () => {
  return jest.fn().mockImplementation(() => {
    return {
      store: jest.fn((req, res) => {
        const pacient = req.body;
        const isValid =
          pacient.fullName &&
          pacient.fullName.length > 0 &&
          new Date(pacient.birthDate) >= new Date("1875-01-01") &&
          new Date(pacient.birthDate) <= new Date();

        if (!isValid) {
          return res.status(400).send({ message: "Erro de validação" });
        }
        return res.status(201).send({ id: 1, ...req.body });
      }),
      index: jest.fn((req, res) => {
        const mockPacients = [
          { id: "1", fullName: "Fulano de Tal", birthDate: "1994-06-16" },
          { id: "2", fullName: "Ciclano de Tal", birthDate: "1988-05-23" },
        ];
        res.send({
          page: 1,
          pageSize: 20,
          totalCount: mockPacients.length,
          items: mockPacients,
        });
      }),
      update: jest.fn((req, res) => {
        const { id } = req.params;
        const { fullName, birthDate } = req.body;

        if (!fullName || !birthDate) {
          return res.status(400).send({ message: "Erro de validação" });
        }

        const updatedPacient = { id, fullName, birthDate };
        res.status(200).send(updatedPacient);
      }),
      destroy: jest.fn((req, res) => {
        const { id } = req.params;
        res.status(204).send();
      }),
    };
  });
});

const app = express();
app.use(express.json());
app.use(pacientRoutes);

describe("Pacient Routes", () => {
  it("deve criar um novo paciente", async () => {
    const response = await request(app)
      .post("/api/pacient")
      .send({ fullName: "Fulano de Tal", birthDate: "1994-06-16" });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.fullName).toBe("Fulano de Tal");
    expect(response.body.birthDate).toBe("1994-06-16");
  });

  it("deve retornar erro de validação para dados inválidos", async () => {
    const response = await request(app)
      .post("/api/pacient")
      .send({ fullName: "", birthDate: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Erro de validação");
  });

  it("deve retornar erro de validação para uma data inválida", async () => {
    const response = await request(app)
      .post("/api/pacient")
      .send({ fullName: "Fulano de Tal", birthDate: "1800-06-16" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Erro de validação");
  });

  it("deve retornar erro de validação para um nome inválido", async () => {
    const response = await request(app)
      .post("/api/pacient")
      .send({ fullName: "", birthDate: "1994-06-16" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Erro de validação");
  });

  it("deve retornar todos os pacientes", async () => {
    const response = await request(app).get("/api/pacient");

    expect(response.status).toBe(200);
    expect(response.body.page).toBe(1);
    expect(response.body.pageSize).toBe(20);
    expect(response.body.totalCount).toBe(2);
    expect(response.body.items).toEqual([
      { id: "1", fullName: "Fulano de Tal", birthDate: "1994-06-16" },
      { id: "2", fullName: "Ciclano de Tal", birthDate: "1988-05-23" },
    ]);
  });

  it("deve atualizar um paciente", async () => {
    const response = await request(app)
      .put("/api/pacient/1")
      .send({ fullName: "Fulano de Tal Atualizado", birthDate: "1994-06-16" });

    expect(response.status).toBe(200);
    expect(response.body.id).toBe("1");
    expect(response.body.fullName).toBe("Fulano de Tal Atualizado");
    expect(response.body.birthDate).toBe("1994-06-16");
  });

  it("deve retornar erro de validação ao atualizar com dados inválidos", async () => {
    const response = await request(app)
      .put("/api/pacient/1")
      .send({ fullName: "", birthDate: "" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Erro de validação");
  });

  it("deve deletar um paciente", async () => {
    const response = await request(app).delete("/api/pacient/1");

    expect(response.status).toBe(204);
  });
});