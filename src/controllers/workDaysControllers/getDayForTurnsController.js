const WorkDay = require("../../DB/models/WorkDay");

const getDayForTurnsController = async (dayForTurns, worker, service) => {
  try {
    const day = dayForTurns[0];
    const month = dayForTurns[1];

    if (worker === "cualquiera") {
      const days = await WorkDay.find({
        month,
        day,
        'services.name': service.name
      });

      const buttonsArrayPerDay = days.map(day => {
        let duration = day.services[service].duration

      let ini = null
      let flag = 0

      let buttonsArray = []

      for (let i = 0; i < day.time.length; i ++) {
        if (day.time[i].applicant != "free") {
          ini = null
          flag = 0
        }
        if (day.time[i].applicant === "free" && flag === 0 ) {

          ini = i
          flag = 1
      }
        if (flag == duration) {

          buttonsArray.push({
            ini,
            end: i,
            worker: day.email
          })
          flag = 0
        }
        if (day.time[i].applicant === "free" && flag > 0) {
          flag ++
        }
      }

      // me falta aplicarle random para no devolver todos los botones sino solo los que no se repitan de cada usuario
      return buttonsArray;
    
      })
  
      const unifiedButtonsArray = buttonsArrayPerDay.flat();
      return unifiedButtonsArray;
    } else {
      const days = await WorkDay.findOne({
        month,
        day,
        'services.name': service.name,
        email: worker
      });

      let duration = days.services[service].duration

      let ini = null
      let flag = 0

      let buttonsArray = []

      for (let i = 0; i < days.time.length; i ++) {
        if (days.time[i].applicant != "free") {
          ini = null
          flag = 0
        }
        if (days.time[i].applicant === "free" && flag === 0 ) {
          console.log('entre al primer if')
          ini = i
          flag = 1
      }
        if (flag == duration) {
          console.log('entre al cierre')
          buttonsArray.push({
            ini,
            end: i,
            worker: days.email
          })
          flag = 0
        }
        if (days.time[i].applicant === "free" && flag > 0) {
          flag ++
        }
      }
      console.log(buttonsArray, "buttonsArray")
      return buttonsArray;
    }
    
  } catch (error) {
    console.error("Error al obtener el día:", error);
    throw error;
  }
};

module.exports = getDayForTurnsController;
