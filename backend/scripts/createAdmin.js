const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("🛠 Conectado a MongoDB para crear admin...");
    createAdmin();
  })
  .catch(err => console.error("❌ Error de conexión:", err));

async function createAdmin() {
  try {
    const existingAdmin = await User.findOne({ mail: "admin@bookify.com" });
    if (existingAdmin) {
      console.log("✅ Admin ya existe.");
      return mongoose.disconnect();
    }

    const hashedPassword = await bcrypt.hash("Admin1234", 10);
    const admin = new User({
      nombre: "Administrador",
      mail: "admin@bookify.com",
      password: hashedPassword,
      role: "admin"
    });

    await admin.save();
    console.log("✅ Usuario admin creado con éxito.");
  } catch (err) {
    console.error("❌ Error creando admin:", err);
  } finally {
    mongoose.disconnect();
  }
}