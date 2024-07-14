const Personalization = require("../../DB/models/Personalization");

const getPersonalizationController = async () => {
  try {
    let modified = false;
    let existingPersonalization = await Personalization.findOne();

    if (!existingPersonalization) {
      existingPersonalization = new Personalization({
        allImages: [
          ["logotipo", ""],
          ["fondo-de-pantalla", ""],
        ],
        allColors: ["white"],
      });
      modified = true;
    } else {
      if (
        !existingPersonalization.allImages ||
        existingPersonalization.allImages.length === 0
      ) {
        existingPersonalization.allImages = [
          ["logotipo", ""],
          ["fondo-de-pantalla", ""],
        ];
        existingPersonalization.markModified("allImages");
        modified = true;
      }
      if (
        !existingPersonalization.allColors ||
        existingPersonalization.allColors.length === 0
      ) {
        existingPersonalization.allColors = ["white"];
        existingPersonalization.markModified("allColors");
        modified = true;
      }
    }

    if (modified) {
      await existingPersonalization.save();
    }
    return existingPersonalization;
  } catch (error) {
    console.error(
      "Error al obtener la personalización desde la base de datos:",
      error
    );
    throw new Error(
      "Error al obtener la personalización desde la base de datos"
    );
  }
};

module.exports = getPersonalizationController;
