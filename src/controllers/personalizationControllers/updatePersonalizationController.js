const Personalization = require("../../DB/models/Personalization");

const updatePersonalizationController = async (newImages, newColors) => {
  try {
    const existingPersonalization = await Personalization.findOne({});
    if (!existingPersonalization) {
      const newPersonalization = new Personalization({
        allImages: newImages,
        allColors: newColors,
      });

      // Guardar el nuevo servicio en la base de datos
      await newPersonalization.save();

    } else {
      if (newImages) {
        existingPersonalization.allImages = newImages;
        existingPersonalization.markModified("allImages");
      } else {
        existingPersonalization.allColors = newColors;
        existingPersonalization.markModified("allColors");
      }

      await existingPersonalization.save();
    }

    // Guardar la actualización en la base de datos
    return existingPersonalization; // Devolver el servicio actualizado
  } catch (error) {
    console.error("Error al actualizar la personalizacion", error);
    throw new Error("Error al actualizar la personalizacion");
  }
};

module.exports = updatePersonalizationController;
