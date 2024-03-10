// require("dotenv").config();
// const server = require("./src/app.js");
// require("./src/DB/db.js");

// const PORT = process.env.PORT;

// server.listen(PORT, () => {
//   console.log(`Server listening on port: ${PORT}`);
// });

require("dotenv").config();
const server = require("./src/app.js");
const connectDB = require("./src/DB/db.js"); // Importa la función para conectar con la base de datos

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    // Llama a la función para conectar con la base de datos
    server.listen(PORT, () => {
      console.log(`Server listening on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });