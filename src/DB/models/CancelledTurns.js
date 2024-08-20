const { Schema, model } = require("mongoose");

const CancelledTurnsSchema = new Schema(
  {
    month: {
        type: Number,
        required: true,
      },
    day: {
        type: Number,
        required: true,
      },
      emailWorker: {
        type: String,
        required: true,
      },
      nameWorker: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      turn: {
        type: Object,
        required: true,
      },
      emailUser: {
        type: String,
        required: true,
      },
      nameUser: {
        type: String,
        required: false,
      },
      howCancelled: {
        type: String,
        required: true
      },
      service: {
        type: Object,
        required: true
      },
    },
    {
    timestamps: true,
  }
);

const CancelledTurns = model("CancelledTurns", CancelledTurnsSchema);

module.exports = CancelledTurns;
