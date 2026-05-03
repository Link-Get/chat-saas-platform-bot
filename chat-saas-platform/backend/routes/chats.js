const express = require('express');
const router = express.Router();
const { Chat, Message, Agent } = require('../models');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const chats = await Chat.findAll({
      where: { user_id: req.user.id },
      order: [['updated_at', 'DESC']],
      include: [{ model: Agent, as: 'agent', attributes: ['name', 'avatar'] }]
    });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/visitor', async (req, res) => {
  try {
    const { visitorId, visitorName, visitorEmail, visitorIP, visitorCountry, visitorBrowser, visitorPage, userId } = req.body;
    let chat = await Chat.findOne({ where: { visitor_id: visitorId, user_id: userId, status: 'active' } });
    if (!chat) {
      chat = await Chat.create({ user_id: userId, visitor_id: visitorId, visitor_name: visitorName, visitor_email: visitorEmail, visitor_ip: visitorIP, visitor_country: visitorCountry, visitor_browser: visitorBrowser, visitor_page: visitorPage });
    }
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/close', protect, async (req, res) => {
  try {
    const chat = await Chat.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!chat) return res.status(404).json({ message: 'الدردشة غير موجودة' });
    await chat.update({ status: 'closed', closed_at: new Date() });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/rate', async (req, res) => {
  try {
    const { score, comment } = req.body;
    const chat = await Chat.findByPk(req.params.id);
    if (!chat) return res.status(404).json({ message: 'الدردشة غير موجودة' });
    await chat.update({ rating_score: score, rating_comment: comment });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;