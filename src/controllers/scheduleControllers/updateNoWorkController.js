// Importar el modelo de mongoose
const Schedule = require("../../DB/models/Schedule");
const WorkDay = require("../../DB/models/WorkDay");
const User = require("../../DB/models/User");
const CancelledTurns = require("../../DB/models/CancelledTurns");

// Controlador para actualizar noWorkDays
const updateNoWorkController = async (newNoWorkValues, daysToCancel) => {
  try {
    if (Object.keys(daysToCancel).length > 0) {
      const workdays = await WorkDay.find({ month: daysToCancel.month, day: daysToCancel.day });

      if (workdays.length === 0) {
        console.log("No se encontraron workdays para la fecha especificada.");
        return;
      }

      let turnsForCancel = [];

      for (let i = 0; i < workdays.length; i++) {
        let workDay = workdays[i];

        for (let j = 0; j < workDay.time.length; j++) {
          let time = workDay.time[j];

          if (time.applicant != null && time.applicant != "free") {
            let pending = time.applicant.split('-')[0];

            if (pending === "pending") {
              throw new Error("Hay una persona en proceso de pago, debe esperar unos minutos a que se complete.");
            }

            const user = await User.findOne({ email: time.applicant });
            if (!user) {
              throw new Error("No se encontró uno de los usuarios agendados");
            }

            turnsForCancel.push({
              month: workDay.month,
              day: workDay.day,
              emailWorker: workDay.email,
              nameWorker: workDay.name,
              emailUser: time.applicant,
              nameUser: user.name,
              phone: user.phone ? user.phone : "no requerido",
              turn: {
                ini: time.ini,
                end: time.end,
              },
              howCancelled: workDay.email,
              service: time.requiredService,
            });
            j = time.end;
          }
        }
      }

      // Crear un nuevo documento en CancelledTurns por cada turno cancelado
      for (const turn of turnsForCancel) {
        const newCanceled = new CancelledTurns(turn);
        await newCanceled.save();
      }

      // Buscar el primer documento en la colección de Schedule
      let updatedNoWorkDays = await Schedule.findOneAndUpdate(
        {}, // Sin condiciones, actualizará el primer documento que encuentre
        { noWorkDays: newNoWorkValues },
        { new: true, upsert: true } // Configuraciones: new devuelve el documento actualizado, upsert crea un nuevo documento si no se encuentra ninguno
      );

      // Eliminar los workdays de la base de datos solo si todo salió bien
      await WorkDay.deleteMany({ month: daysToCancel.month, day: daysToCancel.day });

      // Devolver el documento actualizado
      return updatedNoWorkDays.noWorkDays;
    }
  } catch (error) {
    console.error("Error al actualizar los días en la base de datos:", error);
    throw new Error("Error al actualizar los días en la base de datos");
  }
};

module.exports = updateNoWorkController;
