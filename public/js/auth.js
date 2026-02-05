// =======================
// AUTH.JS - Secure Login & Register
// =======================

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  const BACKEND_URL = 'https://opschat-backend.onrender.com';

  function saveSession(token, username) {
    localStorage.setItem('chatsphere_token', token);
    localStorage.setItem('chatsphere_user', username);
  }

  // LOGIN
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!username || !password) {
        alert('Please fill all fields.');
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok || !data.token) {
          return alert(data.error || 'Login failed.');
        }

        saveSession(data.token, data.username);
        window.location.href = 'chat.html';

      } catch (err) {
        console.error(err);
        alert('Failed to connect to server.');
      }
    });
  }

  // REGISTER
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!username || !email || !password) {
        alert('Please fill all fields.');
        return;
      }

      try {
        const res = await fetch(`${BACKEND_URL}/api/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok || !data.token) {
          return alert(data.error || 'Registration failed.');
        }

        saveSession(data.token, data.username);
        window.location.href = 'chat.html';

      } catch (err) {
        console.error(err);
        alert('Failed to connect to server.');
      }
    });
  }
});
