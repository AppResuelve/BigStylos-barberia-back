const WorkDay = require("../../DB/models/WorkDay");
const corroborate = require("../../helpers/corroborateDisponibility");

const createTurnController = async (
  date,
  emailWorker,
  selectedTime,
  serviceSelected,
  user
) => {
  console.log(date, emailWorker, selectedTime, serviceSelected, user);
  try {
    var asignTurn = await WorkDay.findOne({
      month: date[1],
      day: date[0],
      email: emailWorker,
    });

    if (!asignTurn) {
      throw new Error("La fecha seleccionada no tiene turnos disponibles");
    }

    let contador = 0;
    let ini = 0;
    const duration = asignTurn.services[serviceSelected].duration;

    for (let i = 0; i < asignTurn.time.length; i++) {
      if (contador > 0 && contador < duration) {
        asignTurn.time[i].applicant = user;
        asignTurn.time[i].requiredService = serviceSelected;
        asignTurn.time[i].ini = ini;
        asignTurn.time[i].end = ini + (duration - 1);
        contador++;
      }

      if (asignTurn.time[i].applicant === "free" && i === selectedTime) {
        asignTurn.time[i].applicant = user;
        asignTurn.time[i].requiredService = serviceSelected;
        asignTurn.time[i].ini = i;
        asignTurn.time[i].end = i + (duration - 1);
        ini = i;
        contador++;
      }
    }

    const serv = Object.keys(asignTurn.services);
    serv.forEach((element) => {
      if (corroborate(asignTurn.time, asignTurn.services[element].duration)) {
        asignTurn.services[element].available = true;
      } else {
        asignTurn.services[element].available = false;
      }
    });

    asignTurn.turn = true;

    // Marcar los cambios en los subdocumentos como modificados
    asignTurn.markModified("time");
    asignTurn.markModified("services");

    await asignTurn.save();
    return asignTurn;
  } catch (error) {
    console.error("Error al reservar turno (controller):", error);
    throw error;
  }
};

module.exports = createTurnController;
