const User = require("../../DB/models/User");

const updateUserController = async (email, newServicesDuration) => {
  try {
    const user = await User.findOne({ email });
    if (newServicesDuration && Object.keys(newServicesDuration).length > 0) {
      user.services = newServicesDuration;
      await user.save();
      return user;
    } else if (user) {
      user.worker = !user.worker;
      await user.save();
      return user;
    } else {
      // Puedes manejar el caso en el que no se encuentra el usuario con ese correo
      throw new Error(`Usuario con correo ${email} no encontrado`);
    }
  } catch (error) {
    console.error("Error al intentar cambiar el worker del usuario", error);
    throw error;
  }
};

module.exports = updateUserController;