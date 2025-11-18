// 🟢 Auto detect Localhost OR Production backend
const API_BASE_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:5000"
  : "https://bharat-freelance-api.onrender.com";
