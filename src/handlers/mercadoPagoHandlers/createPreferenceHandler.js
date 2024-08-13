const createPreferenceController = require("../../controllers/mercadoPagoControllers/createPreferenceController");
const createTurnController = require("../../controllers/workDaysControllers/createTurnsController");
const pendingTurnsController = require("../../controllers/workDaysControllers/pendingTurnsController");

const createPreference = async (req, res) => {
  const { cartWithSing, arrayItems } = req.body;

  try {
    const createAndPending = await pendingTurnsController(arrayItems);
    if (createAndPending.success) {
      const response = await createPreferenceController(cartWithSing);

      res.status(200).json(response);

      setTimeout(() => {
        createTurnController(arrayItems);
      }, 200000);
    } else {
      res.status(200).json(createAndPending);
    }
  } catch (error) {
    res.status(500).json({ message: "Error taking the turn." });
  }
};

module.exports = createPreference;
