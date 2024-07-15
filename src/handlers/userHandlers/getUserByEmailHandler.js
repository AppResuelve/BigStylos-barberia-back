const getUserByEmailController = require("../../controllers/userControllers/getUserByEmailController");

const getUserByEmailHandler = async (req, res) => {
  const { email } = req.body;
  try {
    const User = await getUserByEmailController(email);
    res.status(200).json(User);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting user" });
  }
};

module.exports = getUserByEmailHandler;
