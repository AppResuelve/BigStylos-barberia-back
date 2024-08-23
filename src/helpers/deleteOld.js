const CancelledTurns = require("../DB/models/CancelledTurns");
const WorkDay = require("../DB/models/WorkDay");

const deleteOld = async () => {
  try {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1; // Los meses en JavaScript son 0 indexados, por lo que enero es 0, diciembre es 11.

    // Elimina todos los documentos de WorkDay cuyo día y mes son menores a los de hoy.
    const workDayResult = await WorkDay.deleteMany({
      $or: [
        { month: { $lt: currentMonth } }, // Mes menor al actual
        { 
          month: currentMonth, 
          day: { $lt: currentDay } // Mismo mes, pero día menor
        }
      ]
    });

    // Calcula la fecha de hace una semana
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);

    // Elimina todos los documentos de CancelledTurns que sean anteriores a hace una semana
    const cancelledTurnsResult = await CancelledTurns.deleteMany({
      $or: [
        { 
          month: { $lt: oneWeekAgo.getMonth() + 1 }, // Mes menor al de hace una semana
        },
        {
          month: oneWeekAgo.getMonth() + 1, 
          day: { $lt: oneWeekAgo.getDate() } // Mismo mes que hace una semana, pero día menor
        }
      ]
    });

    console.log(`Deleted ${workDayResult.deletedCount} old WorkDay documents`);
    console.log(`Deleted ${cancelledTurnsResult.deletedCount} old CancelledTurns documents`);
  } catch (error) {
    console.error('Error deleting old days:', error);
  }
};

module.exports = deleteOld;
