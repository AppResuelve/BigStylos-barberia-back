const Services = require("../../DB/models/Services");
const User = require("../../DB/models/User");

const createServicesController = async (service, category, price, sing) => {
  try {
    const lowerCaseService = service.toLowerCase();
    const lowerCaseCategory = category.toLowerCase();
    
    // Buscar el primer documento en la colección de servicios
    let existingServiceDoc = await Services.findOne({});
    if (!existingServiceDoc) {
      // Si no existe, crear un nuevo documento con la nueva categoría y servicio
      existingServiceDoc = new Services({
        services: {
          [lowerCaseCategory]: {
            [lowerCaseService]: {
              price,
              sing,
            }
          }
        }
      });

      // Guardar el nuevo documento en la base de datos
      await existingServiceDoc.save();

      return existingServiceDoc;
    }

    // Verificar si la categoría ya existe
    if (existingServiceDoc.services[lowerCaseCategory]) {
      const categoryObj = existingServiceDoc.services[lowerCaseCategory];

      // Verificar si el servicio ya existe en la categoría
      if (categoryObj[lowerCaseService]) {
        return {
          message: "El servicio ya existe en la categoría.",
        };
      } else {
        // Si no existe, agregar el nuevo servicio a la categoría existente
       categoryObj[lowerCaseService] = {
         price,
         sing,
       };
        existingServiceDoc.markModified("services");

        // Guardar la actualización en la base de datos
        await existingServiceDoc.save();

        return existingServiceDoc;
      }
    } else {
      // Si la categoría no existe, crear la nueva categoría con el servicio
      existingServiceDoc.services[lowerCaseCategory] = {
        [lowerCaseService]: {
          price,
          sing,
        },
      };
      existingServiceDoc.markModified("services");

      // Guardar la actualización en la base de datos
      await existingServiceDoc.save();

      return existingServiceDoc;
    }
  } catch (error) {
    console.error("Error al crear o actualizar el servicio:", error);
    throw new Error("Error al crear o actualizar el servicio");
  }
};

module.exports = createServicesController;
