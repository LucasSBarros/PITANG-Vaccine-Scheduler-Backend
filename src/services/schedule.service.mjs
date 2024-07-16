let schedules = [];

export const addSchedule = (schedule) => {
  schedules.push(schedule);
};

export const getSchedules = () => schedules;

export const updateSchedules = (updatedSchedules) => {
  schedules = updatedSchedules;
};
