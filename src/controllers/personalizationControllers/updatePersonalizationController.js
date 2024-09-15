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
        await existingPersonalization.save();
        return existingPersonalization.allImages;
      } else {
        existingPersonalization.allColors = newColors;
        existingPersonalization.markModified("allColors");
        await existingPersonalization.save();
        return existingPersonalization.allColors;
      }
    }
  } catch (error) {
    console.error("Error al actualizar la personalizacion", error);
    throw new Error("Error al actualizar la personalizacion");
  }
};

module.exports = updatePersonalizationController;
