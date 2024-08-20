// Importar el modelo de mongoose
const Schedule = require("../../DB/models/Schedule");

// Controlador para actualizar noWorkDays
const updateNoWorkController = async (newNoWorkValues, daysToCancel) => {
  try {
console.log(daysToCancel);



    // Buscar el primer documento en la colección de Schedule
    let updatedNoWorkDays = await Schedule.findOneAndUpdate(
      {}, // Sin condiciones, actualizará el primer documento que encuentre
      { noWorkDays: newNoWorkValues },
      { new: true, upsert: true } // Configuraciones: new devuelve el documento actualizado, upsert crea un nuevo documento si no se encuentra ninguno
    );
   
    // Devolver el documento actualizado  
    
      return updatedNoWorkDays.noWorkDays;     
  } catch (error) {
    console.error("Error al actualizar los días en la base de datos:", error);
    throw new Error("Error al actualizar los días en la base de datos");
  }
};

module.exports = updateNoWorkController;
