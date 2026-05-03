require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const { sequelize, syncDatabase } = require('./models');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - Widget
app.use('/widget', express.static(path.join(__dirname, '../widget')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/chats', require('./routes/chats'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/agents', require('./routes/agents'));
app.use('/api/widgets', require('./routes/widgets'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Chat SaaS API', 
    version: '1.0.0', 
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use(errorHandler);

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'المسار غير موجود' });
});

// Passenger compatibility
if (typeof PhusionPassenger !== 'undefined') {
  PhusionPassenger.configure({ autoInstall: false });
}

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Connected');
    await syncDatabase();

    if (typeof PhusionPassenger !== 'undefined') {
      app.listen('passenger');
      console.log('🚀 Running under Passenger');
    } else {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to start:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
