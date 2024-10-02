const updateServiceController = require("../../controllers/servicesContollers/updateServiceController");

const updateServiceHandler = async (req, res) => {
    const { category, service, price, sing, type } = req.body;
    try {
      const updatedService = await updateServiceController( category,service, price, sing, type );
      res.status(200).json(updatedService);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error en handler al editar servicio." });
    }
  };
  
  module.exports = updateServiceHandler;