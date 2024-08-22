

const deleteOld = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    //const result = await WorkDay.deleteMany({ date: { $lt: today } });
    console.log(`esta es la ejecucion del cron---------------------------------`);
  } catch (error) {
    console.error('Error deleting old days:', error);
  }
};

module.exports = deleteOld;
