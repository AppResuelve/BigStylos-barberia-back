const WorkDay = require("../../DB/models/WorkDay");
const corroborate = require("../../helpers/corroborateDisponibility");

const toFreeTurnsController = async (arrayItems) => {
  const uno = arrayItems[0];
  const dos = arrayItems[1];
  const tres = arrayItems[2];

  var newUno = null;
  var newDos = null;
  var newTres = null;

  try {
    const processItem = async (item) => {
      let updatedDocuments = [];

      for (let doc of item) {
        const { ini, end, _id, user } = doc;
        const workday = await WorkDay.findById(_id);

        let shouldUpdate = true;

        for (let i = ini; i <= end; i++) {
          if (workday.time[i].applicant !== `pending-${user}`) {
            shouldUpdate = false;
            break;
          }
        }

        if (shouldUpdate) {
          for (let i = ini; i <= end; i++) {
            workday.time[i].applicant = "free";
            workday.time[i].ini = null;
            workday.time[i].end = null;
            workday.time[i].requiredService = null;
          }

          // Actualizar la disponibilidad de los servicios
          let servicesKeys = Object.keys(workday.services);
          servicesKeys.forEach((serviceKey) => {
            let service = workday.services[serviceKey];
            service.available = corroborate(workday.time, service.duration);
          });

          // Verificar si todos los índices con applicant distinto de null son "free"
          let allFree = workday.time.every(
            (slot) => slot.applicant === "free" || slot.applicant === null
          );

          if (allFree) {
            workday.turn = false;
          }

          updatedDocuments.push({
            _id: doc._id,
            updatedTime: workday.time,
            updatedServices: workday.services,
            turn: workday.turn,
          });
        }
      }

      return updatedDocuments;
    };

    if (uno) {
      newUno = await processItem(uno);
    }

    if (dos) {
      newDos = await processItem(dos);
    }

    if (tres) {
      newTres = await processItem(tres);
    }

    let bulkOperations = [];

    const prepareBulkOperations = (item) => {
      item.forEach((doc) => {
        bulkOperations.push({
          updateOne: {
            filter: { _id: doc._id },
            update: {
              $set: {
                time: doc.updatedTime,
                services: doc.updatedServices,
                turn: doc.turn,
              },
            },
          },
        });
      });
    };

    if (newUno) prepareBulkOperations(newUno);
    if (newDos) prepareBulkOperations(newDos);
    if (newTres) prepareBulkOperations(newTres);

    if (bulkOperations.length > 0) {
      await WorkDay.bulkWrite(bulkOperations);
    }
  } catch (error) {
    console.error("Error al resetear turno (controller):", error);
    throw error;
  }
};

module.exports = toFreeTurnsController;
