const { Schema, model } = require("mongoose");

const servicesSchema = new Schema({
  services: {
    type: Object,
    required: true,
  },
});

const Services = model("Services", servicesSchema);

module.exports = Services;
