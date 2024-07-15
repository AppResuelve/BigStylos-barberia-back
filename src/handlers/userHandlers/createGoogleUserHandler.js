const createGoogleUserController = require("../../controllers/userControllers/createGoogleUserController");

const createGoogleUserHandler = async (req, res) => {
  try {
    const googlePayload = JSON.parse(req.headers["x-google-payload"]); // Obtener el payload de los headers
      console.log('linea 6 handler google')
    if (googlePayload) {
      console.log('si tengo el googlePayload')
      const { name, picture, email } = googlePayload;
      const newGoogleUser = await createGoogleUserController(
        name,
        email,
        picture
      );
      res.status(200).json(newGoogleUser);
    } else {
      // Si no hay payload de Google en la solicitud, devuelve un error 401
      res.status(401).json({ message: "Token de Google inválido" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error creating user." });
  }
};

module.exports = createGoogleUserHandler;
