const User = require("../models/User");
const Book = require("../models/Book");
const Progress = require("../models/Progress");
const mongoose = require("mongoose");

// Obtener libros favoritos del usuario
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favoritos");
    res.json(user.favoritos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
};

// Alternar favorito (agregar o quitar)
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: "ID de libro inválido" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const isFavorite = user.favoritos.includes(bookId);

    if (isFavorite) {
      user.favoritos.pull(bookId);
      await user.save();
      return res.json({ message: "Libro eliminado de favoritos" });
    } else {
      user.favoritos.push(bookId);
      await user.save();
      return res.json({ message: "Libro agregado a favoritos" });
    }

  } catch (error) {
    res.status(500).json({ error: "Error al actualizar favoritos" });
  }
};

// Guardar progreso de lectura
exports.updateProgress = async (req, res) => {
  const { bookId } = req.params;
  const { currentPage, totalPages } = req.body;
  const userId = req.user.id;

  try {
    const updated = await Progress.findOneAndUpdate(
      { userId, bookId },
      { currentPage, totalPages, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar progreso" });
  }
};

// Obtener progreso de lectura
exports.getProgress = async (req, res) => {
  try {
    const data = await Progress.findOne({ userId: req.user.id, bookId: req.params.bookId });
    res.json(data || {});
  } catch (error) {
    res.status(500).json({ error: "Error al obtener progreso" });
  }
};