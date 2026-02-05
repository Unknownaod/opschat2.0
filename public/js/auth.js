// =======================
// AUTH.JS - Login & Register with Backend
// =======================

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  const BACKEND_URL = 'https://opschat-backend.onrender.com';

  // LOGIN FORM
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

        if (data.success) {
          localStorage.setItem('chatsphere_user', username);
          window.location.href = 'chat.html';
        } else {
          alert(data.error || 'Login failed.');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to connect to server.');
      }
    });
  }

  // REGISTER FORM
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

        if (data.success) {
          localStorage.setItem('chatsphere_user', username);
          alert('Registered successfully!');
          window.location.href = 'chat.html';
        } else {
          alert(data.error || 'Registration failed.');
        }
      } catch (err) {
        console.error(err);
        alert('Failed to connect to server.');
      }
    });
  }
});
