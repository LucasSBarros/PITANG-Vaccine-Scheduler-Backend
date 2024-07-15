import pacientSchema from "../../src/schemas/pacient.schema.mjs";

describe("pacient.schema", () => {
  it("deve validar corretamente um paciente válido", () => {
    const pacient = { fullName: "Fulano de Tal", birthDate: "1994-06-16" };
    const { success, data, error } = pacientSchema.safeParse(pacient);

    expect(success).toBe(true);
    expect(data.fullName).toBe(pacient.fullName);
    expect(new Date(data.birthDate).toISOString()).toBe(
      new Date(pacient.birthDate).toISOString()
    );
    expect(error).toBeUndefined();
  });

  it("deve retornar erro para paciente inválido", () => {
    const pacient = { fullName: "", birthDate: "1808-10-01" };
    const { success, error } = pacientSchema.safeParse(pacient);

    expect(success).toBe(false);
    expect(error).toBeDefined();
  });

  it("deve retornar erro para data inválida", () => {
    const pacient = { fullName: "Fulano de Tal", birthDate: "1808-10-01" };
    const { success, error } = pacientSchema.safeParse(pacient);

    expect(success).toBe(false);
    expect(error.issues[0].message).toBe(
      "A data deve ser superior a 01/01/1875"
    );
  });

  it("deve retornar erro para nome vazio", () => {
    const pacient = { fullName: "", birthDate: "1994-06-16" };
    const { success, error } = pacientSchema.safeParse(pacient);

    expect(success).toBe(false);
    expect(error.issues[0].message).toBe(
      "O nome deve ter pelo menos um caractere"
    );
  });
});
