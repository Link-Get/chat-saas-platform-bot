const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { protect } = require('../middleware/auth');

router.get('/settings', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['widget_color', 'widget_position', 'widget_welcome_message', 'widget_logo']
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/settings', protect, async (req, res) => {
  try {
    const { widget_color, widget_position, widget_welcome_message, widget_logo } = req.body;
    await User.update({ widget_color, widget_position, widget_welcome_message, widget_logo }, { where: { id: req.user.id } });
    res.json({ message: 'تم تحديث الإعدادات' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/code', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const widgetCode = `<!-- بداية كود الدردشة الحية -->\n<script>\n  (function() {\n    var s = document.createElement('script');\n    s.src = '${process.env.FRONTEND_URL || 'http://localhost:3000'}/widget/chat-widget.js?userId=${user.id}';\n    s.async = true;\n    document.head.appendChild(s);\n  })();\n</script>\n<!-- نهاية كود الدردشة الحية -->`;
    res.json({ code: widgetCode, userId: user.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;