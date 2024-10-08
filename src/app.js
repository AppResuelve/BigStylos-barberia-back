const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes/index.js");

const server = express();

server.name = "API";
server.use(express.json());
server.use(morgan("dev"));

// Configuración de CORS
 const corsOptions = {
   origin: "https://tengoturno.up.railway.app", // Reemplaza con tu dominio
   methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
   credentials: true, // Si necesitas enviar cookies, tokens, etc.
 };

server.use(cors());

server.use("/", routes);

module.exports = server;
