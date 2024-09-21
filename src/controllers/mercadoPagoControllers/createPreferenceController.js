const { MercadoPagoConfig, Preference } = require("mercadopago");
const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;

const createPreferenceController = async (cartWithSing, pending) => {
  var items = [];

  cartWithSing.forEach((item) => {
    let id = `${item.id}+${item.worker[0]}`;
    items.push({
      title: item.service.name,
      quantity: Number(item.quantity),
      unit_price: Number(item.service.sing),
      currency_id: "ARS",
      id,
    });
  });

  const client = new MercadoPagoConfig({
    accessToken: MERCADO_PAGO_ACCESS_TOKEN,
  });

  const now = new Date();
  // Establece la fecha y hora de expiración (2 minutos en el futuro)
  const expirationDate = new Date(now.getTime() + 5 * 60000).toISOString();

  try {
    const body = {
      items,
      back_urls: {
        success: `${FRONTEND_URL}/`,
        failure: `${FRONTEND_URL}/`,
        pending:
          "https://www.youtube.com/watch?v=waiu1gimdy8&list=RDwaiu1gimdy8&start_radio=1",
      },
      auto_return: "approved",
      expiration_date_from: now.toISOString(),
      expiration_date_to: expirationDate,
      expires: true,
      metadata: {
        pending,
      },
      notification_url: `${BACKEND_URL}/mercadopago/mp_notifications`,
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    return {
      init_point: result.init_point,
      preference_id: result.id,
    };
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    throw error;
  }
};

module.exports = createPreferenceController;
