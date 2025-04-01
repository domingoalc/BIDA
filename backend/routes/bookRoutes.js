const express = require("express");
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} = require("../controllers/bookController");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Rutas públicas
router.get("/", getBooks);
router.get("/:id", getBookById);

// Rutas protegidas (solo admin)
router.post("/", auth, admin, createBook);
router.put("/:id", auth, admin, updateBook);
router.delete("/:id", auth, admin, deleteBook);

module.exports = router;
