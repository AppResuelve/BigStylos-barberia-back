

const adminDeleteDayHandler = async (req, res) => {
  const { month, day } = req.body;

  try {
    res.status(200).json(deleteDay);
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar dia." });
  }
};

module.exports = adminDeleteDayHandler;