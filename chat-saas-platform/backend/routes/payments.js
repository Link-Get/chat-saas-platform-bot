const express = require('express');
const router = express.Router();
const { PaymentSettings } = require('../models');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/local-settings', protect, async (req, res) => {
  try {
    const settings = await PaymentSettings.findAll();
    const safeSettings = {};
    settings.forEach(s => {
      safeSettings[s.method] = {
        enabled: s.enabled,
        instructions: s.instructions,
        accountName: s.account_name,
        accountNumber: s.account_number ? s.account_number.slice(0, 4) + '****' + s.account_number.slice(-4) : ''
      };
    });
    res.json(safeSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/local-settings', protect, adminOnly, async (req, res) => {
  try {
    const { vodafone_cash, instapay } = req.body;
    if (vodafone_cash) {
      await PaymentSettings.update(vodafone_cash, { where: { method: 'vodafone_cash' } });
    }
    if (instapay) {
      await PaymentSettings.update(instapay, { where: { method: 'instapay' } });
    }
    const settings = await PaymentSettings.findAll();
    res.json({ message: 'تم التحديث', settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/admin-settings', protect, adminOnly, async (req, res) => {
  try {
    const settings = await PaymentSettings.findAll();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;