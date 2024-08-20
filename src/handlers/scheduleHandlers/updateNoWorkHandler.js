const updateNoWorkController = require("../../controllers/scheduleControllers/updateNoWorkController");

const updateNoWorkHandler = async (req, res) => {
  const { noWorkDays, daysToCancel } = req.body;
  try {
    const updatedDays = await updateNoWorkController(noWorkDays, daysToCancel);
    res.status(200).json(updatedDays);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error en handler al asignar nuevos días" });
  }
};

module.exports = updateNoWorkHandler;
