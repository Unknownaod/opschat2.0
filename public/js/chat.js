// =======================
// CHAT.JS - Messages + Emoji/Sticker Support
// =======================

document.addEventListener('DOMContentLoaded', () => {
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');
  const messages = document.getElementById('messages');
  const logoutBtn = document.getElementById('logoutBtn');

  // Check if user is logged in
  const user = localStorage.getItem('chatsphere_user');
  if (!user) {
    window.location.href = 'login.html';
  }

  // Send message
  messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const msg = messageInput.value.trim();
    if (!msg) return;

    // Create message element
    const p = document.createElement('p');
    // Detect sticker placeholder
    if (msg.startsWith('[sticker:') && msg.endsWith(']')) {
      const src = msg.slice(9, -1);
      const img = document.createElement('img');
      img.src = src;
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.borderRadius = '12px';
      p.appendChild(img);
    } else {
      p.textContent = msg;
    }

    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;
    messageInput.value = '';

    // Placeholder: you can emit this message via Socket.IO to backend later
  });

  // Logout button
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('chatsphere_user');
    window.location.href = 'login.html';
  });
});
