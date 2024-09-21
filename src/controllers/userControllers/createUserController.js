const User = require("../../DB/models/User");
const Services = require("../../DB/models/Services");

const createUserController = async (name, email, image) => {
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return existingUser;
    } else {
      const newUser = new User({
        name: name,
        email: email,
        image: image,
        admin: false,
        worker: false,
        isDelete: false,
        phone: "",
        services: {}, // Inicializa con un objeto vacío
        pushToken: null,
        notifications: false,
      });
      const existingService = await Services.findOne({}); // trae array de strings con servicios
      const servicesList = existingService ? existingService.allServices : [];

      // Crear el objeto de servicios para el nuevo usuario
      const servicesObject = servicesList.reduce((acc, curr) => {
        acc[curr[0]] = {duration: null, available: false};
        return acc;
      }, {});

      // Establecer las propiedades de services para el nuevo usuario
      newUser.services = servicesObject;

      // Guardar el nuevo usuario en la base de datos
      await newUser.save();

      return newUser;
    }
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

module.exports = createUserController;
