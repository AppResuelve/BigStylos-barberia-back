const cron = require('node-cron');
require("dotenv").config();
const server = require("./src/app.js");
const connectDB = require("./src/DB/db.js"); // Importa la función para conectar con la base de datos
const deleteOld = require('./src/helpers/deleteOld'); // Importa la función para eliminar días antiguos

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    // Llama a la función para conectar con la base de datos
    server.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`);
      
      // Configurar la tarea cron para que se ejecute a las 00:00 cada día
      cron.schedule('57 14 * * *', () => {
        console.log('Running cleanup job at 00:00');
        deleteOld();
      });
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });
