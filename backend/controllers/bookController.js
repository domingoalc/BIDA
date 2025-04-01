const Book = require("../models/Book");

exports.getBooks = async (req, res) => {
  try {
    const { titulo, autor, genero } = req.query;
    let query = {};

    if (titulo) query.titulo = { $regex: titulo, $options: "i" };
    if (autor) query.autor = { $regex: autor, $options: "i" };
    if (genero) query.genero = genero;

    const books = await Book.find(query);
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener libros" });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Libro no encontrado" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el libro" });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { titulo, autor, anio, genero, descripcion, portada, pdf } = req.body;

    if (!titulo || !autor || !portada || !pdf) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const newBook = new Book({ titulo, autor, anio, genero, descripcion, portada, pdf });
    await newBook.save();

    res.status(201).json({ message: "Libro creado correctamente", book: newBook });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el libro" });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { titulo, autor, anio, genero, descripcion, portada, pdf } = req.body;
    const updatedFields = { titulo, autor, anio, genero, descripcion, portada, pdf };

    const updated = await Book.findByIdAndUpdate(req.params.id, updatedFields, { new: true });
    res.json({ message: "Libro actualizado", book: updated });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el libro" });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Libro eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el libro" });
  }
};