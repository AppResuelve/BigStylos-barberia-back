const createTurnController = require("../../controllers/workDaysControllers/createTurnsController");

const createTurnHandler = async (req, res) => {

  const { arrayItems } = req.body;
  try {
    const newDays = await createTurnController( arrayItems );
    res.status(200).json(newDays);
  } catch (error) {
    res.status(500).json({ message: "Error al reservar turno (handler)." });
  }
};

module.exports = createTurnHandler;