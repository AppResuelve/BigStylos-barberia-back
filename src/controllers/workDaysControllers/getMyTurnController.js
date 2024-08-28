const WorkDay = require("../../DB/models/WorkDay");

const getMyTurnsController = async (emailUser) => {
  try {
    let turnResult = [];

    const days = await WorkDay.find({
      time: { $elemMatch: { applicant: emailUser } },
    });

    days.forEach((day) => {
      for (let i = 0; i < day.time.length; i++) {
        let element = day.time[i];        
        if (element.applicant === emailUser) {
          turnResult.push({
            ini: element.ini,
            end: element.end,
            worker: { name: day.name, email: day.email },
            day: day.day,
            month: day.month,
            service: element.requiredService,
          });
          i = element.end; // verificar si hace falta el + 1 
        }
      }
    });

    return turnResult;
  } catch (error) {
    console.error("Error al obtener turnos:", error);
    throw error;
  }
};

module.exports = getMyTurnsController;