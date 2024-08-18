const WorkDay = require("../../DB/models/WorkDay");
const corroborate = require("../../helpers/corroborateDisponibility");
const noNullCancelledController = require("./noNullCancelledController");

const cancelTurnController = async (
  month,
  day,
  ini,
  end,
  emailWorker,
  emailClient,
) => {

  
  try {
    var existingDay = await WorkDay.findOne({ month, day, email: emailWorker }); // ojo, no poner array de objetos

    if (existingDay) {
      for (let i = ini; i <= end; i++) {
        if (existingDay.time[i].applicant === emailClient) {
          existingDay.time[i].applicant = "free";
        }
      }
      existingDay.markModified("time");

      let count = false;
      existingDay.time.forEach((element) => {
        if (element.applicant !== null && element.applicant !== "free") {
          count = true;
        }
      });
      if (count === false) {
        existingDay.turn = false;
      }

      const serv = Object.keys(existingDay.services);
      serv.forEach((element) => {
        existingDay.services[element].available = corroborate(
          existingDay.time,
          existingDay.services[element].duration
        );
      });
      existingDay.markModified("services");
      await existingDay.save();

      // const toCancelled = await noNullCancelledController(
      //   [{ email: emailWorker, ini, end }],
      //   month,
      //   day,
      //   emailClient
      // );
    }

    return existingDay;
  } catch (error) {
    console.error("Error en el controlador de cancelacion de turno:", error);
    throw error;
  }
};

module.exports = cancelTurnController;
