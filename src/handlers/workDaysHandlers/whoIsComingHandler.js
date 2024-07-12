const whoIsComingController = require("../../controllers/workDaysControllers/whoIsComingController");

const whoIsComingHandler = async (req, res) => {
  const { emailWorker, month, day } = req.body;

  try {
    const turns = await whoIsComingController(emailWorker, month, day);
    res.status(200).json(turns);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error al obtener los turnos." });
    }
  }
};

module.exports = whoIsComingHandler;
