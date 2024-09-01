const toFreeTurnsController = require("../../controllers/workDaysControllers/toFreeTurnsController");

const toFreeTurnsHandler = async (req, res) => {
      const { arrayItems } = req.body;
      
  try {
    const items = await toFreeTurnsController(arrayItems);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Error updating to free the arrayItems" });
  }
};
module.exports = toFreeTurnsHandler;
