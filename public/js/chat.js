// =======================
// CHAT.JS - Messages + Emoji/Sticker Support + Backend
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
    return;
  }

  // =======================
  // Connect to backend Socket.IO
  // =======================
  const socket = io('https://opschat-backend.onrender.com');

  // Join default group for now (can be dynamic later)
  const groupName = 'General';
  socket.emit('joinGroup', { username: user, group: groupName });

  // Receive messages from backend
  socket.on('receiveMessage', (msgObj) => {
    appendMessage(msgObj.username, msgObj.message, msgObj.time);
  });

  // Receive system messages
  socket.on('systemMessage', (msg) => {
    const p = document.createElement('p');
    p.textContent = `[System] ${msg}`;
    p.style.fontStyle = 'italic';
    p.style.alignSelf = 'center';
    p.style.color = '#555';
    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;
  });

  // =======================
  // Send message
  // =======================
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = messageInput.value.trim();
    if (!msg) return;

    // Send to backend
    socket.emit('sendMessage', { group: groupName, message: msg });

    // Also display immediately
    appendMessage(user, msg, new Date().toISOString());
    messageInput.value = '';
  });

  // =======================
  // Helper: append message
  // =======================
  function appendMessage(sender, msg, timestamp) {
    const p = document.createElement('p');

    // Sticker detection
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

    // Style own messages
    if (sender === user) {
      p.style.alignSelf = 'flex-end';
      p.style.background = '#4facfe';
      p.style.color = '#fff';
    } else if (sender !== 'System') {
      p.style.alignSelf = 'flex-start';
      p.style.background = '#e0e0e0';
      p.style.color = '#000';
    }

    p.style.padding = '10px 15px';
    p.style.borderRadius = '20px';
    p.style.margin = '6px 0';
    p.style.maxWidth = '70%';
    p.style.wordBreak = 'break-word';
    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;
  }

  // =======================
  // Logout
  // =======================
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('chatsphere_user');
    window.location.href = 'login.html';
  });
});
