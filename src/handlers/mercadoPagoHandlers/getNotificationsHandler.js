const { MercadoPagoConfig } = require("mercadopago");
const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

const client = new MercadoPagoConfig({
  accessToken: MERCADO_PAGO_ACCESS_TOKEN,
});

const getNotificationsHandler = async (req, res) => {
  const { paymentId } = req.query;

  try {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Barear ${client.accesToken}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    }
    res.status(200).json(preference);
  } catch (error) {
    res.status(500).json({ message: "Error creating user." });
  }
};

module.exports = getNotificationsHandler;
