const WorkDay = require("../../DB/models/WorkDay");

const toFreeTurnsController = async (arrayItems) => {
  console.log("entre en to freeeeeeeeeeeeeeeeeeeeeeee");
  //console.log(arrayItems, "<-------------arrayItems");

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
          
          updatedDocuments.push({
            _id: doc._id,
            updatedTime: workday.time,
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
      console.log("aparentemente cambie los pending")
    }
  } catch (error) {
    console.error("Error al resetear turno (controller):", error);
    throw error;
  }
};

module.exports = toFreeTurnsController;
