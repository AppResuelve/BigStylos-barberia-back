const Services = require("../../DB/models/Services");

const createServicesController = async (service) => {
  try {
    // Verificar si ya existe un documento en la colección
    const existingService = await Services.findOne({});

    if (existingService) {
      // Si ya existe, verificar si el servicio ya está en allServices
      const isServiceIncluded = existingService.allServices.includes(service);

      if (isServiceIncluded) {
        // Si el servicio ya existe, retornar un mensaje indicando que ya existe
        return {
          message: `El servicio "${existingService}" ya existe en la colección.`,
        };
      } else {
        // Si no existe, agregar el nuevo servicio a la propiedad allServices
        existingService.allServices.push(service);

        // Guardar la actualización en la base de datos
        await existingService.save();

        return existingService; // Puedes devolver el servicio actualizado si es necesario
      }
    } else {
      // Si no existe, crear un nuevo documento con el nuevo servicio
      const newService = new Services({
        allServices: [service],
      });

      // Guardar el nuevo servicio en la base de datos
      await newService.save();

      return newService; // Puedes devolver el nuevo servicio creado si es necesario
    }
  } catch (error) {
    console.error("Error al crear o actualizar el servicio:", error);
    throw new Error("Error al crear o actualizar el servicio");
  }
};

module.exports = createServicesController;
