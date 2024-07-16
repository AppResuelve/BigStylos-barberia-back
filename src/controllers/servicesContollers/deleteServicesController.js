const Services = require("../../DB/models/Services");
const User = require("../../DB/models/User");

const deleteServicesController = async (services) => {
  try {
    // Buscar el documento de servicios en la base de datos
    const existingServiceDoc = await Services.findOne({});
    if (!existingServiceDoc) {
      return { message: "No existen servicios en la colección." };
    }

    const servicesToDelete = services.map(service => service.toLowerCase());
    const categoriesToCheck = new Set();

    // Recorrer los servicios a eliminar
    servicesToDelete.forEach(service => {
      for (const [category, categoryServices] of Object.entries(existingServiceDoc.services)) {
        if (categoryServices[service]) {
          delete categoryServices[service];
          categoriesToCheck.add(category);
        }
      }
    });

    // Verificar si las categorías quedan vacías y eliminarlas si es necesario
    categoriesToCheck.forEach(category => {
      if (Object.keys(existingServiceDoc.services[category]).length === 0) {
        delete existingServiceDoc.services[category];
      }
    });

    // Preparar la actualización para eliminar los servicios de todos los usuarios
    const update = {};
    servicesToDelete.forEach(service => {
      update[`services.${service}`] = 1;
    });

    await User.updateMany({}, { $unset: update });

    // Marcar la modificación y guardar el documento de servicios
    existingServiceDoc.markModified("services");
    await existingServiceDoc.save();

    return existingServiceDoc; // Devolver el servicio actualizado
  } catch (error) {
    console.error("Error al eliminar el servicio:", error);
    throw new Error("Error al eliminar el servicio");
  }
};

module.exports = deleteServicesController;
