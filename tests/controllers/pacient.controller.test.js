import crypto from "node:crypto";
import PacientController from "../../src/controllers/pacient.controller.mjs";
import { addPacient } from "../../src/services/pacient.service.mjs";
import pacientSchema from "../../src/schemas/pacient.schema.mjs";

jest.mock("../../src/services/pacient.service.mjs");
jest.mock("../../src/schemas/pacient.schema.mjs");

describe("PacientController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        fullName: "Fulano de Tal",
        birthDate: "1994-06-16",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    jest
      .spyOn(crypto, "randomUUID")
      .mockReturnValue("123e4567-e89b-12d3-a456-426614174000");

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("deve criar um novo paciente com sucesso", () => {
    pacientSchema.safeParse.mockReturnValue({
      success: true,
      data: req.body,
    });

    const controller = new PacientController();

    controller.store(req, res);

    expect(pacientSchema.safeParse).toHaveBeenCalledWith(req.body);
    expect(addPacient).toHaveBeenCalledWith({
      ...req.body,
      id: "123e4567",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({
      message: "Paciente criado com sucesso.",
      data: {
        ...req.body,
        id: "123e4567",
      },
    });
  });

  it("deve retornar erro de validação", () => {
    pacientSchema.safeParse.mockReturnValue({
      success: false,
      error: {
        issues: [{ message: "Validation error" }],
      },
    });

    const controller = new PacientController();

    controller.store(req, res);

    expect(pacientSchema.safeParse).toHaveBeenCalledWith(req.body);
    expect(addPacient).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      issues: [{ message: "Validation error" }],
    });
  });
});
