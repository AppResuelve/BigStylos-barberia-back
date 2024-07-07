const Services = require("../../DB/models/Services");
const User = require("../../DB/models/User");

const createServicesController = async (service, category, price, sing, type) => {
  try {
    const lowerCaseService = service.toLowerCase();
    const lowerCaseCategory = category.toLowerCase();

    // Buscar el primer documento en la colección de servicios
    let existingServiceDoc = await Services.findOne({});

    let isServiceAdded = false;

    if (!existingServiceDoc) {
      // Si no existe, crear un nuevo documento con la nueva categoría y servicio
      existingServiceDoc = new Services({
        services: {
          [lowerCaseCategory]: {
            [lowerCaseService]: {
              price,
              sing,
              type
            }
          }
        }
      });

      // Guardar el nuevo documento en la base de datos
      await existingServiceDoc.save();
      isServiceAdded = true;
    } else {
      console.log('entra si ya existe la propiedad services');

      if (existingServiceDoc.services[lowerCaseCategory]) {  //existe la categoria
        if (existingServiceDoc.services[lowerCaseCategory][lowerCaseService]) {
          throw new Error("El servicio ya existe en la categoria");
        } else {
          console.log('entra si existe la categoria pero no el servicio');
          // Agregar el nuevo servicio a la categoría existente sin sobrescribir los existentes
          existingServiceDoc.services[lowerCaseCategory][lowerCaseService] = {
            price,
            sing,
            type
          };
          isServiceAdded = true;
        }
      } else {
        console.log('si no existe categoria ni servicio');
        // Crear la nueva categoría con el nuevo servicio
        existingServiceDoc.services[lowerCaseCategory] = {
          [lowerCaseService]: {
            price,
            sing,
            type
          }
        };
        isServiceAdded = true;
      }
      existingServiceDoc.markModified("services");
      await existingServiceDoc.save();
    }

    // Solo si se ha añadido el servicio, actualizar la propiedad services de cada usuario
    if (isServiceAdded) {
      const users = await User.find();
      for (const user of users) {
        if (!user.services) {
          user.services = {};
        }
        user.services[lowerCaseService] = {
          duration: null,
          available: false
        };
        await user.save();
      }
    }

    return existingServiceDoc;
  } catch (error) {
    console.error("Error al crear o actualizar el servicio:", error);
    throw new Error("Error al crear o actualizar el servicio");
  }
};

module.exports = createServicesController;
