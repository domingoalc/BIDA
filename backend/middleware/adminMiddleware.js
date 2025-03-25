module.exports = (req, res, next) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Acceso restringido. Se requiere rol de administrador." });
    }
    next();
  };  