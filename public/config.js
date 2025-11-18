// API Configuration - Auto detects localhost vs production
const API_BASE_URL = (function() {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  return 'https://bharat-freelance-api.onrender.com';
})();