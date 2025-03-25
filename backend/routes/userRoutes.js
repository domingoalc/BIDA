const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { getFavorites, toggleFavorite, updateProgress, getProgress } = require("../controllers/userController");

// Rutas protegidas por autenticación
router.get("/favorites", auth, getFavorites);
router.post("/favorites", auth, toggleFavorite);
router.get("/progress/:bookId", auth, getProgress);
router.post("/progress/:bookId", auth, updateProgress);

module.exports = router;