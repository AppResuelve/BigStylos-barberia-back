const Services = require("../../DB/models/Services");

const updateServicesImgController = async (servicesWithImg) => {
  try {
    // Buscar el primer documento en la colección de servicios
    const existingService = await Services.findOne({});

    if (existingService && Object.keys(existingService.services).length > 0) {
      // Actualizar la propiedad allServices con el nuevo array de arrays
      for (let i = 0; i < servicesWithImg.length; i++) {
        for (let category in existingService.services) {
          if (existingService.services[category][servicesWithImg[i][0]]) {
            existingService.services[category][servicesWithImg[i][0]].img =
              servicesWithImg[i][1];
          }
        }
      }
      existingService.markModified("services");
      // Guardar la actualización en la base de datos
      await existingService.save();

      return existingService; // Devolver el servicio actualizado
    } else {
      throw new Error("No se encontraron servicios");
    }
  } catch (error) {
    console.error("Error al actualizar el servicio con imágenes:", error);
    throw new Error("Error al actualizar el servicio con imágenes");
  }
};

module.exports = updateServicesImgController;
