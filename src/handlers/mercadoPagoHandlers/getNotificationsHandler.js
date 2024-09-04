const { MercadoPagoConfig, Payment } = require("mercadopago");
const MERCADO_PAGO_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

const client = new MercadoPagoConfig({
  accessToken: MERCADO_PAGO_ACCESS_TOKEN,
});
const payment = new Payment(client);
const getNotificationsHandler = async (req, res) => {
  let paymentId;
  if (req.query.type && req.query.type === "payment") {
    paymentId = req.query["data.id"];
    payment
      .get({
        id: paymentId,
      })
      .then((response) => {
       
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

module.exports = getNotificationsHandler;
