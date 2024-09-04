const User = require("../../DB/models/User");
const WorkDay = require("../../DB/models/WorkDay");
const CancelledTurns = require("../../DB/models/CancelledTurns");

const deleteDaysController = async (month, day, email, name) => {
  try {
    // Buscar el documento WorkDay correspondiente sin eliminarlo
    const existing = await WorkDay.findOne({ month, day, email });

    if (!existing) {
      throw new Error("No se encontró un día laboral con las propiedades proporcionadas.");
    }

    let forDelete = [];

    // Si hay turnos agendados (turn = true)
    if (existing.turn === true) {
      for (let i = 0; i < existing.time.length; i++) {
        let applicant = existing.time[i].applicant;

        if (applicant && applicant.startsWith("pending-")) {
          throw new Error("Hay un pago en proceso, inténtelo en unos minutos");
        }

        if (applicant && applicant !== "free" && applicant !== null) {
          const user = await User.findOne({ email: applicant });

          // Crear un objeto con la información del turno cancelado
          forDelete.push({
            month: existing.month,
            day: existing.day,
            emailWorker: existing.email,
            nameWorker: existing.name,
            phone: user.phone ? user.phone : "no requerido",
            turn: {
              ini: existing.time[i].ini,
              end: existing.time[i].end,
            },
            emailUser: user.email,
            nameUser: user.name,
            howCancelled: applicant,
            service: existing.time[i].requiredService,
          });
          i = existing.time[i].end + 1; // Avanzar el índice para evitar procesar nuevamente el mismo turno
        }
      }
    }

    // Si hay turnos a cancelar, insertarlos en la colección CancelledTurns
    if (forDelete.length > 0) {
      await CancelledTurns.insertMany(forDelete);
    }

    // Eliminar el documento WorkDay correspondiente después de guardar los turnos cancelados
    await WorkDay.findOneAndDelete({ month, day, email });

    return forDelete;
  } catch (error) {
    console.error("Error al procesar día laboral:", error);
    throw error;
  }
};

module.exports = deleteDaysController;
