const createServicesController = require("../../controllers/servicesContollers/createServicesController");

const createServicesHandler = async (req, res) => {
    const { service, category, price, sing, type } = req.body;
    console.log(service, "esto es lo que encuentra"); 

  try {
    const result = await createServicesController(
      service,
      category,
      price,
      sing,
      type
    );

    // if (result.message) {
    //     // Si existe un mensaje, significa que el servicio ya existe
    //     return res.status(409).json({ message: result.message, existingService: result.existingService });
    // }

    res.status(201).json({ result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = createServicesHandler;
