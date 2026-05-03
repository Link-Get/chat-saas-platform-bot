const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../models');
const { protect } = require('../middleware/auth');

// توليد توكن
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @route   POST /api/auth/register
// @desc    تسجيل مستخدم جديد
// @access  Public
router.post('/register', [
  body('name').notEmpty().withMessage('الاسم مطلوب'),
  body('email').isEmail().withMessage('بريد إلكتروني غير صالح'),
  body('password').isLength({ min: 6 }).withMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, companyName, phone } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
    }

    const user = await User.create({
      name,
      email,
      password,
      company_name: companyName,
      phone
    });

    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription_plan: user.subscription_plan,
        subscription_status: user.subscription_status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    تسجيل الدخول
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'بريد إلكتروني أو كلمة مرور غير صحيحة' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'بريد إلكتروني أو كلمة مرور غير صحيحة' });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription_plan: user.subscription_plan,
        subscription_status: user.subscription_status,
        widget_color: user.widget_color,
        widget_position: user.widget_position,
        widget_welcome_message: user.widget_welcome_message
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    الحصول على بيانات المستخدم
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    تحديث الملف الشخصي
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, company_name, phone } = req.body;
    await User.update(
      { name, company_name, phone },
      { where: { id: req.user.id } }
    );
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
