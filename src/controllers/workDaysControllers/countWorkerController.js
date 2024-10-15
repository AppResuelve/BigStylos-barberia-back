const WorkDay = require("../../DB/models/WorkDay");

const countWorkerController = async (emailWorker) => {
  try {
    const workdays = await WorkDay.find({ email: emailWorker });
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const currentDay = currentDate.getDate();

    let month1 = [];
    let month2 = [];

    workdays.forEach((element) => {
      let ini = null;
      let end = null;
      let ini2 = null;
      let end2 = null;
      let turn = false; // Inicializamos turn como false

      // Recorremos los tiempos para identificar los turnos y calcular ini, end, ini2, end2
      for (let i = 0; i < element.time.length; i++) {
        if (element.time[i].applicant != null) {
          // Si encontramos un applicant distinto de null, marcamos ini
          if (ini === null) {
            ini = i;
          } else if (end !== null && ini2 === null) {
            // Marcamos ini2 si ya tenemos un primer bloque terminado
            ini2 = i;
          }

          // Marcamos turn como true si encontramos un applicant distinto de null o 'free'
          if (element.time[i].applicant !== "free") {
            turn = true;
          }
        }

        // Definimos los límites de los bloques de tiempo
        if (ini !== null && element.time[i].applicant === null && end === null) {
          end = i - 1;
        }
        if (ini2 !== null && element.time[i].applicant === null && end2 === null) {
          end2 = i - 1;
        }
      }

      // Aseguramos que los bloques finales cubran hasta el final del array si es necesario
      if (end === null && ini !== null) {
        end = element.time.length - 1;
      }
      if (end2 === null && ini2 !== null) {
        end2 = element.time.length - 1;
      }

      // Procesamos los días del mes actual
      if (element.month == currentMonth && element.day >= currentDay) {
        month1.push({
          day: element.day,
          month: element.month,
          ini,
          end,
          ini2,
          end2,
          turn, // Incluimos la propiedad turn
        });
      }

      // Procesamos los días del mes siguiente
      if (element.month == nextMonth) {
        month2.push({
          day: element.day,
          month: element.month,
          ini,
          end,
          ini2,
          end2,
          turn, // Incluimos la propiedad turn
        });
      }
    });

    month1.sort((a, b) => a.day - b.day);
    month2.sort((a, b) => a.day - b.day);

    // Devolvemos los resultados incluyendo ini, end, ini2, end2 y turn
    const result1 = month1.map((element) => ({
      day: `${element.day}/${element.month}`,
      ini: element.ini,
      end: element.end,
      ini2: element.ini2,
      end2: element.end2,
      turn: element.turn, // Incluimos turn
    }));
    
    const result2 = month2.map((element) => ({
      day: `${element.day}/${element.month}`,
      ini: element.ini,
      end: element.end,
      ini2: element.ini2,
      end2: element.end2,
      turn: element.turn, // Incluimos turn
    }));

    // Combinamos ambos resultados y eliminamos duplicados
    const ultraResult = result1.concat(result2);
    const uniqueResult = Array.from(new Set(ultraResult.map(JSON.stringify))).map(JSON.parse);

    return uniqueResult;
  } catch (error) {
    console.error("Error al obtener días laborales:", error);
    throw error;
  }
};

module.exports = countWorkerController;
