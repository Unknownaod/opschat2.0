// =======================
// AUTH.JS - Login & Register
// =======================

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  // LOGIN FORM
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!username || !password) {
        alert('Please fill all fields.');
        return;
      }

      // Placeholder: store in localStorage for now
      localStorage.setItem('chatsphere_user', username);
      window.location.href = 'chat.html';
    });
  }

  // REGISTER FORM
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!username || !email || !password) {
        alert('Please fill all fields.');
        return;
      }

      // Placeholder: store in localStorage for now
      localStorage.setItem('chatsphere_user', username);
      alert('Registered successfully!');
      window.location.href = 'chat.html';
    });
  }
});
