const Services = require("../../DB/models/Services");

const updateCategoryController = async (prev, current) => {
  try {
    // Convertir ambos valores a minúsculas
     const prevLowerCase = prev.toLowerCase();
    const currentLowerCase = current.toLowerCase();

    // Buscar el documento de servicios en la base de datos
    const servicesDoc = await Services.findOne({});

    if (!servicesDoc) {
      throw new Error("No se encontraron servicios en la base de datos.");
    }

    if (Object.keys(servicesDoc.services).length === 0) {
      throw new Error("Aún no tienes servicios creados.");
    }

    if (!servicesDoc.services[prevLowerCase]) {
      throw new Error("La categoría que deseas editar no existe en la base de datos.");
    }

    // Crear la nueva categoría con el nombre actualizado y copiar los datos de la categoría anterior
    servicesDoc.services[currentLowerCase] = servicesDoc.services[prevLowerCase];

    // Eliminar la categoría anterior
    delete servicesDoc.services[prevLowerCase];

    // Marcar la modificación y guardar el documento
    servicesDoc.markModified("services");
    await servicesDoc.save();

    return servicesDoc; // Devolver el documento actualizado
  } catch (error) {
    console.error("Error al actualizar la categoría:", error);
    throw new Error("Error al actualizar la categoría");
  }
};

module.exports = updateCategoryController;
