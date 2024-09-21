const User = require("../../DB/models/User");

const updateUserTokenController = async (token, userId) => {
  try {
    const existingUser = await User.findOne({ id: userId });
    if (existingUser) {
      existingUser.pushToken = token;
      existingUser.notifications = token === null ? false : true;
      await existingUser.save();
      return existingUser;
    } else {
      throw new Error(`Usuario con id ${userId} no encontrado`);
    }
  } catch (error) {
    console.error("Error al intentar cambiar token del usuario", error);
    throw error;
  }
};

module.exports = updateUserTokenController;
