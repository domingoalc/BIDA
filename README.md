# 📚 Bookify Lite

Bookify Lite es una aplicación web inspirada en Spotify, pero orientada a la gestión de libros digitales. Permite a los usuarios explorar una biblioteca online, marcar favoritos, leer libros en PDF y a los administradores agregar libros al sistema.

## 🚀 Funcionalidades

- Registro e inicio de sesión con JWT
- Visualización de todos los libros disponibles
- Filtro por título o género
- Marcado de libros como favoritos
- Lector en línea con visor PDF
- Administración de libros (agregar desde frontend)
- Diseño responsive para móviles, tablets y escritorio

## 📦 Tecnologías

### Frontend:
- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript (Vanilla)

### Backend:
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- Bcryptjs para contraseñas
- Multer para subir portadas y archivos PDF

## 🧠 Estructura del Proyecto
bookify-lite/
├── backend/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── uploads/
│ └── app.js
├── frontend/
│ ├── css/
│ ├── js/
│ ├── *.html (vistas)
├── .env
└── README.md
