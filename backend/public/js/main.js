// API base dinámico según entorno
const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : window.location.origin;

// Registro
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(registerForm));
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      alert("Registro exitoso");
      window.location.href = "login.html";
    } else {
      document.getElementById("registerError").textContent = result.error || "Error";
    }
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(loginForm));
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (res.ok) {
      localStorage.setItem("token", result.token);
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("loginError").textContent = result.error || "Error";
    }
  });
}

// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
}

// Cargar libros en dashboard
const bookList = document.getElementById("bookList");
const genreFilter = document.getElementById("genreFilter");
const searchInput = document.getElementById("searchInput");

if (bookList) {
  loadBooks();

  if (searchInput) {
    searchInput.addEventListener("input", loadBooks);
  }

  if (genreFilter) {
    genreFilter.addEventListener("change", loadBooks);
  }
}

async function loadBooks() {
  const query = new URLSearchParams();
  const search = searchInput?.value.trim();
  const genre = genreFilter?.value;

  if (search) query.append("titulo", search);
  if (genre) query.append("genero", genre);

  const res = await fetch(`${API_BASE}/api/books?${query.toString()}`);
  const books = await res.json();

  const favorites = await fetchFavorites(); // Obtener favoritos actuales
  const favoriteIds = favorites.map(book => book._id);

  const uniqueGenres = [...new Set(books.map(book => book.genero).filter(Boolean))];
  if (genreFilter) {
    genreFilter.innerHTML = '<option value="">Todos los géneros</option>' +
      uniqueGenres.map(g => `<option value="${g}">${g}</option>`).join('');
  }

  bookList.innerHTML = books.map(book => {
    const isFav = favoriteIds.includes(book._id);
    return `
      <div class="book-card">
        <img src="${book.portada}" alt="${book.titulo}" />
        <h3>${book.titulo}</h3>
        <p>${book.autor}</p>
        <a href="reader.html?pdf=${book.pdf}" target="_blank">📖 Leer</a>
        <button class="fav-btn ${isFav ? 'filled' : 'empty'}" onclick="toggleFavorite('${book._id}', this)"></button>
      </div>
    `;
  }).join('');
}

async function fetchFavorites() {
  const token = localStorage.getItem("token");
  if (!token) return [];

  const res = await fetch(`${API_BASE}/api/users/favorites`, {
    headers: {
      Authorization: token
    }
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data;
}

// Agregar a favoritos
async function toggleFavorite(bookId, btnElement) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Debes iniciar sesión.");
    return;
  }

  const url = `${API_BASE}/api/users/favorites`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ bookId })
    });

    const result = await res.json();

    if (res.ok) {
      btnElement.classList.toggle("filled");
      btnElement.classList.toggle("empty");
    } else {
      alert(result.error || "Error al actualizar favoritos");
    }
  } catch (error) {
    alert("Error de red");
  }
}

const adminBtn = document.getElementById("adminBtn");
if (adminBtn) {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role === "admin") {
      adminBtn.style.display = "inline-block";
    }
  }
}

const adminPanelBtn = document.getElementById("adminPanelBtn");
if (adminPanelBtn) {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role === "admin") {
      adminPanelBtn.style.display = "inline-block";
    }
  }
}