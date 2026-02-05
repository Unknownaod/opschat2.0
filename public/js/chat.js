// =======================
// CHAT.JS - Messages + Emoji/Sticker Support + MongoDB Backend
// =======================

document.addEventListener('DOMContentLoaded', () => {
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');
  const messages = document.getElementById('messages');
  const logoutBtn = document.getElementById('logoutBtn');
  const chatList = document.getElementById('chatList');
  const newChatBtn = document.getElementById('newChatBtn');

  // =======================
  // Check login
  // =======================
  const user = localStorage.getItem('chatsphere_user');
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // =======================
  // Socket.IO connection
  // =======================
  const socket = io('https://opschat-backend.onrender.com');

  // =======================
  // Active chat tracking
  // =======================
  let activeChat = null; // will store the username or private room

  // =======================
  // Handle new private chat
  // =======================
  newChatBtn.addEventListener('click', async () => {
    const searchName = prompt("Enter username or handle to start a chat:");
    if (!searchName) return;

    // Search user via backend
    const res = await fetch(`https://opschat-backend.onrender.com/searchUser?username=${encodeURIComponent(searchName)}`);
    const data = await res.json();

    if (!data.found) {
      alert("User not found!");
      return;
    }

    const chatId = `private_${[user, data.username].sort().join('_')}`; // unique private chat ID

    // Join private room
    if (activeChat) socket.emit('leaveRoom', { room: activeChat });
    socket.emit('joinRoom', { room: chatId, username: user });
    activeChat = chatId;

    // Add to chat list if not exists
    if (![...chatList.children].some(li => li.textContent === data.username)) {
      const li = document.createElement('li');
      li.textContent = data.username;
      li.addEventListener('click', () => switchChat(data.username));
      chatList.appendChild(li);
    }

    // Clear messages for new chat
    messages.innerHTML = '';
  });

  // =======================
  // Switch to a different chat
  // =======================
  function switchChat(targetUser) {
    const newRoom = `private_${[user, targetUser].sort().join('_')}`;
    if (activeChat) socket.emit('leaveRoom', { room: activeChat });
    socket.emit('joinRoom', { room: newRoom, username: user });
    activeChat = newRoom;
    messages.innerHTML = '';
  }

  // =======================
  // Receive messages
  // =======================
  socket.on('receiveMessage', (msgObj) => {
    // Only display if message belongs to the active chat
    if (msgObj.room === activeChat) {
      appendMessage(msgObj.username, msgObj.message, msgObj.time);
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

    socket.emit('sendMessage', { room: activeChat, message: msg, username: user });
    appendMessage(user, msg, new Date().toISOString());
    messageInput.value = '';
  });

  // =======================
  // Append message helper
  // =======================
  function appendMessage(sender, msg, timestamp) {
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
    } else if (sender !== 'System') {
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
    localStorage.removeItem('chatsphere_user');
    window.location.href = 'login.html';
  });
});
