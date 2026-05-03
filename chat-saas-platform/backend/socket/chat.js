const { Chat, Message, Agent } = require('../models');

module.exports = (io) => {
  const connectedUsers = new Map();
  const connectedAgents = new Map();

  io.on('connection', (socket) => {
    console.log('🔌 متصل:', socket.id);

    socket.on('visitor_join', async (data) => {
      const { visitorId, userId } = data;
      socket.visitorId = visitorId;
      socket.userId = userId;
      connectedUsers.set(visitorId, socket.id);
      io.to(`user_${userId}`).emit('visitor_online', { visitorId, socketId: socket.id });
    });

    socket.on('agent_join', async (data) => {
      const { agentId, userId } = data;
      socket.agentId = agentId;
      socket.userId = userId;
      connectedAgents.set(agentId, socket.id);
      socket.join(`user_${userId}`);
      await Agent.update({ is_online: true }, { where: { id: agentId } });
      io.to(`user_${userId}`).emit('agent_online', { agentId });
    });

    socket.on('send_message', async (data) => {
      try {
        const { chatId, content, sender, senderId, type } = data;
        const message = await Message.create({
          chat_id: chatId, sender, sender_id: senderId, content, type: type || 'text'
        });
        await Chat.update({ updated_at: new Date() }, { where: { id: chatId } });

        const chat = await Chat.findByPk(chatId);
        if (sender === 'visitor') {
          io.to(`user_${chat.user_id}`).emit('new_message', { message, chatId });
        } else {
          const visitorSocket = connectedUsers.get(chat.visitor_id);
          if (visitorSocket) io.to(visitorSocket).emit('new_message', { message, chatId });
        }
        socket.emit('message_sent', { message });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('typing', (data) => {
      const { chatId, isTyping, sender } = data;
      // يمكن إضافة منطق لإرسال حالة الكتابة
    });

    socket.on('disconnect', async () => {
      console.log('🔌 غير متصل:', socket.id);
      if (socket.agentId) {
        connectedAgents.delete(socket.agentId);
        await Agent.update({ is_online: false }, { where: { id: socket.agentId } });
        if (socket.userId) io.to(`user_${socket.userId}`).emit('agent_offline', { agentId: socket.agentId });
      }
      if (socket.visitorId) connectedUsers.delete(socket.visitorId);
    });
  });
};