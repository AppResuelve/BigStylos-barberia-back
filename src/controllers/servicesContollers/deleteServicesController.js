const Services = require("../../DB/models/Services");
const User = require("../../DB/models/User");

const deleteServicesController = async (service, category) => {
  try {
    const lowerCaseService = service.toLowerCase();
    const lowerCaseCategory = category.toLowerCase();

    // Buscar el servicio en la base de datos
    const existingServiceDoc = await Services.findOne({});
    if (existingServiceDoc) {
      // Verificar si la categoría y el servicio existen
      if (
        existingServiceDoc.services[lowerCaseCategory] &&
        existingServiceDoc.services[lowerCaseCategory][lowerCaseService]
      ) {
        // Eliminar el servicio de la categoría
        delete existingServiceDoc.services[lowerCaseCategory][lowerCaseService];

        // Si la categoría queda vacía, eliminar también la categoría
        if (
          Object.keys(existingServiceDoc.services[lowerCaseCategory]).length ===
          0
        ) {
          delete existingServiceDoc.services[lowerCaseCategory];
        }

        existingServiceDoc.markModified("services");

        // Eliminar la propiedad del campo services de todos los usuarios
        await User.updateMany(
          {},
          {
            $unset: {
              [`services.${lowerCaseCategory}.${lowerCaseService}`]: 1,
            },
          }
        );

        // Guardar la actualización en la base de datos
        await existingServiceDoc.save();

        return existingServiceDoc; // Devolver el servicio actualizado
      } else {
        // Si la categoría o el servicio no existen, retornar un mensaje indicando que no existe
        return {
          message: "El servicio no existe en la categoría especificada.",
        };
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
