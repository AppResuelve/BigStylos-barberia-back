const WorkDay = require("../../DB/models/WorkDay");
const User = require("../../DB/models/User");
const CancelledTurns = require("../../DB/models/CancelledTurns");
const Schedule = require("../../DB/models/Schedule");

const updateNoWorkCancelTurnController = async (noWorkDays) => {
  //  { '10': { '23': {} } } ------noWorkDays

  try {
    let daysToCancel = [];
    let workdaysToCancel = [];
    let datesProcessed = [];
    let workdaysWithTurnTrue = [];

    // Recorrer cada mes en el objeto noWorkDays
    for (const month in noWorkDays) {
      if (noWorkDays.hasOwnProperty(month)) {
        for (const day in noWorkDays[month]) {
          if (noWorkDays[month].hasOwnProperty(day)) {
            const dateObject = {
              month: parseInt(month),
              day: parseInt(day),
            };

            const workdays = await WorkDay.find(dateObject);
            console.log(workdays, 'esto trae con find--------')
            datesProcessed.push(dateObject);

            if (workdays.length > 0) {
              workdaysToCancel.push(...workdays);
              workdaysWithTurnTrue.push(
                ...workdays.filter((workday) => workday.turn === true)
              );
            }
          }
        }
      }
    }

    if (workdaysToCancel.length === 0) {
      throw new Error("No se encontraron workdays para la fecha solicitada.");
    }

    for (const workday of workdaysWithTurnTrue) {
      for (let i = 0; i < workday.time.length; i++) {
        const applicant = workday.time[i].applicant;

        if (applicant && applicant.startsWith("pending-")) {
          throw new Error("Hay un pago en proceso, inténtelo en unos minutos");
        }

        if (applicant !== null && applicant !== "free") {
          const user = await User.findOne({ email: applicant });
          if (user) {
            daysToCancel.push({
              month: workday.month,
              day: workday.day,
              emailWorker: workday.email,
              nameWorker: workday.name,
              phone: user.phone ? user.phone : "no requerido",
              turn: {
                ini: workday.time[i].ini,
                end: workday.time[i].end,
              },
              emailUser: user.email,
              nameUser: user.name,
              howCancelled: "Admin",
              service: workday.time[i].requiredService,
            });
          }
          i = workday.time[i].end;
        }
      }
    }

    if (daysToCancel.length > 0) {
      await CancelledTurns.insertMany(daysToCancel);
    }

    const schedule = await Schedule.findOne();
    if (schedule) {
      var existingNoWorkDays = schedule.noWorkDays || {};

      // Combinar las fechas existentes con las nuevas fechas recibidas
      for (const month in noWorkDays) {
        if (noWorkDays.hasOwnProperty(month)) {
          if (!existingNoWorkDays[month]) {
            existingNoWorkDays[month] = {};
          }
          existingNoWorkDays[month] = {
            ...existingNoWorkDays[month],
            ...noWorkDays[month],
          };
        }
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

    for (const date of datesProcessed) {
      console.log('entrando en datesProccesed')
      await WorkDay.deleteMany({ month: date.month, day: date.day });
    }

    return datesProcessed;
  } catch (error) {
    console.error(
      "Error al actualizar los días en la base de datos:",
      error.message
    );
    throw new Error(error.message);
  }
};

module.exports = updateNoWorkCancelTurnController;
