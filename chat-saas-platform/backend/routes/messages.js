const express = require('express');
const router = express.Router();
const { Message, Chat } = require('../models');
const { protect } = require('../middleware/auth');

router.get('/:chatId', async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { chat_id: req.params.chatId },
      order: [['created_at', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { chatId, sender, content, type, senderId } = req.body;
    const message = await Message.create({
      chat_id: chatId, sender, sender_id: senderId, content, type: type || 'text'
    });
    await Chat.update({ updated_at: new Date() }, { where: { id: chatId } });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/read/:chatId', protect, async (req, res) => {
  try {
    await Message.update(
      { is_read: true },
      { where: { chat_id: req.params.chatId, sender: 'visitor', is_read: false } }
    );
    res.json({ message: 'تم تحديد الرسائل كمقروءة' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;