// =======================
// UTILS.JS - Shared Helpers
// =======================

// Scrolls any container to the bottom
function scrollToBottom(element) {
  element.scrollTop = element.scrollHeight;
}

// Returns a formatted timestamp (HH:MM)
function getTimeStamp() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Append a system message to a chat container
function addSystemMessage(msg, containerId = 'messages') {
  const messages = document.getElementById(containerId);
  if (!messages) return;

  const p = document.createElement('p');
  p.textContent = `[System] ${msg}`;
  p.style.fontStyle = 'italic';
  p.style.color = '#555';
  p.style.alignSelf = 'center';
  p.style.background = 'rgba(200,200,200,0.3)';
  p.style.padding = '6px 12px';
  p.style.borderRadius = '12px';
  p.style.margin = '6px 0';

  messages.appendChild(p);
  scrollToBottom(messages);
}

// Append a user message to a chat container
function addUserMessage(username, msg, isSelf = false, containerId = 'messages') {
  const messages = document.getElementById(containerId);
  if (!messages) return;

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

  // Styling
  p.style.padding = '10px 15px';
  p.style.borderRadius = '20px';
  p.style.margin = '6px 0';
  p.style.maxWidth = '70%';
  p.style.wordBreak = 'break-word';
  p.style.alignSelf = isSelf ? 'flex-end' : 'flex-start';
  p.style.background = isSelf ? '#4facfe' : '#e0e0e0';
  p.style.color = isSelf ? '#fff' : '#000';

  messages.appendChild(p);
  scrollToBottom(messages);
}
