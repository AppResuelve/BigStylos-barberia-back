const WorkDay = require("../../DB/models/WorkDay");
const noNullCancelledController = require("./noNullCancelledController");

const deleteDaysController = async (month, day, email, name) => {
  try {
    // Buscar y eliminar el documento WorkDay correspondiente
    const existing = await WorkDay.findOneAndDelete({ month, day, email });

    if (!existing) {
      throw new Error("No se encontró un día laboral con las propiedades proporcionadas.");
    }

    let noNull = [];

    // Si hay turnos agendados (turn = true)
    if (existing.turn === true) {
      // Usar un bucle for en lugar de forEach
      for (let i = 0; i < existing.time.length; i++) {
        let element = existing.time[i];

        if (element.applicant && element.applicant !== "free" && element.applicant !== null) {
          // Crear un objeto con la información del turno cancelado
          noNull.push({
            email: element.applicant,
            name:name,
            image: element.image,
            ini: element.ini,
            fin: element.end,
            requiredService: element.requiredService
          });
          i = element.end + 1;
        }
      }

      // Llamar al controlador noNullCancelledController con los turnos cancelados
      const cancelledTurns = await noNullCancelledController(noNull, month, day, email);
    }

    return noNull;
  } catch (error) {
    console.error("Error al eliminar día laboral:", error);
    throw error;
  }
};

module.exports = deleteDaysController;
