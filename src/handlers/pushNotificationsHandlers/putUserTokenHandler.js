const updateUserTokenController = require("../../controllers/pushNotificationsControllers/updateUserTokenController");

const updateUserTokenHandler = async (req, res) => {
  const { token, userId } = req.body;
  try {
    const updatedUserToken = await updateUserTokenController(token, userId);
    res.status(200).json(updatedUserToken);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al updatear el user" });
  }
};

module.exports = updateUserTokenHandler;
