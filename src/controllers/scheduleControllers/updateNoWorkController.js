const Schedule = require("../../DB/models/Schedule");

const updateNoWorkController = async (noWorkDays) => {
  try {
    const schedule = await Schedule.findOne();
    if (schedule) {
      var existingNoWorkDays = schedule.noWorkDays;

      // Solo iterar si noWorkDays tiene propiedades
      if (Object.keys(existingNoWorkDays).length > 0) {
        // Combinar las fechas existentes con las nuevas fechas recibidas
        for (const month in noWorkDays) {
          if (existingNoWorkDays.hasOwnProperty(month)) {
            for (const day in noWorkDays[month]) {
              if (existingNoWorkDays[month].hasOwnProperty(day)) {
                delete existingNoWorkDays[month][day];
              } else {
                existingNoWorkDays[month][day] = {};
              }
            }
            // Si el mes no tiene más días, eliminar el mes completo
            if (Object.keys(existingNoWorkDays[month]).length === 0) {
              delete existingNoWorkDays[month];
            }
          } else {
            existingNoWorkDays[month] = {
              ...noWorkDays[month],
            };
          }
        }
      } else {
        // Si existingNoWorkDays queda vacío, agregar noWorkDays recibido

        existingNoWorkDays = noWorkDays;
      }

      // Actualizar el campo noWorkDays
      schedule.noWorkDays = existingNoWorkDays;
      // Marcar el campo noWorkDays como modificado
      schedule.markModified("noWorkDays");
      // Guardar el documento y capturar cualquier error
      try {
        await schedule.save();
      } catch (saveError) {
        console.error("Error saving schedule:", saveError);
      }
    }

    return schedule.noWorkDays;
  } catch (error) {
    console.error(
      "Error al actualizar los días en la base de datos:",
      error.message
    );
    throw new Error(error.message);
  }
};

module.exports = updateNoWorkController;
