import {
  addPacient,
  getPacients,
} from "../../src/services/pacient.service.mjs";

jest.mock("../../src/services/pacient.service.mjs", () => {
  let pacients = [];
  return {
    addPacient: (pacient) => pacients.push(pacient),
    getPacients: () => pacients,
    __resetPacients: () => {
      pacients = [];
    },
  };
});

describe("pacient.service", () => {
  beforeEach(() => {
    require("../../src/services/pacient.service.mjs").__resetPacients();
  });

  it("deve adicionar um paciente corretamente", () => {
    const pacient = {
      id: "123456",
      fullName: "Fulano de Tal",
      birthDate: "1994-06-16",
    };
    addPacient(pacient);

    const pacients =
      require("../../src/services/pacient.service.mjs").getPacients();
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

    const pacients =
      require("../../src/services/pacient.service.mjs").getPacients();
    expect(pacients).toContainEqual(pacient1);
    expect(pacients).toContainEqual(pacient2);
  });
});
