const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    admin: {
      type: Boolean,
      required: true,
    },
    worker: {
      type: Boolean,
      required: true,
    },
    services: {
      type: Object,
      required: true,
      default: {},
    },
    isDelete: {
      type: Boolean,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
    minimize: false,
  }
);

UserSchema.methods.encryptPassword = async function (password) {
  const salt = await bcrypt.genSalt(5);
  return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function (password) {
  // utiliza .methods de mongoose para crear un metodo
  return await bcrypt.compare(password, this.password); //devuelve booleano
};

const User = model("User", UserSchema);

module.exports = User;
