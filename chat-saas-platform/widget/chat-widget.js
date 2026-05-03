(function() {
  'use strict';

  const scriptTag = document.currentScript;
  const userId = new URL(scriptTag.src).searchParams.get('userId');

  if (!userId) { console.error('Chat Widget: userId required'); return; }

  const config = {
    apiUrl: window.location.origin + '/chatbot/api',
    position: 'right',
    color: '#0084ff',
    welcomeMessage: 'مرحباً! كيف يمكننا مساعدتك؟',
    title: 'دعم العملاء',
    subtitle: 'متصل الآن'
  };

  const visitorId = localStorage.getItem('chat_visitor_id') || 'visitor_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('chat_visitor_id', visitorId);

  let currentChatId = null;
  let isOpen = false;
  let pollInterval = null;

  function createWidget() {
    const container = document.createElement('div');
    container.id = 'chat-widget-container';
    container.style.cssText = 'position:fixed;bottom:20px;' + config.position + ':20px;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'chat-widget-toggle';
    toggleBtn.style.cssText = 'width:60px;height:60px;border-radius:50%;background:' + config.color + ';border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;transition:all 0.3s;';
    toggleBtn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';

    const chatWindow = document.createElement('div');
    chatWindow.id = 'chat-widget-window';
    chatWindow.style.cssText = 'position:absolute;bottom:80px;' + config.position + ':0;width:360px;height:520px;background:white;border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.15);display:none;flex-direction:column;overflow:hidden;direction:rtl;';

    const header = document.createElement('div');
    header.style.cssText = 'background:' + config.color + ';color:white;padding:16px;display:flex;align-items:center;gap:12px;flex-shrink:0;';
    header.innerHTML = '<div style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div><div><div style="font-weight:600;font-size:16px;">' + config.title + '</div><div style="font-size:12px;opacity:0.9;display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;background:#4ade80;border-radius:50%;display:inline-block;"></span>' + config.subtitle + '</div></div>';

    const messagesArea = document.createElement('div');
    messagesArea.id = 'chat-messages';
    messagesArea.style.cssText = 'flex:1;padding:16px;overflow-y:auto;display:flex;flex-direction:column;gap:12px;background:#f8fafc;';

    addMessage(messagesArea, config.welcomeMessage, 'agent');

    const inputArea = document.createElement('div');
    inputArea.style.cssText = 'padding:12px;border-top:1px solid #e2e8f0;display:flex;gap:8px;background:white;flex-shrink:0;';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'اكتب رسالتك...';
    input.style.cssText = 'flex:1;padding:10px 16px;border:1px solid #e2e8f0;border-radius:24px;outline:none;font-size:14px;direction:rtl;';

    const sendBtn = document.createElement('button');
    sendBtn.style.cssText = 'width:40px;height:40px;border-radius:50%;background:' + config.color + ';border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;';
    sendBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>';

    inputArea.appendChild(input);
    inputArea.appendChild(sendBtn);

    chatWindow.appendChild(header);
    chatWindow.appendChild(messagesArea);
    chatWindow.appendChild(inputArea);
    container.appendChild(toggleBtn);
    container.appendChild(chatWindow);
    document.body.appendChild(container);

    toggleBtn.addEventListener('click', () => {
      isOpen = !isOpen;
      chatWindow.style.display = isOpen ? 'flex' : 'none';
      if (isOpen) { initChat(); startPolling(); }
      else { stopPolling(); }
    });

    const sendMessage = () => {
      const text = input.value.trim();
      if (!text || !currentChatId) return;
      addMessage(messagesArea, text, 'visitor');
      input.value = '';
      messagesArea.scrollTop = messagesArea.scrollHeight;

      fetch(config.apiUrl + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: currentChatId, sender: 'visitor', content: text, type: 'text' })
      });
    };

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
  }

  function addMessage(container, text, sender) {
    const msgDiv = document.createElement('div');
    const isVisitor = sender === 'visitor';
    msgDiv.style.cssText = isVisitor 
      ? 'align-self:flex-start;background:' + config.color + ';color:white;padding:10px 14px;border-radius:16px 16px 16px 4px;max-width:80%;font-size:14px;line-height:1.5;word-wrap:break-word;'
      : 'align-self:flex-end;background:white;padding:10px 14px;border-radius:16px 16px 4px 16px;max-width:80%;font-size:14px;line-height:1.5;box-shadow:0 1px 2px rgba(0,0,0,0.05);word-wrap:break-word;';
    msgDiv.textContent = text;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
  }

  async function initChat() {
    if (currentChatId) return;
    try {
      const res = await fetch(config.apiUrl + '/chats/visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          visitorId, userId, visitorName: 'زائر', visitorIP: '', 
          visitorCountry: '', visitorBrowser: navigator.userAgent, visitorPage: window.location.href 
        })
      });
      const data = await res.json();
      currentChatId = data.id;
    } catch (e) { console.error('Init chat failed:', e); }
  }

  function startPolling() {
    if (pollInterval) return;
    pollInterval = setInterval(async () => {
      if (!currentChatId) return;
      try {
        const res = await fetch(config.apiUrl + '/messages/' + currentChatId);
        const messages = await res.json();
        const messagesArea = document.getElementById('chat-messages');
        if (messagesArea) {
          messagesArea.innerHTML = '';
          messages.forEach(msg => addMessage(messagesArea, msg.content, msg.sender));
        }
      } catch (e) {}
    }, 3000);
  }

  function stopPolling() {
    if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
  }

  fetch(config.apiUrl + '/widgets/settings?userId=' + userId)
    .then(r => r.json())
    .then(data => {
      if (data.widget_color) config.color = data.widget_color;
      if (data.widget_position) config.position = data.widget_position;
      if (data.widget_welcome_message) config.welcome_message = data.widget_welcome_message;
      createWidget();
    })
    .catch(() => createWidget());
})();