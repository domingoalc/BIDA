const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  currentPage: { type: Number, default: 0, min: 0 },
  totalPages: { type: Number },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

progressSchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);