const User = require('../../DB/models/User');

const getWorkersController = async () => {
  try {
    const users = await User.find({worker: true})
    const result = []
    users.forEach(element => {
        result.push({email: element.email, name: element.name, image: element.image})
    })
    return result;

  } catch (error) {
    console.error('Error al obtener los workers:', error);
    throw error;
  }
};

module.exports = getWorkersController;