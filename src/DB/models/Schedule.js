const { Schema, model } = require("mongoose");

const CreateSchedule = new Schema(
  {
    businessSchedule: {
      type: Object,
      required: false,
    },
    noWorkDays: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
);

const Schedule = model("Schedule", CreateSchedule);

module.exports = Schedule;
