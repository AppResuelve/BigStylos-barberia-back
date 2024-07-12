const { OAuth2Client } = require("google-auth-library");
const GOOGLE_0AUTH_CLIENT_ID = process.env.GOOGLE_0AUTH_CLIENT_ID;
const GOOGLE_0AUTH_CLIENT_SECRET = process.env.GOOGLE_0AUTH_CLIENT_SECRET;

const oAuth2Client = new OAuth2Client(
  GOOGLE_0AUTH_CLIENT_ID,
  GOOGLE_0AUTH_CLIENT_SECRET,
  "postmessage"
);

const verifyGoogleUser = async (req, res, next) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_0AUTH_CLIENT_ID,
    });

    const payload = await ticket.getPayload();
    if (payload) {
      req.headers["x-google-payload"] = JSON.stringify(payload); // Agregar el payload a los headers
      next(); // Llamar a la siguiente función en la cadena de middleware
    } else {
      res.status(401).json({ message: "Token de Google inválido" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error en la verificación del token de Google" });
  }
};

module.exports = verifyGoogleUser;
