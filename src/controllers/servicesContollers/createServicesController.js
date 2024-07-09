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
      // Entrará al if solo si los servicios en DB son distintos a un objeto vacío
      if (Object.keys(existingServiceDoc.services).length > 0) {
        for (let category in existingServiceDoc.services) {
          if (existingServiceDoc.services[category][lowerCaseService]) {
            throw new Error("El servicio ya existe"); // Si el servicio existe en alguna categoría retorna
          }
        }

        // Si no se encontró el servicio en ninguna categoría, procede a agregarlo
        if (existingServiceDoc.services[lowerCaseCategory]) {  // Existe la categoría
          // Agregar el nuevo servicio a la categoría existente sin sobrescribir los existentes
          existingServiceDoc.services[lowerCaseCategory][lowerCaseService] = {
            price,
            sing,
            type
          };
          isServiceAdded = true;
        } else {
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