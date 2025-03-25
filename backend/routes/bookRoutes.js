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

const multer = require("multer");
const path = require("path");

// Configuración de almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = file.mimetype.includes("image") ? "uploads/covers" : "uploads/pdf";
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Rutas públicas
router.get("/", getBooks);
router.get("/:id", getBookById);

// Rutas protegidas (admin)
router.post("/", auth, admin, upload.fields([{ name: "portada" }, { name: "pdf" }]), createBook);
router.put("/:id", auth, admin, upload.fields([{ name: "portada" }, { name: "pdf" }]), updateBook);
router.delete("/:id", auth, admin, deleteBook);

module.exports = router;