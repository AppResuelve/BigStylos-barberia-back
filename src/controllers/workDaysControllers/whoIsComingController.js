const WorkDay = require("../../DB/models/WorkDay");
const User = require("../../DB/models/User");

const whoIsComingController = async (emailWorker, month, day) => {
  try {
    const workday = await WorkDay.findOne({ email: emailWorker, month, day });
    if (!workday) {
      const error = new Error(
        "No se encontró el día con los datos proporcionados"
      );
      error.statusCode = 400;
      throw error;
    }
    var arrayTurns = [];
    var arrayEmails = [];

    for (let i = 0; i < workday.time.length; i++) {
      let element = workday.time[i];

      if (element.applicant !== null && element.applicant !== "free") {
        arrayTurns.push({
          email: element.applicant,
          ini: element.ini,
          end: element.end,
          service: element.service,
        });
        i = element.end + 1;
      }
    }

    arrayTurns.forEach((element) => {
      arrayEmails.push(element.email);
    });

    const users = await User.find({ email: { $in: arrayEmails } });
    //ver como devuelve si un user esta en dos o mas posiciones del array de emails
    arrayTurns.forEach((turn) => {
      const user = users.find((user) => user.email === turn.email);
      if (user) {
        turn.name = user.name;
        turn.phone = user.phone;
        turn.image = user.image;
      }
    });
    /*  arrayTurns contiene:
    email: el email del cliente
    name: el name del cliente
    ini: el minuto de inicio de su turno
    end: minuto final de su turno
    phone: su cel
    image: su imagen
   */
    return arrayTurns;
  } catch (error) {
    console.error("Error al obtener días laborales:", error);
    throw error;
  }
};

module.exports = whoIsComingController;
