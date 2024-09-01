const updateNoWorkCancelTurnController = require("../../controllers/scheduleControllers/updateNoWorkCancelTurnController");

const updateNoWorkCancelTurnHandler = async (req, res) => {
  const { noWorkDaysCancelTurn } = req.body;
  try {
    const updatedNoWorkDays = await updateNoWorkCancelTurnController(
      noWorkDaysCancelTurn
    );
    res.status(200).json(updatedNoWorkDays);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error en handler al asignar nuevos días" });
  }
};

module.exports = updateNoWorkCancelTurnHandler;
