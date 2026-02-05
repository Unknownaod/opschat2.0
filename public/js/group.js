// =======================
// GROUP.JS - Real-time Group Chat with MongoDB Backend
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

  // Get dynamic group from URL (?group=GroupName)
  const urlParams = new URLSearchParams(window.location.search);
  const groupName = urlParams.get('group') || 'General';

  // Join group
  socket.emit('joinGroup', { username: user, group: groupName });

  // Show system message locally
  addSystemMessage(`You joined ${groupName}`, 'messages');

  // =======================
  // Receive previous + new messages
  // =======================
  socket.on('receiveMessage', (msgObj) => {
    addUserMessage(msgObj.username, msgObj.message, msgObj.username === user, 'messages');
  });

  // System messages (user joined/left)
  socket.on('systemMessage', (msg) => addSystemMessage(msg, 'messages'));

  // =======================
  // Send message
  // =======================
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = messageInput.value.trim();
    if (!msg) return;

    // Emit message to backend
    socket.emit('sendMessage', { group: groupName, message: msg });

    // Display immediately
    addUserMessage(user, msg, true, 'messages');
    messageInput.value = '';
  });

  // =======================
  // Logout
  // =======================
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('chatsphere_user');
    window.location.href = 'login.html';
  });
});
