const WorkDay = require("../../DB/models/WorkDay");
const corroborate = require("../../helpers/corroborateDisponibility");

const createTurnController = async (arrayItems) => {

  const uno = arrayItems[0];
  const dos = arrayItems[1];
  const tres = arrayItems[2];

  var newUno = null;
  var newDos = null;
  var newTres = null;

  var errors = [];

  try {
    const processItem = async (item) => {
      const { ini, day, month, user, service, worker } = item;
      var documents = [];
      for (let i = 0; i < item.worker.length; i++) {
        let document = await WorkDay.aggregate([
          {
            $match: {
              email: worker[i].email,
              day: day,
              month: month,
            },
          },
          {
            $project: {
              email: 1,
              day: 1,
              month: 1,
              time: 1,
              services: 1,
              name: 1,
              turn: 1,
              free: {
                $reduce: {
                  input: { $slice: ["$time", ini, worker[i].end - ini + 1] },
                  initialValue: true,
                  in: {
                    $and: ["$$value", { $eq: ["$$this.applicant", "free"] }],
                  },
                },
              },
            },
          },
          {
            $match: {
              free: true,
            },
          },
        ]).exec();

        if (document.length > 0) {
          documents.push(document[0]);
        }
      }
      if (item.quantity > documents.length) {
        errors.push(item); // Guardar el error para el front
      } else {
        let selectedDocuments;

        if (item.quantity < documents.length) {
          selectedDocuments = [];
          let tempDocs = [...documents];
          while (selectedDocuments.length < item.quantity) {
            const randomIndex = Math.floor(Math.random() * tempDocs.length);
            selectedDocuments.push(tempDocs.splice(randomIndex, 1)[0]);
          }
        } else {
          selectedDocuments = documents;
        }

        let updatedDocuments = selectedDocuments.map((doc) => {
          let updatedTime = [...doc.time];
          let end = worker.map((wrk) => {
            if (wrk.email === doc.email) {
              return wrk.end;
            }
          });

          for (let i = ini; i <= end[0]; i++) {

            updatedTime[i].applicant = user;
            updatedTime[i].ini = ini;
            updatedTime[i].end = end[0];
            updatedTime[i].requiredService = service;
          }

          // Actualizar la disponibilidad de los servicios
          let servicesKeys = Object.keys(doc.services);
          servicesKeys.forEach((serviceKey) => {
            let service = doc.services[serviceKey];
            service.available = corroborate(updatedTime, service.duration);
          });

          // Marcar turn como true si se agenda el turno
          let turn = true;

          return {
            _id: doc._id,
            updatedTime,
            updatedServices: doc.services,
            turn, // Incluye la propiedad turn
          };
        });

        return updatedDocuments;
      }
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

    if (errors.length > 0) {
      let errorsResult = { errors: errors };
      return errorsResult;
    } else {
      let bulkOperations = [];

      const prepareBulkOperations = (documents) => {
        documents.forEach((doc) => {
          bulkOperations.push({
            updateOne: {
              filter: { _id: doc._id },
              update: {
                $set: {
                  time: doc.updatedTime,
                  services: doc.updatedServices,
                  turn: doc.turn, // Actualiza la propiedad turn
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
      let success = { success: arrayItems };
      return success;
    }
  } catch (error) {
    console.error("Error al reservar turno (controller):", error);
    throw error;
  }
};

module.exports = createTurnController;
