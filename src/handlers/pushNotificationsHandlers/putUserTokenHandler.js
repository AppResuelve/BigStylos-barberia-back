const updateUserTokenController = require("../../controllers/pushNotificationsControllers/updateUserTokenController");

const updateUserTokenHandler = async (req, res) => {
  const { token, userEmail } = req.body;
  try {
    const updatedUserToken = await updateUserTokenController(token, userEmail);
    res.status(200).json(updatedUserToken);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al updatear el user" });
  }
};

module.exports = updateUserTokenHandler;
