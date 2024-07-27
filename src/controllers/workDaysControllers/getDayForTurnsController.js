const WorkDay = require("../../DB/models/WorkDay");

const getDayForTurnsController = async (dayForTurns, worker, service) => {
  try {
    const day = dayForTurns[0];
    const month = dayForTurns[1];

    if (worker === "cualquiera") {
      const days = await WorkDay.find({
        month,
        day,
        'services.name': service.name,
        'services.available': true
      });

      const buttonsArrayPerDay = days.map(day => {
        let duration = 2000;
        if (day.services[service]) {
          duration = day.services[service].duration;
        }

        let ini = null;
        let flag = 0;
        let buttonsArray = [];

        for (let i = 0; i < day.time.length; i++) {
          if (day.time[i].applicant != "free") {
            ini = null;
            flag = 0;
          }
          if (day.time[i].applicant === "free" && flag === 0) {
            ini = i;
            flag = 1;
          }
          if (flag == duration) {
            buttonsArray.push({
              ini,
              end: i,
              worker: day.email
            });
            flag = 0;
          }
          if (day.time[i].applicant === "free" && flag > 0) {
            flag++;
          }
        }
        return buttonsArray;
      });

      const unifiedButtonsArray = buttonsArrayPerDay.flat();

      // Filtrar duplicados de forma aleatoria
      const uniqueButtonsArray = unifiedButtonsArray.reduce((acc, current) => {
        if (!acc.some(item => item.ini === current.ini)) {
          acc.push(current);
        } else {
          const existingIndex = acc.findIndex(item => item.ini === current.ini);
          if (Math.random() < 0.5) {
            acc[existingIndex] = current;
          }
        }
        return acc;
      }, []);

      return uniqueButtonsArray;
    } else {
      const days = await WorkDay.findOne({
        month,
        day,
        'services.name': service.name,
        'services.available': true,
        email: worker
      });

      let duration = days.services[service].duration;
      let ini = null;
      let flag = 0;
      let buttonsArray = [];

      for (let i = 0; i < days.time.length; i++) {
        if (days.time[i].applicant != "free") {
          ini = null;
          flag = 0;
        }
        if (days.time[i].applicant === "free" && flag === 0) {
          ini = i;
          flag = 1;
        }
        if (flag == duration) {
          buttonsArray.push({
            ini,
            end: i,
            worker: days.email
          });
          flag = 0;
        }
        if (days.time[i].applicant === "free" && flag > 0) {
          flag++;
        }
      }

      // Filtrar duplicados de forma aleatoria
      const uniqueButtonsArray = buttonsArray.reduce((acc, current) => {
        if (!acc.some(item => item.ini === current.ini)) {
          acc.push(current);
        } else {
          const existingIndex = acc.findIndex(item => item.ini === current.ini);
          if (Math.random() < 0.5) {
            acc[existingIndex] = current;
          }
        }
        return acc;
      }, []);

      return uniqueButtonsArray;
    }

  } catch (error) {
    console.error("Error al obtener el día:", error);
    throw error;
  }
};

module.exports = getDayForTurnsController;
