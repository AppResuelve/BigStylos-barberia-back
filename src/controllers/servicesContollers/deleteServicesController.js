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
    
    // Crear una copia de existingServiceDoc.services y filtrar los servicios a eliminar
    const filteredServices = {};
    for (const [category, categoryServices] of Object.entries(existingServiceDoc.services)) {
      filteredServices[category] = {};
      for (const [serviceName, serviceDetails] of Object.entries(categoryServices)) {
        if (!servicesToDelete.includes(serviceName.toLowerCase())) {
          filteredServices[category][serviceName] = serviceDetails;
        }
      }
    }

    // Verificar si las categorías quedan vacías y eliminarlas si es necesario
    for (const category in filteredServices) {
      if (Object.keys(filteredServices[category]).length === 0) {
        delete filteredServices[category];
      }
    }

    // Preparar la actualización para eliminar los servicios de todos los usuarios
    const update = {};
    servicesToDelete.forEach(service => {
      update[`services.${service}`] = 1;
    });

    // Agregar logs detallados

    const userUpdateResult = await User.updateMany({}, { $unset: update });

    // Actualizar el documento de servicios con los servicios filtrados
    existingServiceDoc.services = Object.keys(filteredServices).length > 0 ? filteredServices : {};

    // Marcar la modificación y guardar el documento de servicios
    existingServiceDoc.markModified("services");
    const saveResult = await existingServiceDoc.save();

    // Agregar logs detallados después de guardar

    return existingServiceDoc; // Devolver el servicio actualizado
  } catch (error) {
    console.error("Error al eliminar el servicio:", error);
    throw new Error("Error al eliminar el servicio");
  }
};

module.exports = deleteServicesController;
