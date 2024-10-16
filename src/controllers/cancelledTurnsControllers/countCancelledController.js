const CancelledTurns = require("../../DB/models/CancelledTurns");

const countCancelledController = async (emailWorker) => {

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const currentDay = currentDate.getDate()

    try {
        const turns = await CancelledTurns.find({ emailWorker });
        var month1 = [];
        var month2 = [];

        turns.forEach(element => {
            if (element.month === currentMonth && element.day >= currentDay) {
                month1.push({ day: element.day, month: element.month });
            }
            if (element.month === nextMonth) {
                month2.push({ day: element.day, month: element.month });
            }
        });

        month1.sort((a, b) => a.day - b.day);
        month2.sort((a, b) => a.day - b.day);
        var result1 = month1.map(element => `${element.day}/${element.month}`);
        var result2 = month2.map(element => `${element.day}/${element.month}`);

        var ultraResult = result1.concat(result2);

        var uniqueResult = Array.from(new Set(ultraResult));
        return uniqueResult;
    } catch (error) {
        console.error("Error al obtener días laborales:", error);
        throw error;
    }
};

module.exports = countCancelledController;
