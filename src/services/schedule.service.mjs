let schedules = [];

export const addSchedule = (schedule) => {
  schedules.push(schedule);
};

export const getSchedules = () => schedules;

export const updateSchedules = (updatedSchedules) => {
  schedules = updatedSchedules;
};

export const deleteSchedulesByPacientId = (pacientId) => {
  schedules = schedules.filter((schedule) => schedule.pacientId !== pacientId);
};
