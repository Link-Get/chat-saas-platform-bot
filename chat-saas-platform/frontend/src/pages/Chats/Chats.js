import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Send, Paperclip, Smile, MoreVertical, Phone, Video } from 'lucide-react';
import io from 'socket.io-client';

const Chats = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setChats([
      { id: 1, visitor_name: 'زائر #1001', visitor_country: 'مصر', status: 'active', last_message: 'مرحباً، لدي سؤال', updated_at: new Date() },
      { id: 2, visitor_name: 'زائر #1002', visitor_country: 'السعودية', status: 'active', last_message: 'كيف يمكنني الشراء؟', updated_at: new Date() },
      { id: 3, visitor_name: 'زائر #1003', visitor_country: 'الإمارات', status: 'pending', last_message: '', updated_at: new Date() }
    ]);

    const newSocket = io('http://localhost:5000');
    newSocket.emit('agent_join', { agentId: user?.id, userId: user?.id });
    newSocket.on('new_message', (data) => {
      if (data.chatId === selectedChat?.id) {
        setMessages(prev => [...prev, data.message]);
      }
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const selectChat = (chat) => {
    setSelectedChat(chat);
    setMessages([
      { id: 1, sender: 'visitor', content: 'مرحباً، لدي استفسار عن المنتج', created_at: new Date(Date.now() - 3600000) },
      { id: 2, sender: 'agent', content: 'أهلاً بك! تفضل، أنا هنا للمساعدة', created_at: new Date(Date.now() - 3500000) },
      { id: 3, sender: 'visitor', content: 'هل يتوفر خصم على الخطة السنوية؟', created_at: new Date(Date.now() - 3000000) }
    ]);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    const msg = { id: Date.now(), sender: 'agent', content: newMessage, created_at: new Date() };
    setMessages(prev => [...prev, msg]);
    if (socket) socket.emit('send_message', { chatId: selectedChat.id, content: newMessage, sender: 'agent', senderId: user?.id });
    setNewMessage('');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6">
      <div className="w-80 card flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">المحادثات</h2>
          <p className="text-sm text-gray-500">{chats.filter(c => c.status === 'active').length} محادثة نشطة</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button key={chat.id} onClick={() => selectChat(chat)} className={`w-full text-right p-4 border-b border-gray-50 hover:bg-gray-50 transition ${selectedChat?.id === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${chat.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{chat.visitor_name}</p>
                  <p className="text-sm text-gray-500 truncate">{chat.last_message || 'لا توجد رسائل'}</p>
                </div>
                <span className="text-xs text-gray-400">{chat.visitor_country}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedChat ? (
        <div className="flex-1 card flex flex-col">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedChat.visitor_name}</p>
                <p className="text-sm text-gray-500">{selectedChat.visitor_country} • {selectedChat.status === 'active' ? 'متصل' : 'غير متصل'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg"><Phone className="w-5 h-5 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg"><Video className="w-5 h-5 text-gray-600" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical className="w-5 h-5 text-gray-600" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                  msg.sender === 'agent' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-gray-100 text-gray-900 rounded-tl-none'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'agent' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {new Date(msg.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg"><Paperclip className="w-5 h-5 text-gray-500" /></button>
              <button className="p-2 hover:bg-gray-100 rounded-lg"><Smile className="w-5 h-5 text-gray-500" /></button>
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="اكتب رسالتك..." className="flex-1 input-field" />
              <button onClick={sendMessage} className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"><Send className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 card flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">اختر محادثة لبدء الدردشة</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chats;