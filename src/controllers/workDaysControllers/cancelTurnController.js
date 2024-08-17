const WorkDay = require("../../DB/models/WorkDay");
const corroborate = require("../../helpers/corroborateDisponibility");

const cancelTurnController = async (ini, end, emailWorker, emailUser, month, day) => {
  try {
    // Buscar el documento del día laboral del trabajador específico
    const existingDay = await WorkDay.findOne({ month, day, email: emailWorker });

    if (existingDay) {
      // Iterar sobre el rango de tiempo y actualizar las propiedades de cada objeto en el array time
      for (let i = ini; i <= end; i++) {
        if (existingDay.time[i].applicant === emailUser) {
          existingDay.time[i].applicant = "free";
          existingDay.time[i].ini = null;
          existingDay.time[i].end = null;
          existingDay.time[i].requiredService = null;
        }
      }

      // Verificar si todos los objetos en time tienen applicant en "free" o null
      const allFree = existingDay.time.every(slot => slot.applicant === "free" || slot.applicant === null);

      // Si todos los slots están libres, actualizar la propiedad turn a false
      if (allFree) {
        existingDay.turn = false;
      }

      // Actualizar la disponibilidad de los servicios basados en la duración
      const servicesKeys = Object.keys(existingDay.services);
      servicesKeys.forEach(serviceKey => {
        const service = existingDay.services[serviceKey];
        service.available = corroborate(existingDay.time, service.duration);
      });

      // Marcar el campo 'time' y 'services' como modificados para que Mongoose lo tenga en cuenta al guardar
      existingDay.markModified('time');
      existingDay.markModified('services');

      // Guardar los cambios en la base de datos
      await existingDay.save();
      
      return existingDay;
    } else {
      throw new Error("No se encontró el día laboral para el trabajador especificado.");
    }
  } catch (error) {
    console.error("Error en el controlador de cancelación de turno:", error);
    throw error;
  }
};

module.exports = cancelTurnController;
