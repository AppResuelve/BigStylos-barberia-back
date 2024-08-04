//import { MercadoPagoConfig, Preference } from "mercadopago";
const { MercadoPagoConfig, Preference } = require("mercadopago");
const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
const FRONTEND_URL = process.env.FRONTEND_URL;

const createPreferenceController = async (arrayItems) => {
  var items = [];
  arrayItems.forEach((item) => {
    let id = `${item.id}+${item.worker[0]}`;
    console.log(id);
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
      notification_url:
        "https://ac44-181-93-134-26.ngrok-free.app/mercadopago/mp_notifications",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });
    console.log(result.id, "este es el id de la preferencia");
    return result.id;
  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    throw error;
  }
};

module.exports = createPreferenceController;
