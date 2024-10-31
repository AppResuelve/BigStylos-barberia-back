require("dotenv").config();
const User = require("../../DB/models/User");
const admin = require("firebase-admin");
// Inicialización de Firebase Admin SDK con las credenciales del servicio
// const serviceAccount = require("../../tengoturno-prueba-noti-firebase-adminsdk-4a2wa-9c9f18d22b.json");
const FRONTEND_URL = process.env.FRONTEND_URL;

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Reemplaza \\n por saltos de línea
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com",
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Función para enviar una notificación
const sendPushNotificationHandler = async (req, res) => {
  const { addressee, messageData } = req.body;
  const user = await User.findOne({ email: addressee });

  if (user.notifications) {
    const message = {
      token: user.pushToken, // El token del dispositivo al que quieres enviar la notificación

      notification: {
        title: messageData.title, // Título de la notificación
        body: messageData.body, // Cuerpo o contenido de la notificación
      },

      // Otras opciones opcionales para mensajes, como datos adicionales:
      data: {
        url: `${FRONTEND_URL}/worker`,
      },

      // Configuraciones opcionales de FCM
      android: {
        priority: "high",
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
    };

    // Envía la notificación
    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Notificación enviada exitosamente:", response);
      })
      .catch((error) => {
        console.error("Error al enviar la notificación:", error);
      });
  }
};

module.exports = sendPushNotificationHandler;
