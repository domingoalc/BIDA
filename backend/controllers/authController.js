const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

exports.register = async (req, res) => {
  try {
    const { nombre, mail, password } = req.body;

    if (!nombre || !mail || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if (!validateEmail(mail)) {
      return res.status(400).json({ error: "Correo inválido" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({ error: "Este correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ nombre, mail, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor al registrar" });
  }
};

exports.login = async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!mail || !password) {
      return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    const user = await User.findOne({ mail });
    if (!user) return res.status(400).json({ error: "Credenciales incorrectas" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Credenciales incorrectas" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        mail: user.mail,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor al iniciar sesión" });
  }
};