import {
  getSchedules,
  addSchedule,
  updateSchedules,
  deleteSchedulesByPacientId,
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

  it("deve atualizar todos os agendamentos corretamente", () => {
    const initialSchedule1 = {
      id: "1",
      pacientId: "123",
      scheduleDate: "2024-07-20",
      scheduleTime: "12:00:00",
      scheduleStatus: "Agendado",
    };
    const initialSchedule2 = {
      id: "2",
      pacientId: "456",
      scheduleDate: "2024-07-21",
      scheduleTime: "13:00:00",
      scheduleStatus: "Agendado",
    };

    addSchedule(initialSchedule1);
    addSchedule(initialSchedule2);

    const updatedSchedules = [
      { ...initialSchedule1, scheduleStatus: "Realizado" },
      { ...initialSchedule2, scheduleStatus: "Cancelado" },
    ];

    updateSchedules(updatedSchedules);

    const retrievedSchedules = getSchedules();
    expect(retrievedSchedules).toEqual(updatedSchedules);
  });

  it("deve deletar todos os agendamentos de um paciente específico", () => {
    const schedules = [
      {
        id: "1",
        pacientId: "123e4567",
        scheduleDate: "2024-08-10",
        scheduleTime: "17:00:00",
        scheduleStatus: "Não realizado",
      },
      {
        id: "2",
        pacientId: "234e5678",
        scheduleDate: "2024-08-11",
        scheduleTime: "18:00:00",
        scheduleStatus: "Agendado",
      },
    ];

    updateSchedules(schedules);

    deleteSchedulesByPacientId("123e4567");

    const remainingSchedules = getSchedules();
    expect(remainingSchedules).toEqual([
      {
        id: "2",
        pacientId: "234e5678",
        scheduleDate: "2024-08-11",
        scheduleTime: "18:00:00",
        scheduleStatus: "Agendado",
      },
    ]);
  });
});
