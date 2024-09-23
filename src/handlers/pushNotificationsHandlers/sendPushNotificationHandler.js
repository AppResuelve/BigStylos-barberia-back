const User = require("../../DB/models/User");
const admin = require("firebase-admin");
// Inicialización de Firebase Admin SDK con las credenciales del servicio
const serviceAccount = require("../../tengoturno-prueba-noti-firebase-adminsdk-4a2wa-9c9f18d22b.json");
const FRONTEND_URL = process.env.FRONTEND_URL;

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
