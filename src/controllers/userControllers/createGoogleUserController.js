const User = require("../../DB/models/User");
const Services = require("../../DB/models/Services");

const createGoogleUserController = async (name, email, image) => {
  try {
    const existingGoogleUser = await User.findOne({ email: email });

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
        services: {}, // Inicializa con un objeto vacío
      });

      const existingServiceDoc = await Services.findOne({});

      if (existingServiceDoc && existingServiceDoc.services) {
        const servicesObject = {};

        for (const category in existingServiceDoc.services) {
          const categoryServices = existingServiceDoc.services[category];
          if (typeof categoryServices === 'object' && categoryServices !== null) {
            for (const service in categoryServices) {
              servicesObject[service] = { duration: null, available: false };
            }
          }
        }
        console.log(servicesObject, "esto es servicesObject")
        newGoogleUser.services = servicesObject;
      }

      // Guardar el nuevo usuario en la base de datos
      await newGoogleUser.save();
      console.log(newGoogleUser.services, "esto es newGoogleUser.ser")
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