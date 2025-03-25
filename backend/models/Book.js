const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  autor: { type: String, required: true },
  anio: { type: Number },
  genero: { type: String },
  descripcion: { type: String },
  portada: { type: String }, // Ruta al archivo de imagen
  pdf: { type: String }       // Ruta al archivo PDF
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);