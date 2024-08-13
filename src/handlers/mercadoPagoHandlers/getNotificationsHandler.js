const axios = require("axios");
const { MercadoPagoConfig } = require("mercadopago");
const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

const client = new MercadoPagoConfig({
  accessToken: MERCADO_PAGO_ACCESS_TOKEN,
});

const getNotificationsHandler = async (req, res) => {
  console.log(req.query, "este es el req, queryy");
  let paymentId;
  // if (req.query.type && req.query.type === "payment") {
  //   paymentId = req.query.id;
  //   console.log(paymentId);

    try {
      const response = await axios.get(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {}
      );
      if (response) {
        const data = await response.json();

        console.log(data.additional_info.items, "este es el data");
      }

      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Error creating user." });
    }
  // }
};

module.exports = getNotificationsHandler;
