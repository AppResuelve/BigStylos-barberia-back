const updateCategoryController = require("../../controllers/servicesContollers/updateCategoryController");

const updateCategoryHandler = async (req, res) => {
  const { prev, current } = req.body;
  try {
    const updatedCategory = await updateCategoryController( prev, current );
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error en handler al editar categoria." });
  }
};

module.exports = updateCategoryHandler;
