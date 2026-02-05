// =======================
// CHAT.JS - Secure Messages + JWT + MongoDB Backend
// =======================

document.addEventListener('DOMContentLoaded', () => {
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');
  const messages = document.getElementById('messages');
  const logoutBtn = document.getElementById('logoutBtn');
  const chatList = document.getElementById('chatList');
  const newChatBtn = document.getElementById('newChatBtn');

  const BACKEND_URL = 'https://opschat-backend.onrender.com';

  // =======================
  // AUTH CHECK
  // =======================
  const token = localStorage.getItem('chatsphere_token');
  const user = localStorage.getItem('chatsphere_user');

  if (!token || !user) {
    window.location.href = 'login.html';
    return;
  }

  // =======================
  // Socket.IO (SECURE)
  // =======================
  const socket = io(BACKEND_URL, {
    auth: { token }
  });

  socket.on('connect_error', () => {
    localStorage.clear();
    window.location.href = 'login.html';
  });

  // =======================
  // Active chat tracking
  // =======================
  let activeChat = null;

  // =======================
  // Handle new private chat
  // =======================
  newChatBtn.addEventListener('click', async () => {
    const searchName = prompt("Enter username to start a chat:");
    if (!searchName) return;

    const res = await fetch(`${BACKEND_URL}/searchUser?username=${encodeURIComponent(searchName)}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (!data.found) {
      alert("User not found!");
      return;
    }

    const chatId = `private_${[user, data.username].sort().join('_')}`;

    if (activeChat) socket.emit('leaveRoom', { room: activeChat });
    socket.emit('joinRoom', { room: chatId });
    activeChat = chatId;

    if (![...chatList.children].some(li => li.dataset.user === data.username)) {
      const li = document.createElement('li');
      li.dataset.user = data.username;
      li.textContent = data.username;
      li.addEventListener('click', () => switchChat(data.username));
      chatList.appendChild(li);
    }

    messages.innerHTML = '';
  });

  // =======================
  // Switch chat
  // =======================
  function switchChat(targetUser) {
    const room = `private_${[user, targetUser].sort().join('_')}`;
    if (activeChat) socket.emit('leaveRoom', { room: activeChat });
    socket.emit('joinRoom', { room });
    activeChat = room;
    messages.innerHTML = '';
  }

  // =======================
  // Receive messages
  // =======================
  socket.on('receiveMessage', (msgObj) => {
    if (msgObj.room === activeChat) {
      appendMessage(msgObj.username, msgObj.message);
    }
  });

  socket.on('systemMessage', (msgObj) => {
    if (msgObj.room === activeChat) {
      const p = document.createElement('p');
      p.textContent = `[System] ${msgObj.message}`;
      p.style.fontStyle = 'italic';
      p.style.alignSelf = 'center';
      p.style.color = '#555';
      messages.appendChild(p);
      messages.scrollTop = messages.scrollHeight;
    }
  });

  // =======================
  // Send message
  // =======================
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = messageInput.value.trim();
    if (!msg || !activeChat) return;

    socket.emit('sendMessage', { room: activeChat, message: msg });
    messageInput.value = '';
  });

  // =======================
  // Append message helper
  // =======================
  function appendMessage(sender, msg) {
    const p = document.createElement('p');

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

    if (sender === user) {
      p.style.alignSelf = 'flex-end';
      p.style.background = '#4facfe';
      p.style.color = '#fff';
    } else {
      p.style.alignSelf = 'flex-start';
      p.style.background = '#333';
      p.style.color = '#fff';
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
    localStorage.clear();
    window.location.href = 'login.html';
  });
});
