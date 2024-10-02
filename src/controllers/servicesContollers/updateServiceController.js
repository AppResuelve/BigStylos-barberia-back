const Services = require("../../DB/models/Services");
const User = require("../../DB/models/User");

const updateServiceController = async (
  category,
  service,
  price,
  sing,
  type
) => {
  try {
    var updatedFlag = false;

    const categoryLowerCase = category.toLowerCase();
    const serviceLowerCase = service.toLowerCase();

    const servicesDoc = await Services.findOne({});

    if (!servicesDoc) {
      throw new Error("No es posible obtener los servicios de base de datos.");
    } else {
      if (
        servicesDoc &&
        servicesDoc.services &&
        Object.keys(servicesDoc.services).length === 0
      ) {
        throw new Error("Aun no has creado servicios.");
      }
      if (
        servicesDoc &&
        servicesDoc.services &&
        Object.keys(servicesDoc.services).length > 0
      ) {
        if (servicesDoc.services[categoryLowerCase]) {
          if (!servicesDoc.services[categoryLowerCase][serviceLowerCase]) {
            throw new Error(
              "El servicio que intentas editar no existe en base de datos."
            );
          } else {
            servicesDoc.services[categoryLowerCase][serviceLowerCase] = {
              price,
              sing,
              type,
              img: servicesDoc.services[categoryLowerCase][serviceLowerCase]
                .img,
            };
            if (serviceLowerCase != serviceLowerCase) {
              delete servicesDoc.services[categoryLowerCase][serviceLowerCase];
            }
            updatedFlag = true;
          }
        } else {
          throw new Error(
            "La categoria del servicio que intentas editar no existe en base de datos."
          );
        }
      }
    }

    if (updatedFlag) {
      var users = await User.find();
      for (var user of users) {
        if (user.services[serviceLowerCase]) {
          if (serviceLowerCase !== serviceLowerCase) {
            user.services[serviceLowerCase] = user.services[serviceLowerCase];
            delete user.services[serviceLowerCase];
            user.markModified("services");
            await user.save();
          }
        }
      }
    }

    if (updatedFlag) {
      servicesDoc.markModified("services");
      await servicesDoc.save();
    }

    return servicesDoc;
  } catch (error) {
    console.error("Error al actualizar el servicio:", error);
    throw new Error("Error al actualizar el servicio");
  }
};

module.exports = updateServiceController;
