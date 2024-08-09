//import { MercadoPagoConfig, Preference } from "mercadopago";
const { MercadoPagoConfig, Preference } = require("mercadopago");
const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const FRONTEND_URL = process.env.FRONTEND_URL;
const axios = require("axios");

const createPreferenceController = async (arrayItems) => {
  var items = [];
  arrayItems.forEach((item) => {
    let id = `${item.id}+${item.worker[0]}`;
    items.push({
      title: item.service.name,
      quantity: Number(item.quantity),
      unit_price: Number(item.service.price),
      currency_id: "ARS",
      id,
    });
  });

  const client = new MercadoPagoConfig({
    accessToken: MERCADO_PAGO_ACCESS_TOKEN,
  });

  const now = new Date();
  // Establece la fecha y hora de expiración (2 minutos en el futuro)
  const expirationDate = new Date(now.getTime() + 2 * 60000).toISOString();

  try {
    const body = {
      items,
      back_urls: {
        success: `${FRONTEND_URL}/`,
        failure: `${FRONTEND_URL}/requestDenied401`,
        pending:
          "https://www.youtube.com/watch?v=waiu1gimdy8&list=RDwaiu1gimdy8&start_radio=1",
      },
      auto_return: "approved",
      expiration_date_from: now.toISOString(),
      expiration_date_to: expirationDate,
      expires: true,
      notification_url:
        "https://3531-181-93-134-26.ngrok-free.app/mercadopago/mp_notifications",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });
    setTimeout(() => {
    }, 10000);

    return result.sandbox_init_point;
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    throw error;
  }
};

module.exports = createPreferenceController;
