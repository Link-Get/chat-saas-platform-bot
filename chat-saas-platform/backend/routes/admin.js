const express = require('express');
const router = express.Router();
const { User, Subscription, Chat, Message } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');
const { Op } = require('sequelize');

router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: 'customer' } });
    const activeSubscriptions = await Subscription.count({ where: { status: 'active' } });
    const totalChats = await Chat.count();
    const pendingPayments = await Subscription.count({ where: { payment_status: 'pending' } });
    const revenue = await Subscription.sum('price', { where: { payment_status: 'completed' } }) || 0;

    const recentUsers = await User.findAll({
      where: { role: 'customer' },
      order: [['created_at', 'DESC']],
      limit: 10,
      attributes: ['id', 'name', 'email', 'company_name', 'subscription_plan', 'created_at']
    });

    res.json({
      stats: { totalUsers, activeSubscriptions, totalChats, pendingPayments, revenue },
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'customer' },
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/users/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { is_active } = req.body;
    await User.update({ is_active }, { where: { id: req.params.id } });
    res.json({ message: 'تم التحديث' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;