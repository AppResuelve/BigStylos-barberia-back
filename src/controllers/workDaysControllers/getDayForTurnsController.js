const WorkDay = require("../../DB/models/WorkDay");

const getDayForTurnsController = async (dayForTurns, worker, service) => {
  try {
    const day = dayForTurns[0];
    const month = dayForTurns[1];

    if (worker === "cualquiera") {
      const days = await WorkDay.find({
        month,
        day,
        "services.name": service.name,
      });

      return days;
    } else {
      const days = await WorkDay.find({
        month,
        day,
        "services.name": service.name,
        email: worker,
      });

      return days;
    }
  } catch (error) {
    console.error("Error al obtener el día:", error);
    throw error;
  }
};

module.exports = getDayForTurnsController;
