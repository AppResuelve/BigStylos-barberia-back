const Services = require("../../DB/models/Services");

const updateServicesImgController = async (service, img) => {
  try {
    // Buscar el primer documento en la colección de servicios
    const existingService = await Services.findOne({});

    if (existingService) {
      // Actualizar la propiedad allServices con el nuevo array de arrays
      existingService.allServices = servicesWithImg;

      // Guardar la actualización en la base de datos
      await existingService.save();

      return existingService; // Devolver el servicio actualizado
    } else {
      // Si no existe, crear un nuevo documento con el nuevo array de arrays
      const newService = new Services({
        allServices: servicesWithImg,
      });

      // Guardar el nuevo servicio en la base de datos
      await newService.save();

      return newService;
    }
  } catch (error) {
    console.error("Error al actualizar el servicio con imágenes:", error);
    throw new Error("Error al actualizar el servicio con imágenes");
  }
};

module.exports = updateServicesImgController;
