const CancelledTurns = require("../../DB/models/CancelledTurns");


const cancelledTurnsController = async (emailWorker, month, day) => {

  try {
    const turns = await CancelledTurns.find({
      emailWorker: emailWorker,
      month,
      day,
    });
console.log(turns);

    return turns;
  } catch (error) {
    console.error("Error al obtener días laborales:", error);
    throw error;
  }
};

module.exports = cancelledTurnsController;