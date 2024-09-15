const updateUserController = require("../../controllers/userControllers/updateUserController");

const updateUserHandler = async (req, res) => {
  const { email, newServicesDuration, newPhoneNumber } = req.body;
  try {
    const user = await updateUserController(
      email,
      newServicesDuration,
      newPhoneNumber
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al intentar cambiar usuario" });
  }
};

module.exports = updateUserHandler;
