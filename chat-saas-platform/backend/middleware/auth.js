const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
      if (!req.user) {
        return res.status(401).json({ message: 'المستخدم غير موجود' });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'غير مصرح، توكن غير صالح' });
    }
  } else {
    res.status(401).json({ message: 'غير مصرح، لا يوجد توكن' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'غير مصرح، يتطلب صلاحيات مشرف' });
  }
};

module.exports = { protect, adminOnly };
