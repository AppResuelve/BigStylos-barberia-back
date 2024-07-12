const Services = require("../../DB/models/Services");
const User = require("../../DB/models/User");

const deleteServicesController = async (service, category) => {
  try {
    const lowerCaseService = service ? service.toLowerCase() : null;
    const lowerCaseCategory = category.toLowerCase();

    // Buscar el servicio en la base de datos
    const existingServiceDoc = await Services.findOne({});
    if (existingServiceDoc) {
      // Verificar si la categoría existe
      if (existingServiceDoc.services[lowerCaseCategory]) {
        if (lowerCaseService === null) {
          // Eliminar toda la categoría y sus servicios
          const servicesToDelete = Object.keys(existingServiceDoc.services[lowerCaseCategory]);
          delete existingServiceDoc.services[lowerCaseCategory];

          // Eliminar todos los servicios de la categoría en los usuarios
          const update = {};
          servicesToDelete.forEach(service => {
            update[`services.${service}`] = 1;
          });

          await User.updateMany({}, { $unset: update });

          // Marcar la modificación y guardar el documento de servicios
          existingServiceDoc.markModified("services");
          await existingServiceDoc.save();
        } else {
          // Verificar si el servicio existe en la categoría
          if (existingServiceDoc.services[lowerCaseCategory][lowerCaseService]) {
            // Eliminar el servicio de la categoría
            delete existingServiceDoc.services[lowerCaseCategory][lowerCaseService];

            // Si la categoría queda vacía, eliminar también la categoría
            if (Object.keys(existingServiceDoc.services[lowerCaseCategory]).length === 0) {
              delete existingServiceDoc.services[lowerCaseCategory];
            }

            // Eliminar la propiedad del campo services de todos los usuarios
            await User.updateMany({}, {
              $unset: {
                [`services.${lowerCaseService}`]: 1,
              }
            });

            // Marcar la modificación y guardar el documento de servicios
            existingServiceDoc.markModified("services");
            await existingServiceDoc.save();
          } else {
            // Si el servicio no existe, retornar un mensaje indicando que no existe
            return { message: "El servicio no existe en la categoría especificada." };
          }
        }

        return existingServiceDoc; // Devolver el servicio actualizado
      } else {
        // Si la categoría no existe, retornar un mensaje indicando que no existe
        return { message: "La categoría especificada no existe." };
      }
    } else {
      // Si no existe el documento de servicios, retornar un mensaje indicando que no existe
      return { message: "No existen servicios en la colección." };
    }
  } catch (error) {
    console.error("Error al eliminar el servicio:", error);
    throw new Error("Error al eliminar el servicio");
  }
};

module.exports = deleteServicesController;
