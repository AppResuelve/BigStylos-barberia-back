const WorkDay = require("../../DB/models/WorkDay");

const pendingToConfirmController = async (pending) => {
  let errors = [];
  let updatedDays = [];

  try {
    // Función para obtener los WorkDays y editar los turnos pendientes
    const wantDays = async (prop) => {
      console.log(prop,"este es el prop dentro de la funcion");
      
      const { ini, end, day, month, user, worker } = prop;

      try {
        // Buscar el documento WorkDay para el trabajador y el día/mes
        const workday = await WorkDay.findOne({
          email: worker,
          day: day,
          month: month,
        });

        if (!workday) {
          throw new Error(`No se encontró WorkDay para el trabajador ${worker}`);
        }

        // Bandera para saber si hemos modificado el array 'time'
        let isModified = false;

        // Iteramos sobre el campo 'time' para encontrar los índices entre ini y end
        for (let i = ini; i <= end; i++) {
          const timeSlot = workday.time[i];

          // Verificamos si el campo applicant tiene el formato "pending-<email>"
          if (timeSlot && timeSlot.applicant === `pending-${user}`) {
            // Actualizamos el campo applicant quitando el "pending-"
            timeSlot.applicant = user;
            isModified = true; // Indicamos que hemos modificado el array
          } else {
            // Si no se cumple la condición, guardamos el error
            errors.push({
              worker: worker,
              day,
              index: i,
              message: `No se encontró un turno pendiente en el índice ${i} para ${user}`,
            });
          }
        }

        // Si modificamos el array 'time', marcamos el campo como modificado
        if (isModified) {
          workday.markModified('time');
          await workday.save(); // Guardamos los cambios
          updatedDays.push({
            worker: worker,
            day,
            status: "updated",
          });
        }
      } catch (error) {
        // Capturamos cualquier error y lo agregamos a la lista de errores
        errors.push({
          worker: worker,
          day,
          message: error.message,
        });
      }
    };

    // Creamos un array de promesas para ejecutar todas las modificaciones en paralelo
    const promises = pending.map((item) => wantDays(item[0]));

    // Esperamos a que todas las promesas se resuelvan
    await Promise.all(promises);

    // Mostrar resultados exitosos
    if (updatedDays.length > 0) {
      console.log("WorkDays actualizados correctamente:", updatedDays);
    }

    // Mostrar errores
    if (errors.length > 0) {
      console.error("Errores durante la actualización:", errors);
    }

  } catch (error) {
    console.error("Error al procesar turnos pendientes (controller):", error);
    throw error;
  }
};

module.exports = pendingToConfirmController;




/* 
[
    {
        id: '13+9+corte masculino+600',
        worker: [[Object]],
        ini: 600,
        user: 'hellsingsd@gmail.com',
        day: 13,
        month: 9,
        service: { name: 'corte masculino', img: '', price: '8000', sing: '2000' },
        quantity: 1
    },
    {
        id: '13+9+mate+660',
        worker: [[Object]],
        ini: 660,
        user: 'hellsingsd@gmail.com',
        day: 13,
        month: 9,
        service: { name: 'mate', img: '', price: '5000', sing: 0 },
        quantity: 1
    }
] */
 