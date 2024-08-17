const cancelTurnController = require("../../controllers/workDaysControllers/cancelTurnController");

const cancelTurnHandler = async (req, res) => {
  
  const { ini, end, emailWorker, emailUser, month, day } = req.body;
  try {
    //const cancelled = await cancelTurnController(month, day, time, emailWorker, emailClient, selectedService);
    const cancelled = await cancelTurnController(ini, end, emailWorker, emailUser, month, day)
    res.status(200).json(cancelled);
  } catch (error) {
    res.status(500).json({ message: "Error al cancelar turno (handler)." });
  }
};

module.exports = cancelTurnHandler;