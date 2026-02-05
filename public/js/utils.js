// =======================
// UTILS.JS - Shared Helpers
// =======================

// Scroll to bottom helper
function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight;
}

// Simple timestamp formatter
function getTimeStamp() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Example: auto-append system message
function addSystemMessage(msg) {
  const messages = document.getElementById('messages');
  const p = document.createElement('p');
  p.textContent = `[System] ${msg}`;
  p.style.fontStyle = 'italic';
  p.style.background = '#ccc';
  p.style.alignSelf = 'center';
  messages.appendChild(p);
  scrollToBottom(messages);
}
