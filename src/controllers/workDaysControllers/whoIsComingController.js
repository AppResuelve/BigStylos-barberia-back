const WorkDay = require("../../DB/models/WorkDay");
const User = require("../../DB/models/User");

const whoIsComingController = async (emailWorker, month, day) => {
  try {
    const workdays = await WorkDay.findOne({ email: emailWorker, month, day });
    if (!workdays) {
      const error = new Error("No se encontraron días creados");
      error.statusCode = 400;
      throw error;
    }
    var objTurns = [];
    var arrayEmails = [];
    var result = [];

    var bandera = "";
    var ini = 0;

    for (let i = 0; i < workdays.time.length; i++) {
      if (workdays.time[i].applicant != bandera && ini > 0) {
        objTurns.push({ email: bandera, ini, fin: i - 1 });
        bandera = "";
        ini = 0;
      }
      if (
        workdays.time[i].applicant != null &&
        workdays.time[i].applicant != "free" &&
        bandera == "" &&
        ini == 0
      ) {
        bandera = workdays.time[i].applicant;
        ini = i;
      }
    }

    objTurns.forEach((element) => {
      arrayEmails.push(element.email);
    });

    const users = await User.find({ email: { $in: arrayEmails } });
    if (users.length < 1) {
      objTurns.forEach((element) => {
        result.push({
          name: element.email,
          ini: element.ini,
          fin: element.fin,
        });
      });
    }
    objTurns.forEach((element) => {
      users.forEach((user) => {
        if (element.email == user.email) {
          result.push({
            email: element.email,
            name: user.name,
            ini: element.ini,
            fin: element.fin,
            phone: user.phone,
            image: user.image,
          });
        } else {
          result.push({
            name: element.email,
            ini: element.ini,
            fin: element.fin,
          });
        }
      });
    });

    return result;
  } catch (error) {
    console.error("Error al obtener días laborales:", error);
    throw error;
  }
};

module.exports = whoIsComingController;
