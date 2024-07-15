// const mongoose = require("mongoose");

// const { MONGO_URI } = process.env;
// mongodb: mongoose.connect(MONGO_URI); // establece conexion cn el mi propio pc y en el puerto 27017
// const db = mongoose.connection; // guarda la conexion en la const db para exportarla

// db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
// db.once("open", () => {
//   console.log("Conexión exitosa a MongoDB");
// });
// // .on y .once son manejadores de evento, funcionan diferente al .then de siempre

// module.exports = db;

/* ////// VERSION PARA DEPLOY ////// */

const mongoose = require("mongoose");

const { MONGO_URI } = process.env; //

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI); // establece conexion con la URI de MongoDB
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error.message);
    throw error;
  }
};

module.exports = connectDB;
