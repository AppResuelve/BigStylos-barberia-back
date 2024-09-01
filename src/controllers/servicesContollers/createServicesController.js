const Services = require("../../DB/models/Services");
const User = require("../../DB/models/User");

const createServicesController = async (
  service,
  category,
  price,
  sing,
  type
) => {
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
              type,
              img: "",
            },
          },
        },
      });

      // Guardar el nuevo documento en la base de datos
      await existingServiceDoc.save();
      isServiceAdded = true;
    } else {
      // Entrará al if solo si los servicios en DB son distintos a un objeto vacío
      if (Object.keys(existingServiceDoc.services).length < 1) {
        existingServiceDoc.services[lowerCaseCategory] = {
          [lowerCaseService]: {
            price,
            sing,
            type,
            img: "",
          },
        };
        existingServiceDoc.markModified("services");
        await existingServiceDoc.save();
        isServiceAdded = true;
      } else {
        // no es un objeto vacio
        if (existingServiceDoc.services[lowerCaseCategory]) {
          if (
            existingServiceDoc.services[lowerCaseCategory][lowerCaseService]
          ) {
            throw new Error("El servicio ya existe en esta categoria");
          } else {
            for (let category in existingServiceDoc.services) {
              if (existingServiceDoc.services[category][lowerCaseService]) {
                throw new Error("El servicio ya existe en otra categoria"); // Si el servicio existe en alguna categoría retorna
              }
            }
            existingServiceDoc.services[lowerCaseCategory][lowerCaseService] = {
              price,
              sing,
              type,
              img: "",
            };
            isServiceAdded = true;
          }
        } else {
          for (let category in existingServiceDoc.services) {
            if (existingServiceDoc.services[category][lowerCaseService]) {
              throw new Error("El servicio ya existe en otra categoria"); // Si el servicio existe en alguna categoría retorna
            }
          }
          existingServiceDoc.services[lowerCaseCategory] = {
            [lowerCaseService]: {
              price,
              sing,
              type,
              img: "",
            },
          };
          isServiceAdded = true;
        }
      }
    }
    // Solo si se ha añadido el servicio, actualizar la propiedad services de cada usuario
    if (isServiceAdded) {
      var users = await User.find();

      for (var user of users) {
        if (!user.services) {
          user.services = {};
        }
        if (!user.services[lowerCaseService]) {
          user.services[lowerCaseService] = {
            duration: 0,
            available: false,
          };
          user.markModified("services");
          await user.save();
        }
      }
    }
    if (isServiceAdded) {
      existingServiceDoc.markModified("services");
      await existingServiceDoc.save();
    }
    return existingServiceDoc;
  } catch (error) {
    console.error("Error al crear o actualizar el servicio:", error);
    throw new Error("Error al crear o actualizar el servicio");
  }
};

module.exports = createServicesController;
