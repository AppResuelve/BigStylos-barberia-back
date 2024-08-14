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
      let updatedDocuments = item.map(async (doc) => {
        const { ini, end, service, updatedServices, _id, user } = doc;
        const workday = await WorkDay.find({ _id });

        for (let i = ini; i <= end; i++) {
          if (workday[0].time[i].applicant === `pending-${user}`) {
            workday[0].time[i].applicant = "free";
            workday[0].time[i].ini = null;
            workday[0].time[i].end = null;
            workday[0].time[i].requiredService = null;
          }
        }

        // Actualizar la disponibilidad de los servicios
        // let servicesKeys = Object.keys(updatedServices);
        // servicesKeys.forEach((serviceKey) => {
        //   let service = workday[0].services[serviceKey];
        //   service.available = corroborate(workday[0].time, service.duration);
        // });
        /* 
   ANTES DE RETORNAR CADA DOCUMENTO HAY QUE HACER UN CORROBORATE INVERSO ÓÓÓÓ LO QUE SE PUEDE HACER ES
   NOOOO HACER EL CORROBORATE CUANDO SE PONE EN PENDIENTE, LUEGO SE EJECUTA SI SALE BIEN MERCADO PAGO
*/

        return {
          _id: doc._id,
          updatedTime: workday[0].time,
          updatedServices /* : doc.services */,
        };
      });

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
