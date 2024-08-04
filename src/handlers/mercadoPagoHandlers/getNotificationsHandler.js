const { MercadoPagoConfig } = require("mercadopago");
const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

const client = new MercadoPagoConfig({
  accessToken: MERCADO_PAGO_ACCESS_TOKEN,
});

const getNotificationsHandler = async (req, res) => {
  console.log(req.query, "este es el req, queryy");
//   console.log(req.headers, "este es el req, headers");
  let paymentId;
  if (req.query.type && req.query.type === "payment") {
    paymentId = req.query["data.id"];
    //   console.log(paymentId);

    try {
      // console.log(paymentId);
      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${client.accessToken}`,
          },
        }
      );
      if (response) {
            const data = await response.json();
            
        console.log(data.additional_info.items, "este es el data");
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ message: "Error creating user." });
    }
  }
};

module.exports = getNotificationsHandler;
