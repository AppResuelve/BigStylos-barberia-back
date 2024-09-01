const cancelledTurnsController = require("../../controllers/cancelledTurnsControllers/cancelledTurnsController");

const getCancelledForWorkerHandler = async (req, res) => {
  const { emailWorker, month, day, nameUser, nameWorker  } = req.body;
  try {
    const turns = await cancelledTurnsController(emailWorker, month, day, nameUser );
    res.status(200).json(turns);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los turnos cancelados." });
  }
};

       /*  month: turn.month,
        day: turn.day,
        ini: turn.ini,
        end: turn.end,
        emailWorker: turn.worker.email,
        nameWorker: turn.worker.name,
        emailUser: userData.email,
        nameUser: userData.name */

module.exports = getCancelledForWorkerHandler;
