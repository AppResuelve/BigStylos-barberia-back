const deleteServicesController = require("../../controllers/servicesContollers/deleteServicesController");

const deleteServicesHandler = async (req, res) => {
    const { service, category } = req.body;

    try {
        const result = await deleteServicesController(service, category);

        if (result.message) {
            // Si hay un mensaje, significa que el servicio no existe
            return res.status(404).json({ message: result.message });
        }

        // Si no hay mensaje, el servicio se eliminó correctamente
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

module.exports = deleteServicesHandler;
