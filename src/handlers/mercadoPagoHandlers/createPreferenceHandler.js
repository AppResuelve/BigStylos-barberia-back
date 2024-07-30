const createPreferenceController = require("../../controllers/mercadoPagoControllers/createPreferenceController");

const createPreference = async (req, res) => {
  const { arrayItems } = req.body;

  try {
    const preference = await createPreferenceController(arrayItems);
    res.status(200).json(preference);
  } catch (error) {
    res.status(500).json({ message: "Error creating user." });
  }
};

module.exports = createPreference;