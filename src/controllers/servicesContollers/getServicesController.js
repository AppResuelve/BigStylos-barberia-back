const Services = require("../../DB/models/Services");

const getServicesController = async () => {
  try {
    // Obtener el documento de servicios desde la base de datos
    const servicesDoc = await Services.findOne({});
    if (!servicesDoc) {
      return { message: "No se encontraron servicios en la base de datos." };
    } else {
      return servicesDoc.services;
    }
  } catch (error) {
    console.error("Error al obtener servicios:", error);
    throw new Error("Error al obtener servicios");
  }
};

module.exports = getServicesController;
