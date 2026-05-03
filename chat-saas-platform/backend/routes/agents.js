const express = require('express');
const router = express.Router();
const { Agent, User } = require('../models');
const { protect } = require('../middleware/auth');

const planLimits = { free: 1, basic: 3, pro: 10, enterprise: 50 };

router.get('/', protect, async (req, res) => {
  try {
    const agents = await Agent.findAll({ where: { owner_id: req.user.id } });
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { name, email, role, departments } = req.body;
    const user = await User.findByPk(req.user.id);
    const currentAgents = await Agent.count({ where: { owner_id: req.user.id } });
    if (currentAgents >= planLimits[user.subscription_plan]) {
      return res.status(400).json({ message: `لقد وصلت للحد الأقصى (${planLimits[user.subscription_plan]} وكلاء)` });
    }
    const agent = await Agent.create({ owner_id: req.user.id, user_id: req.user.id, name, email, role, departments: JSON.stringify(departments) });
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/status', protect, async (req, res) => {
  try {
    const { is_online } = req.body;
    const agent = await Agent.findOne({ where: { id: req.params.id, owner_id: req.user.id } });
    if (!agent) return res.status(404).json({ message: 'الوكيل غير موجود' });
    await agent.update({ is_online });
    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const agent = await Agent.findOne({ where: { id: req.params.id, owner_id: req.user.id } });
    if (!agent) return res.status(404).json({ message: 'الوكيل غير موجود' });
    await agent.destroy();
    res.json({ message: 'تم حذف الوكيل بنجاح' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;