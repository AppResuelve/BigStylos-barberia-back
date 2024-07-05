const User = require("../../DB/models/User");

const Services = require("../../DB/models/Services");

const createGoogleUserController = async (name, email, image) => {
  try {
    const existingGoogleUser = await User.findOne({
      where: { email: email },
    });
  console.log(existingGoogleUser, "esto es lo que encuentra");

    if (existingGoogleUser) {
      existingGoogleUser.image = image;
      await existingGoogleUser.save();

      // Devolver el usuario existente con la imagen actualizada
      return {
        id: existingGoogleUser.id,
        name: existingGoogleUser.name,
        email: existingGoogleUser.email,
        image: existingGoogleUser.image,
        admin: existingGoogleUser.admin,
        worker: existingGoogleUser.worker,
        isDelete: existingGoogleUser.isDelete,
        phone: existingGoogleUser.phone,
        services: existingGoogleUser.services,
      };
    } else {
      const newGoogleUser = new User({
        name: name,
        email: email,
        image: image,
        admin: false,
        worker: false,
        isDelete: false,
        phone: "",
        services: {},
      });

      const existingServiceDoc = await Services.findOne({}); // trae array de strings con servicios
      // Crear el objeto de servicios para el nuevo usuario con solo los servicios
      if (existingServiceDoc && existingServiceDoc.services) {
        const servicesObject = {};

        for (const category in existingServiceDoc.services) {
          for (const service in existingServiceDoc.services[category]) {
            servicesObject[service] = { duration: null, available: false };
          }
        }

        // Establecer las propiedades de services para el nuevo usuario
        newGoogleUser.services = servicesObject;
      }

      // Guardar el nuevo usuario en la base de datos
      await newGoogleUser.save();

      return {
        id: newGoogleUser.id,
        name: newGoogleUser.name,
        email: newGoogleUser.email,
        image: newGoogleUser.image,
        admin: newGoogleUser.admin,
        worker: newGoogleUser.worker,
        isDelete: newGoogleUser.isDelete,
        phone: newGoogleUser.phone,
        services: newGoogleUser.services,
      };
    }
  } catch (error) {
    console.error("Error creating the user", error);
    throw error;
  }
};

module.exports = createGoogleUserController;
