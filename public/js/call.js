// =======================
// GROUP.JS - Real-time Group Chat
// =======================

document.addEventListener('DOMContentLoaded', () => {
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');
  const messages = document.getElementById('messages');
  const logoutBtn = document.getElementById('logoutBtn');

  // Check login
  const user = localStorage.getItem('chatsphere_user');
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // Connect to backend
  const socket = io('https://opschat-backend.onrender.com');

  // Dynamic group name
  const urlParams = new URLSearchParams(window.location.search);
  const groupName = urlParams.get('group') || 'General';

  // Join group
  socket.emit('joinGroup', { username: user, group: groupName });
  addSystemMessage(`You joined ${groupName}`, 'messages');

  // Receive messages
  socket.on('receiveMessage', msgObj => {
    addUserMessage(msgObj.username, msgObj.message, msgObj.username === user, 'messages');
  });

  // System messages
  socket.on('systemMessage', msg => addSystemMessage(msg, 'messages'));

  // Send message
  messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const msg = messageInput.value.trim();
    if (!msg) return;

    socket.emit('sendMessage', { group: groupName, message: msg });
    addUserMessage(user, msg, true, 'messages');
    messageInput.value = '';
  });

  // Logout
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('chatsphere_user');
    window.location.href = 'login.html';
  });
});
