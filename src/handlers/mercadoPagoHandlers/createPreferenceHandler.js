const createPreferenceController = require("../../controllers/mercadoPagoControllers/createPreferenceController");
const pendingTurnsController = require("../../controllers/workDaysControllers/pendingTurnsController");
const toFreeTurnsController = require("../../controllers/workDaysControllers/toFreeTurnsController");

const createPreference = async (req, res) => {
  const { cartWithSing, arrayItems } = req.body;

  console.log( cartWithSing, arrayItems, 'estas son las props-----------')

  try {
    const pendingTurns = await pendingTurnsController(arrayItems);

    if (pendingTurns.success) {
      let pending = pendingTurns.success
      let response = await createPreferenceController(cartWithSing, pending);
      response.turns = pendingTurns.success;
      res.status(200).json(response);

      if (pendingTurns.success) {
        setTimeout(() => {
          toFreeTurnsController(pendingTurns.success);
        }, 200000);
      }
    } else {
      res.status(200).json(pendingTurns);
    }
  } catch (error) {
    res.status(500).json({ message: "Error taking the turn." });
  }
};

module.exports = createPreference;
