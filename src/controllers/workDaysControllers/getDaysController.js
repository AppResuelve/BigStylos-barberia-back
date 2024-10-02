const WorkDay = require("../../DB/models/WorkDay");

const getDaysController = async () => {
  try {
    const days = await WorkDay.find({});

    const result = {};

    days.forEach((element) => {
      const { month, day, turn, time } = element;

      if (!result[month]) {
        result[month] = {};
      }

      if (!result[month][day]) {
        // Si es la primera vez que vemos este day, inicializamos el valor
        result[month][day] = {
          turn: false, // Valor inicial como false, hasta que encontremos un true
          time: []
        };
      }

      // Si ya encontramos un turn en true, no lo sobrescribimos con false
      result[month][day].turn = result[month][day].turn || turn;

      // Agregamos los valores de time (en este caso puedes decidir si lo quieres sobrescribir o combinar los arrays)
      result[month][day].time = time;
    });

    return result;
  } catch (error) {
    console.error("Error al obtener días laborales:", error);
    throw error;
  }
};

module.exports = getDaysController;
