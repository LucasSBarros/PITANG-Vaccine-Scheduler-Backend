let pacients = [];

export const addPacient = (pacient) => {
  pacients.push(pacient);
};

export const getPacients = () => pacients;

export const updatePacients = (updatedPacients) => {
  pacients = updatedPacients;
};

export const deletePacientById = (id) => {
  pacients = pacients.filter((pacient) => pacient.id !== id);
};
