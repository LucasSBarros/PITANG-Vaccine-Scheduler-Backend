let pacients = [];

export const addPacient = (pacient) => {
  pacients.push(pacient);
};

export const getPacients = () => pacients;
