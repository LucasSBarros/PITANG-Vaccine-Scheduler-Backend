import crypto from "node:crypto";
import PacientController from "../../src/controllers/pacient.controller.mjs";
import {
  addPacient,
  getPacients,
  updatePacients
} from "../../src/services/pacient.service.mjs";
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
      params: {
        id: "123e4567"
      }
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

  it("deve listar todos os pacientes", () => {
    const mockPacients = [
      { id: "1", fullName: "Paciente 1", birthDate: "2000-01-01" },
      { id: "2", fullName: "Paciente 2", birthDate: "1990-02-02" },
    ];
    getPacients.mockReturnValue(mockPacients);

    const controller = new PacientController();

    controller.index(req, res);

    expect(getPacients).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      totalCount: mockPacients.length,
      items: mockPacients,
    });
  });

  it("deve atualizar um paciente", () => {
    const mockPacients = [
      { id: "123e4567", fullName: "Paciente 1", birthDate: "2000-01-01" },
      { id: "2", fullName: "Paciente 2", birthDate: "1990-02-02" },
    ];
    getPacients.mockReturnValue(mockPacients);

    const updatedPacient = { id: "123e4567", fullName: "Fulano de Tal", birthDate: "1994-06-16" };
    const updatedPacients = [
      updatedPacient,
      { id: "2", fullName: "Paciente 2", birthDate: "1990-02-02" },
    ];
    updatePacients.mockImplementation((pacients) => {
      return updatedPacients;
    });

    const controller = new PacientController();

    controller.update(req, res);

    expect(getPacients).toHaveBeenCalled();
    expect(updatePacients).toHaveBeenCalledWith(updatedPacients);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ message: "Paciente atualizado" });
  });
});