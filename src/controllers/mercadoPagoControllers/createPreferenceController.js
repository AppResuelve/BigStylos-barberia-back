//import { MercadoPagoConfig, Preference } from "mercadopago";
const { MercadoPagoConfig, Preference } = require ("mercadopago");

const createPreferenceController = async ( arrayItems ) => {

    var items = []

    arrayItems.forEach(item => {
        items.push({
            title: item.service,
            quantity: Number(item.quantity),
            unit_price: Number(price),
            currency_id: "ARS",
        })
    })
    
    const client = new MercadoPagoConfig({
        accessToken: "",
    })
  
  try {
    const body = {
        items,
        back_urls: {
            success: "https://www.youtube.com/watch?v=tkOr12AQpnU",
            failure: "https://www.youtube.com/watch?v=qN4ooNx77u0",
            pending: "https://www.youtube.com/watch?v=waiu1gimdy8&list=RDwaiu1gimdy8&start_radio=1"
        },
        auto_return: "approved",
    }

    const preference = new Preference(client)
    const result = await preference.create({ body })
    
    return result.id

  } catch (error) {
    console.error("Error al crear la preferencia:", error);
    throw error;
  }
};

module.exports = createPreferenceController;