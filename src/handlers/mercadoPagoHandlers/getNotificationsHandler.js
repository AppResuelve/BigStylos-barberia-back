const { MercadoPagoConfig, Payment } = require("mercadopago");
const pendingToConfirmController = require("../../controllers/workDaysControllers/pendingToConfirmController");
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
       console.log(response, 'response mercado pago===================')
       if(response) {
        console.log(response.metadata.pending, '--------------response.metadata')
        let result = pendingToConfirmController(response.metadata.pending)
       }
       
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

module.exports = getNotificationsHandler;
