const User = require("../../DB/models/User");

const updateUserTokenController = async (token, userEmail) => {
  try {
    const existingUser = await User.findOne({ email: userEmail });
    if (existingUser) {
      existingUser.pushToken = token;
      existingUser.notifications = token === null ? false : true;
      await existingUser.save();
      return existingUser;
    } else {
      throw new Error(`Usuario con id ${userEmail} no encontrado`);
    }
  } catch (error) {
    console.error("Error al intentar cambiar token del usuario", error);
    throw error;
  }
};

module.exports = updateUserTokenController;
