import { addPacient } from "../../src/services/pacient.service.mjs";

jest.mock("../../src/services/pacient.service.mjs", () => {
  let pacients = [];
  return {
    addPacient: (pacient) => pacients.push(pacient),
    __getPacients: () => pacients,
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
      require("../../src/services/pacient.service.mjs").__getPacients();
    expect(pacients).toContainEqual(pacient);
  });
});
