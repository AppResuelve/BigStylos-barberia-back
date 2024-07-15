const Services = require("../../DB/models/Services");
const User = require("../../DB/models/User");

const createServicesController = async (service, category, price, sing, type) => {
  try {
    console.log('entrando al controlador')

    const lowerCaseService = service.toLowerCase();
    const lowerCaseCategory = category.toLowerCase();

    // Buscar el primer documento en la colección de servicios
    let existingServiceDoc = await Services.findOne({});

    let isServiceAdded = false;

    if (!existingServiceDoc) {
      console.log('entra si no existe el documento')
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
      console.log('entra si existe un documento services')
      // Entrará al if solo si los servicios en DB son distintos a un objeto vacío
      if (Object.keys(existingServiceDoc.services).length < 1) {
        console.log('deberia entrar la propiedad es menor q 1')
        existingServiceDoc.services[lowerCaseCategory] = {
          [lowerCaseService]: {
            price,
            sing,
            type,
          }
        }
        existingServiceDoc.markModified("services");
        await existingServiceDoc.save()
        isServiceAdded = true
      } else { // no es un objeto vacio
        console.log('entra si no es un objeto vacio')
        if (existingServiceDoc.services[lowerCaseCategory]) {
          console.log('entra si existe el servicio')
          if (existingServiceDoc.services[lowerCaseCategory][lowerCaseService]) {
            console.log('entra si el servicio ya existe en la categoria')
            throw new Error("El servicio ya existe en esta categoria")
          } else {
            console.log('entra si la categoria no existe')
            for (let category in existingServiceDoc.services) {
              if (existingServiceDoc.services[category][lowerCaseService]) {
                console.log('entra si existe en otra categoria')
                throw new Error("El servicio ya existe en otra categoria"); // Si el servicio existe en alguna categoría retorna
              }
            }
            console.log('entra si no existe en otra categoria y lo crea')
            existingServiceDoc.services[lowerCaseCategory][lowerCaseService] = {
              price,
              sing,
              type,
            };
            isServiceAdded = true
          }


        } else {
          console.log('entra si la categoria no existe')
          for (let category in existingServiceDoc.services) {
            if (existingServiceDoc.services[category][lowerCaseService]) {
              console.log('entra si existe en otra categoria')
              throw new Error("El servicio ya existe en otra categoria"); // Si el servicio existe en alguna categoría retorna
            }
          }
          console.log('entra si lo crea cuando no existe en otra categoria')
          existingServiceDoc.services[lowerCaseCategory] = {
            [lowerCaseService]: {
              price,
              sing,
              type,
            }
          }
          isServiceAdded = true
        }
      }
    }
    console.log('entra cuando sale de la creacion de servicio')
    // Solo si se ha añadido el servicio, actualizar la propiedad services de cada usuario
    if (isServiceAdded) {
      console.log('entramos en la edicion de usuarios');
      var users = await User.find();

      for (var user of users) {
        if (!user.services) {
          user.services = {};
        }
        if (!user.services[lowerCaseService]) {
          user.services[lowerCaseService] = {
            duration: null,
            available: false
          };
          user.markModified("services");
          await user.save();
        }
      }
    }
    if (isServiceAdded) {
      existingServiceDoc.markModified("services")
      await existingServiceDoc.save();
    }
    console.log('entra si retorna')
    return existingServiceDoc;
  } catch (error) {
    console.error("Error al crear o actualizar el servicio:", error);
    throw new Error("Error al crear o actualizar el servicio");
  }
};

module.exports = createServicesController;
