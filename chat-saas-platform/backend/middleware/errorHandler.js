const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({ message: 'خطأ في التحقق', errors: messages });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ message: 'البيانات موجودة بالفعل' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'توكن غير صالح' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'خطأ في الخادم',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
