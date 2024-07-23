const WorkDay = require("../../DB/models/WorkDay");

const getDaysByServicesController = async (serviceForTurns) => {

  try {
    const days = await WorkDay.find({});

    const result = {};
    var workers = [];

    days.forEach((element) => {
      const { month, day, turn, time, email, name, image, services } = element;

      if (
        element.services[serviceForTurns] &&
        element.services[serviceForTurns].available === true
      ) {
        // Verifica si el trabajador ya existe en el array 'workers'
        const workerExists = workers.some((worker) => worker.email === email);

        if (!workerExists) {
          workers.push({
            email,
            name,
            image,
          });
        }

        if (!result[month]) {
          result[month] = {};
        }
        if (!result[month][day]) {
          result[month][day] = {};
        }
        if (!result[month][day][email]) {
           result[month][day][email] = {};
        }
      }
    });

    return { workers, result };
  } catch (error) {
    console.error("Error al obtener días laborales:", error);
    throw error;
  }
};

module.exports = getDaysByServicesController;
