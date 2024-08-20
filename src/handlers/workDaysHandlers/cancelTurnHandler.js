const cancelTurnController = require("../../controllers/workDaysControllers/cancelTurnController");

const cancelTurnHandler = async (req, res) => {
  const { month, day, ini, end, emailWorker, emailUser, nameWorker, nameUser, service } = req.body;
  try {
    const cancelled = await cancelTurnController(
      month,
      day,
      ini,
      end,
      emailWorker,
      emailUser,
      nameWorker,
      nameUser,
      service
    );
    res.status(200).json(cancelled);
  } catch (error) {
    res.status(500).json({ message: "Error al cancelar turno (handler)." });
  }
};

module.exports = cancelTurnHandler;
