import {
  getSchedules,
  addSchedule,
} from "../../src/services/schedule.service.mjs";

describe("Schedule Service", () => {
  beforeEach(() => {
    const schedules = getSchedules();
    schedules.length = 0;
  });

  it("deve garantir que schedules é limpo antes de cada teste", () => {
    const schedules = getSchedules();
    const initialSchedule = {
      id: "initial",
      pacientId: "123",
      scheduleDate: "2024-07-20",
      scheduleTime: "12:00:00",
      scheduleStatus: "Agendado",
    };
    schedules.push(initialSchedule);

    const retrievedSchedules = getSchedules();
    expect(retrievedSchedules).toEqual([initialSchedule]);

    schedules.length = 0;

    const emptySchedules = getSchedules();
    expect(emptySchedules).toEqual([]);
  });

  it("deve retornar todos os agendamentos", () => {
    const schedules = getSchedules();
    expect(schedules).toEqual([]);
  });

  it("deve adicionar e retornar agendamentos corretamente", () => {
    const newSchedule = {
      id: "123",
      pacientId: "456",
      scheduleDate: "2024-07-25",
      scheduleTime: "14:00:00",
      scheduleStatus: "Agendado",
    };
    addSchedule(newSchedule);

    const retrievedSchedules = getSchedules();
    expect(retrievedSchedules).toEqual([newSchedule]);
  });
});
