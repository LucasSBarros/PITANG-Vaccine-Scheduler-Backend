import {
  addPacient,
  getPacients,
  updatePacients,
  deletePacientById,
} from "../../src/services/pacient.service.mjs";

describe("pacient.service", () => {
  beforeEach(() => {
    updatePacients([]);
  });

  it("deve adicionar um paciente corretamente", () => {
    const pacient = {
      id: "123456",
      fullName: "Fulano de Tal",
      birthDate: "1994-06-16",
    };
    addPacient(pacient);

    const pacients = getPacients();
    expect(pacients).toContainEqual(pacient);
  });

  it("deve retornar todos os pacientes", () => {
    const pacient1 = {
      id: "123456",
      fullName: "Fulano de Tal",
      birthDate: "1994-06-16",
    };
    const pacient2 = {
      id: "789012",
      fullName: "Ciclano de Tal",
      birthDate: "1988-10-10",
    };
    addPacient(pacient1);
    addPacient(pacient2);

    const pacients = getPacients();
    expect(pacients).toContainEqual(pacient1);
    expect(pacients).toContainEqual(pacient2);
  });

  it("deve atualizar os pacientes", () => {
    const pacient1 = {
      id: "123456",
      fullName: "Fulano de Tal",
      birthDate: "1994-06-16",
    };
    const pacient2 = {
      id: "789012",
      fullName: "Ciclano de Tal",
      birthDate: "1988-10-10",
    };
    addPacient(pacient1);
    addPacient(pacient2);

    const updatedPacient1 = {
      id: "123456",
      fullName: "Fulano de Tal Atualizado",
      birthDate: "1994-06-16",
    };
    const updatedPacients = [updatedPacient1, pacient2];
    updatePacients(updatedPacients);

    const pacients = getPacients();
    expect(pacients).toContainEqual(updatedPacient1);
    expect(pacients).toContainEqual(pacient2);
  });

  it("deve deletar um paciente", () => {
    const pacient1 = {
      id: "123456",
      fullName: "Fulano de Tal",
      birthDate: "1994-06-16",
    };
    const pacient2 = {
      id: "789012",
      fullName: "Ciclano de Tal",
      birthDate: "1988-10-10",
    };
    addPacient(pacient1);
    addPacient(pacient2);

    deletePacientById("123456");

    const pacients = getPacients();
    expect(pacients).not.toContainEqual(pacient1);
    expect(pacients).toContainEqual(pacient2);
  });

  it("deve retornar um array vazio quando nenhum paciente for adicionado", () => {
    const pacients = getPacients();
    expect(pacients).toEqual([]);
  });

  it("deve retornar um array vazio após deletar todos os pacientes", () => {
    const pacient1 = {
      id: "123456",
      fullName: "Fulano de Tal",
      birthDate: "1994-06-16",
    };
    const pacient2 = {
      id: "789012",
      fullName: "Ciclano de Tal",
      birthDate: "1988-10-10",
    };
    addPacient(pacient1);
    addPacient(pacient2);

    deletePacientById("123456");
    deletePacientById("789012");

    const pacients = getPacients();
    expect(pacients).toEqual([]);
  });
});
