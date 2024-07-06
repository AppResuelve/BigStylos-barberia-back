const { OAuth2Client } = require("google-auth-library");
const oAuth2Client = new OAuth2Client(
  "75961716499-7v8lchvq0ahu3ukknidea4lb428l730v.apps.googleusercontent.com",
  "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",
  "postmessage"
);

const verifyGoogleUser = async (req, res, next) => {
  try {
    const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens

    //  res.json(tokens);
    // const authHeader = req.headers.authorization;
    // if (!authHeader) next();
    // const token = authHeader.split(" ")[1];

    const ticket = await oAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience:
        "75961716499-7v8lchvq0ahu3ukknidea4lb428l730v.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
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
